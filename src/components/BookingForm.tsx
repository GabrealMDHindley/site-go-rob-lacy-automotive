"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { site } from "@/data/site";
import { TIMEZONE_LABEL, BUSINESS_TIMEZONE, type Availability } from "@/lib/booking";
import { ROLE_OPTIONS } from "@/lib/leadForm";

type Status = "idle" | "sending" | "error" | "requested";
type LoadState = "loading" | "ready" | "error";

const dayFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  timeZone: BUSINESS_TIMEZONE,
});
const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: BUSINESS_TIMEZONE,
});

const inputClass =
  "w-full rounded-lg border border-white/10 bg-surface px-4 py-3 text-sm text-ink outline-none transition focus:border-accent-deep";
const labelClass = "mb-1.5 block text-xs uppercase tracking-wide text-ink-dim";

// The site's own booking calendar. Live mode (GoHighLevel connected): real
// availability from the client's GHL calendar, and "Confirm Booking" creates
// the contact + appointment there. Request mode (before GHL is connected):
// business-hours slots, and "Request This Time" opens a pre-filled email to
// the client with the chosen time and details — no lead is ever dropped.
export default function BookingForm() {
  const router = useRouter();
  const [load, setLoad] = useState<LoadState>("loading");
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [dayIso, setDayIso] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/book/availability", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data: Availability) => {
        if (cancelled) return;
        setAvailability({ days: data.days, slotMinutes: data.slotMinutes, live: data.live === true });
        setLoad("ready");
      })
      .catch(() => {
        if (!cancelled) setLoad("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedDay = availability?.days.find((d) => d.iso === dayIso) ?? null;
  const live = availability?.live === true;

  function slotLabel(slot: string) {
    return `${dayFormatter.format(new Date(slot))} · ${timeFormatter.format(new Date(slot))} ${TIMEZONE_LABEL}`;
  }

  function requestByEmail(data: Record<string, FormDataEntryValue>, slot: string) {
    const role = ROLE_OPTIONS.find((opt) => opt.value === data.role)?.label ?? "";
    const lines = [
      `Requested time: ${slotLabel(slot)}`,
      "",
      `Name: ${data.firstName ?? ""} ${data.lastName ?? ""}`.trim(),
      `Email: ${data.email ?? ""}`,
      `Phone: ${data.phone ?? ""}`,
    ];
    if (data.companyName) lines.push(`Dealership: ${data.companyName}`);
    if (role) lines.push(`Which best describes me: ${role}`);
    if (data.message) lines.push(`What I'd like help with: ${data.message}`);
    lines.push("", "(Sent from the booking calendar on the Go Rob Lacy dealership site.)");
    const href = `mailto:${site.email}?subject=${encodeURIComponent(
      `Call request — ${slotLabel(slot)}`
    )}&body=${encodeURIComponent(lines.join("\n"))}`;
    window.location.href = href;
    setStatus("requested");
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!startTime) {
      setStatus("error");
      setErrorMsg("Pick a day and a time first.");
      return;
    }

    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    if (!live) {
      requestByEmail(data, startTime);
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, startTime }),
      });
      if (res.ok) {
        router.push("/confirmation");
        return;
      }
      const resBody = await res.json().catch(() => ({}));
      if (resBody?.reason === "slot_taken") {
        setErrorMsg("That time was just booked by someone else — pick another.");
      } else {
        setErrorMsg("Something went wrong booking that slot.");
      }
      setStatus("error");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong booking that slot.");
    }
  }

  const mailtoHref = `mailto:${site.email}?subject=${encodeURIComponent(
    "Booking request from the Go Rob Lacy dealership site"
  )}`;

  const reachUs = (
    <>
      <a href={mailtoHref} className="text-accent underline">
        email {site.email}
      </a>{" "}
      or call{" "}
      <a href={site.phoneHref} className="text-accent underline">
        {site.phone}
      </a>
    </>
  );

  if (load === "loading") {
    return <p className="text-sm text-ink-dim">Loading available times…</p>;
  }

  if (load === "error" || !availability || availability.days.length === 0) {
    return (
      <p className="text-sm text-ink-dim">
        We couldn&rsquo;t load the calendar right now — {reachUs} and we&rsquo;ll get you
        booked.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {!live && (
        <p className="rounded-lg border border-accent-deep/30 bg-accent-deep/10 px-4 py-3 text-sm text-ink-dim">
          Pick a day and time that works for you and send it over — we&rsquo;ll confirm
          your call by phone or email.
        </p>
      )}

      <div>
        <p className="mb-3 text-xs uppercase tracking-wide text-ink-dim">Pick a day</p>
        <div className="flex flex-wrap gap-2">
          {availability.days.map((d) => (
            <button
              key={d.iso}
              type="button"
              onClick={() => {
                setDayIso(d.iso);
                setStartTime(null);
              }}
              className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                dayIso === d.iso
                  ? "border-accent bg-accent text-ground"
                  : "border-white/10 text-ink-dim hover:border-white/25 hover:text-ink"
              }`}
              aria-pressed={dayIso === d.iso}
            >
              {dayFormatter.format(new Date(d.slots[0]))}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs uppercase tracking-wide text-ink-dim">
          Pick a time ({TIMEZONE_LABEL})
        </p>
        <div className="flex flex-wrap gap-2">
          {!selectedDay && <p className="text-xs text-ink-dim/70">Pick a day first.</p>}
          {selectedDay?.slots.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => setStartTime(slot)}
              className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                startTime === slot
                  ? "border-accent bg-accent text-ground"
                  : "border-white/10 text-ink-dim hover:border-white/25 hover:text-ink"
              }`}
              aria-pressed={startTime === slot}
            >
              {timeFormatter.format(new Date(slot))}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className={labelClass}>
            First Name
          </label>
          <input id="firstName" name="firstName" autoComplete="given-name" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>
            Last Name
          </label>
          <input id="lastName" name="lastName" autoComplete="family-name" required className={inputClass} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" required className={inputClass} />
        </div>
      </div>
      <div>
        <label htmlFor="companyName" className={labelClass}>
          Dealership Name <span className="normal-case tracking-normal text-ink-dim/60">(optional)</span>
        </label>
        <input id="companyName" name="companyName" autoComplete="organization" className={inputClass} />
      </div>
      <fieldset>
        <legend className="mb-2 text-xs uppercase tracking-wide text-ink-dim">
          Which best describes you?
        </legend>
        <div className="space-y-2">
          {ROLE_OPTIONS.map((opt, i) => (
            <label key={opt.value} className="flex items-center gap-2.5 text-sm text-ink">
              <input type="radio" name="role" value={opt.value} required={i === 0} className="form-radio" />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="message" className={labelClass}>
          What would you like help with?
        </label>
        <textarea id="message" name="message" rows={4} className={inputClass} />
      </div>

      <button
        type="submit"
        disabled={status === "sending" || !startTime}
        className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-ground transition hover:bg-white disabled:opacity-60"
      >
        {status === "sending" ? "Booking…" : live ? "Confirm Booking" : "Request This Time"}
        <span aria-hidden="true">&rarr;</span>
      </button>

      {status === "requested" && startTime && (
        <p className="pt-2 text-sm text-ink-dim" role="status">
          Your email app should open with your request for{" "}
          <span className="text-ink">{slotLabel(startTime)}</span> ready to send. If it
          didn&rsquo;t, call{" "}
          <a href={site.phoneHref} className="text-accent underline">
            {site.phone}
          </a>
          .
        </p>
      )}

      {status === "error" && (
        <p className="pt-2 text-sm text-ink-dim" role="alert">
          {errorMsg} You can also {reachUs} and we&rsquo;ll get it scheduled.
        </p>
      )}
    </form>
  );
}
