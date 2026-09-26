import { NextResponse } from "next/server";
import { getAvailability, ghlConfigured, GhlApiError, GhlConfigError } from "@/lib/ghl";
import { previewAvailability } from "@/lib/booking";

// Always per-request: live GHL slots change constantly, and the pre-connection
// preview slots are relative to today.
export const dynamic = "force-dynamic";

export async function GET() {
  // Not connected to GoHighLevel yet → business-hours preview slots, so the
  // calendar works as a request form (the form knows via `live: false`).
  if (!ghlConfigured()) {
    return NextResponse.json({ ok: true, ...previewAvailability() });
  }

  try {
    const availability = await getAvailability();
    return NextResponse.json({ ok: true, ...availability });
  } catch (err) {
    console.error("GET /api/book/availability failed:", err);
    if (err instanceof GhlConfigError) {
      return NextResponse.json({ ok: false, reason: "not_configured" }, { status: 503 });
    }
    const status = err instanceof GhlApiError ? 502 : 500;
    return NextResponse.json({ ok: false, reason: "ghl_error" }, { status });
  }
}
