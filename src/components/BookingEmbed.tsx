import Script from "next/script";
import { site } from "@/data/site";

// The client's own live GoHighLevel booking calendar, embedded as-is — real
// availability and real appointments land straight on their GHL calendar.
// form_embed.js is GHL's standard embed helper; it auto-sizes the iframe.
export default function BookingEmbed() {
  return (
    <>
      <iframe
        src={site.bookingWidgetUrl}
        id={`${site.bookingWidgetId}_booking`}
        title="Book a call with Go Rob Lacy"
        className="block min-h-[760px] w-full rounded-xl border-0 bg-white"
        scrolling="no"
      />
      <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="afterInteractive" />
    </>
  );
}
