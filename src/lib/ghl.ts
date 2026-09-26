import { BUSINESS_TIMEZONE, type Availability, type BookingDay } from "./booking";
import { GHL_FIELD_MESSAGE, GHL_FIELD_ROLE } from "./leadForm";

// GoHighLevel v3 API client. Once connected it is the booking calendar's
// source of truth for live
// availability, and where a completed booking actually lands (a contact
// record + a real appointment on the dedicated calendar). Requires three
// Vercel env vars: GHL_API_KEY (Private Integration token), GHL_LOCATION_ID,
// GHL_CALENDAR_ID. Until all three are set, the site runs in request mode
// (see lib/booking.ts) and never calls GHL.

const GHL_BASE = "https://services.leadconnectorhq.com";
const GHL_VERSION = "v3";
const REQUEST_TIMEOUT_MS = 10_000;
const DEFAULT_SLOT_MINUTES = 60;
const DAYS_AHEAD = 21; // GHL's free-slots range cap is 31 days

export class GhlConfigError extends Error {
  constructor(missing: string) {
    super(`GoHighLevel not configured: missing ${missing}`);
    this.name = "GhlConfigError";
  }
}

export class GhlApiError extends Error {
  status: number;
  constructor(op: string, status: number, body: string) {
    super(`GHL ${op} failed (${status}): ${body.slice(0, 300)}`);
    this.name = "GhlApiError";
    this.status = status;
  }
}

type EnvName = "GHL_API_KEY" | "GHL_LOCATION_ID" | "GHL_CALENDAR_ID";

function requiredEnv(name: EnvName): string {
  const value = process.env[name];
  if (!value || !value.trim()) throw new GhlConfigError(name);
  return value.trim();
}

export function ghlConfigured(): boolean {
  return !!(
    process.env.GHL_API_KEY?.trim() &&
    process.env.GHL_LOCATION_ID?.trim() &&
    process.env.GHL_CALENDAR_ID?.trim()
  );
}

async function safeText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

async function ghlFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const apiKey = requiredEnv("GHL_API_KEY");
  return fetch(`${GHL_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Version: GHL_VERSION,
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
}

/** Smallest positive gap between consecutive slots, across all days — used as the meeting length. */
function deriveSlotMinutes(byDay: Record<string, string[]>): number {
  let best: number | null = null;
  for (const slots of Object.values(byDay)) {
    for (let i = 1; i < slots.length; i++) {
      const gapMin = Math.round((new Date(slots[i]).getTime() - new Date(slots[i - 1]).getTime()) / 60_000);
      if (gapMin > 0 && (best === null || gapMin < best)) best = gapMin;
    }
  }
  return best ?? DEFAULT_SLOT_MINUTES;
}

/** Live availability for the dedicated booking calendar, next `DAYS_AHEAD` days. */
export async function getAvailability(): Promise<Availability> {
  const calendarId = requiredEnv("GHL_CALENDAR_ID");

  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() + 1);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + DAYS_AHEAD);

  const params = new URLSearchParams({
    startDate: String(start.getTime()),
    endDate: String(end.getTime()),
    timezone: BUSINESS_TIMEZONE,
  });

  const res = await ghlFetch(`/calendars/${calendarId}/free-slots?${params.toString()}`);
  if (!res.ok) throw new GhlApiError("free-slots", res.status, await safeText(res));
  const data = await res.json();

  const byDay: Record<string, string[]> = {};
  for (const [key, value] of Object.entries((data as Record<string, unknown>) ?? {})) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) continue; // skip non-date keys (traceId, etc.)
    const slots = (value as { slots?: unknown } | undefined)?.slots;
    if (Array.isArray(slots)) {
      byDay[key] = slots.filter((s): s is string => typeof s === "string");
    }
  }

  const days: BookingDay[] = Object.keys(byDay)
    .sort()
    .map((iso) => ({ iso, slots: byDay[iso] }))
    .filter((d) => d.slots.length > 0);

  return { days, slotMinutes: deriveSlotMinutes(byDay), live: true };
}

type CustomFieldDef = { id: string; name: string };
let fieldCache: { at: number; fields: CustomFieldDef[] } | null = null;
const FIELD_CACHE_MS = 5 * 60 * 1000;

async function listCustomFields(): Promise<CustomFieldDef[]> {
  if (fieldCache && Date.now() - fieldCache.at < FIELD_CACHE_MS) return fieldCache.fields;
  const locationId = requiredEnv("GHL_LOCATION_ID");
  const res = await ghlFetch(`/locations/${locationId}/customFields?model=contact`);
  if (!res.ok) throw new GhlApiError("locations/customFields", res.status, await safeText(res));
  const data = await res.json();
  const raw = (data as { customFields?: unknown })?.customFields;
  const fields: CustomFieldDef[] = Array.isArray(raw)
    ? raw
        .filter(
          (f): f is { id: string; name: string } =>
            !!f && typeof (f as Record<string, unknown>).id === "string" && typeof (f as Record<string, unknown>).name === "string"
        )
        .map((f) => ({ id: f.id, name: f.name }))
    : [];
  fieldCache = { at: Date.now(), fields };
  return fields;
}

async function findCustomFieldId(name: string): Promise<string | null> {
  const fields = await listCustomFields();
  return fields.find((f) => f.name.trim().toLowerCase() === name.trim().toLowerCase())?.id ?? null;
}

/** Never blocks a booking on custom-field metadata being unreachable. */
async function tryFindCustomFieldId(name: string): Promise<string | null> {
  try {
    return await findCustomFieldId(name);
  } catch (err) {
    console.error(`GHL custom field lookup failed for "${name}":`, err);
    return null;
  }
}

export async function upsertContact(input: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  roleLabel: string;
  message: string;
}): Promise<string> {
  const locationId = requiredEnv("GHL_LOCATION_ID");

  const customFields: { id: string; fieldValue: string }[] = [];
  const roleFieldId = await tryFindCustomFieldId(GHL_FIELD_ROLE);
  if (roleFieldId) {
    customFields.push({ id: roleFieldId, fieldValue: input.roleLabel });
  }
  if (input.message) {
    const messageFieldId = await tryFindCustomFieldId(GHL_FIELD_MESSAGE);
    if (messageFieldId) {
      customFields.push({ id: messageFieldId, fieldValue: input.message });
    }
  }

  const res = await ghlFetch("/contacts/upsert", {
    method: "POST",
    body: JSON.stringify({
      locationId,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      ...(input.companyName ? { companyName: input.companyName } : {}),
      source: "Go Rob Lacy dealership site /book",
      tags: ["website-booking", "dealership-site"],
      ...(customFields.length ? { customFields } : {}),
    }),
  });
  if (!res.ok) throw new GhlApiError("contacts/upsert", res.status, await safeText(res));
  const data = await res.json();
  const contactId = (data as { contact?: { id?: unknown } })?.contact?.id;
  if (typeof contactId !== "string" || !contactId) {
    throw new GhlApiError("contacts/upsert", 200, "response missing contact.id");
  }
  return contactId;
}

export async function createAppointment(input: {
  contactId: string;
  startTime: string;
  slotMinutes: number;
  title: string;
}): Promise<string> {
  const locationId = requiredEnv("GHL_LOCATION_ID");
  const calendarId = requiredEnv("GHL_CALENDAR_ID");
  const endTime = new Date(new Date(input.startTime).getTime() + input.slotMinutes * 60_000).toISOString();

  const res = await ghlFetch("/calendars/events/appointments", {
    method: "POST",
    body: JSON.stringify({
      calendarId,
      locationId,
      contactId: input.contactId,
      startTime: input.startTime,
      endTime,
      title: input.title,
      appointmentStatus: "confirmed",
      toNotify: true,
    }),
  });
  if (!res.ok) throw new GhlApiError("calendars/events/appointments", res.status, await safeText(res));
  const data = await res.json();
  const id = (data as { id?: unknown })?.id;
  if (typeof id !== "string" || !id) {
    throw new GhlApiError("calendars/events/appointments", 200, "response missing id");
  }
  return id;
}
