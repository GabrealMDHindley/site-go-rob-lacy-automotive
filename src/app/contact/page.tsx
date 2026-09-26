import { permanentRedirect } from "next/navigation";

// Booking a call is the way to reach Go Rob Lacy from the site — any inbound
// /contact link lands on the calendar (phone, email, and address sit right
// beneath it).
export default function ContactPage() {
  permanentRedirect("/book");
}
