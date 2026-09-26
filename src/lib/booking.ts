// Shared booking domain types/constants. Once GoHighLevel is connected (the
// three GHL_* env vars in lib/ghl.ts), real availability comes live from the
// client's GHL calendar. Until then, `previewAvailability()` generates
// standard business-hours slots so the calendar is fully usable — visitors
// pick a time and send it as a request instead of booking it outright.

// Go Rob Lacy's office is in Manhattan, KS (goroblacy.com) — Central Time.
export const BUSINESS_TIMEZONE = "America/Chicago";
export const TIMEZONE_LABEL = "CT";

export type BookingDay = { iso: string; slots: string[] };
export type Availability = {
  days: BookingDay[];
  slotMinutes: number;
  /** true = live GHL availability (bookings land on the calendar); false = pre-connection request mode. */
  live: boolean;
};

const PREVIEW_DAYS = 10; // weekdays
const PREVIEW_FIRST_HOUR = 9; // 9:00 AM
const PREVIEW_LAST_HOUR = 16; // last start 4:00 PM (ends 5:00 PM)
const PREVIEW_SLOT_MINUTES = 60;

/** Milliseconds `timeZone` is ahead of UTC at `date`. */
function tzOffsetMs(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return asUtc - date.getTime();
}

/** The UTC instant of a wall-clock time in `timeZone` (DST-safe for business hours). */
function wallTimeToUtc(y: number, m: number, d: number, hour: number, timeZone: string): Date {
  const guess = Date.UTC(y, m - 1, d, hour);
  const first = tzOffsetMs(new Date(guess), timeZone);
  const second = tzOffsetMs(new Date(guess - first), timeZone);
  return new Date(guess - second);
}

/** Pre-connection availability: the next weekdays, hourly, business hours in CT. */
export function previewAvailability(now = new Date()): Availability {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: BUSINESS_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(now)
    .split("-")
    .map(Number);

  const days: BookingDay[] = [];
  for (let offset = 1; days.length < PREVIEW_DAYS && offset < 30; offset++) {
    const date = new Date(Date.UTC(today[0], today[1] - 1, today[2] + offset));
    const weekday = date.getUTCDay();
    if (weekday === 0 || weekday === 6) continue;
    const y = date.getUTCFullYear();
    const m = date.getUTCMonth() + 1;
    const d = date.getUTCDate();
    const slots: string[] = [];
    for (let h = PREVIEW_FIRST_HOUR; h <= PREVIEW_LAST_HOUR; h++) {
      slots.push(wallTimeToUtc(y, m, d, h, BUSINESS_TIMEZONE).toISOString());
    }
    days.push({ iso: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`, slots });
  }

  return { days, slotMinutes: PREVIEW_SLOT_MINUTES, live: false };
}
