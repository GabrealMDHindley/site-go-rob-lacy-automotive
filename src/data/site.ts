// Central content data for the Go Rob Lacy dealership site — every piece of
// copy on the site (services, steps, testimonials, contact details, stats,
// headlines) lives in this one file. Edit text here and redeploy.

// The site's public address, used for canonical links, the sitemap, robots.txt
// and social previews. Resolved automatically on Vercel (the project's
// production domain — its custom domain once one is assigned); set
// NEXT_PUBLIC_SITE_URL to override, e.g. https://www.example.com
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL &&
    `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`) ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  "http://localhost:3000"
).replace(/\/+$/, "");

export const site = {
  name: "Go Rob Lacy",
  legalName: "Go Rob Lacy Inc.",
  tagline: "People | Systems | Greater Results",
  headline: "Showroom traffic, test drives & closings on autopilot.",
  subhead:
    "With every vehicle marketed like it's the flagship model — growth systems built for car dealerships and car salesmen.",
  mission:
    "Turning more online shoppers into showroom visits, test drives, and sales — for car dealerships and car salesmen.",
  email: "info@goroblacy.com",
  phone: "(928) 628-6279",
  phoneHref: "tel:+19286286279",
  phoneE164: "+1-928-628-6279",
  address: {
    street: "5702 Elbo Bluff Dr",
    city: "Manhattan",
    region: "KS",
    postalCode: "66502",
    country: "US",
  },
  url: SITE_URL,
} as const;

export const addressLine = `${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`;

export type Stat = {
  target: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

// Each figure is stated in the service copy below.
export const stats: Stat[] = [
  { target: 30, suffix: "s", label: "AI Agent Calls Every New Buyer" },
  { target: 80, prefix: ">", suffix: "%", label: "Lead Quality Lost After 5 Minutes" },
  { target: 24, suffix: "/7", label: "AI Chat & Voice Coverage" },
  { target: 7, label: "Systems Built For Your Dealership" },
];

// The "speed to lead" statement — verbatim from step 6 of the ad system.
export const speedToLead = {
  eyebrow: "Speed To Lead",
  headline: "Every new buyer gets a call within 30 seconds.",
  sub: "Lead quality drops by more than 80% if they aren't contacted within 5 minutes — so your AI Agent calls every buyer within 30 seconds of the form being submitted, so nothing slips through the cracks.",
} as const;

export type ServiceBlock = { title: string; body: string };
export type ServiceStep = { title: string; body: string };

export type Service = {
  id: string;
  /** Full service name. */
  name: string;
  /** Short tab label. */
  short: string;
  /** Category label shown with the service. */
  category: string;
  /** Lead line shown in the service's highlight card. */
  lead: string;
  /** Verbatim description paragraphs. */
  intro: string[];
  blocks?: ServiceBlock[];
  steps?: ServiceStep[];
  result?: string;
  /** Condensed bullets for the step-by-step overview (How It Works). */
  highlights: string[];
};

// Order is the client's — do not reorder.
export const services: Service[] = [
  {
    id: "website-crm",
    name: "Website + CRM + SMS Automations + Email Automations",
    short: "Website + CRM + Automations",
    category: "Web & Automation Systems",
    lead: "Turn More Website Visitors Into Showroom Visits, Test Drives & Sales.",
    intro: ["Running a successful dealership means managing inventory, sales staff, financing, trade-ins, and a constant flow of buyer inquiries all at once. Potential buyers browse your inventory online, compare vehicles, check pricing, and consider financing — but many aren't ready to visit the lot today. When your sales team is busy with customers on the floor, those online inquiries can slip through the cracks. That doesn't mean they're a bad lead — it means they need to be followed up with. That's why we built this system for dealerships."],
    blocks: [
      { title: "A Website That Sells The Inventory", body: "Many dealerships rely on a generic inventory feed with little personality or brand behind it. Yours should sell the experience of buying from you — current inventory, financing options, trade-in information, your team, reviews, and your story — with a clear path to schedule a test drive or request pricing directly." },
      { title: "A CRM That Organizes Every Potential Buyer", body: "Your CRM tracks potential buyers by interest — New Inventory, Used Inventory, Financing, Trade-Ins, Specific Vehicles — instead of scattered messages, spreadsheets, or memory." },
      { title: "Automated SMS Follow-Up", body: "When someone submits an inquiry, your CRM automatically triggers relevant SMS follow-up based on the vehicle or financing question they're interested in, continuing until they're ready to visit — so fewer buyer inquiries get forgotten." },
      { title: "Automated Email Follow-Up", body: "Potential buyers also receive automated emails tailored to their interests, staying connected until the timing is right — so when they're finally ready to buy, your dealership is the first one they think of." },
    ],
    result: "The result: a modern website that showcases your inventory, a centralized CRM for every potential buyer, and automated follow-up that keeps prospects engaged — so fewer inquiries get forgotten and more interested buyers stay engaged until they're ready to visit.",
    highlights: [
      "A website that sells the inventory",
      "A CRM that organizes every potential buyer",
      "Automated SMS follow-up",
      "Automated email follow-up",
    ],
  },
  {
    id: "vehicle-walkthroughs",
    name: "Video Walkthroughs Of Vehicles",
    short: "Vehicle Walkthroughs",
    category: "Media & 3D Video",
    lead: "Serious buyers arrive already sold on the vehicle.",
    intro: ["We produce a custom 3D video walkthrough for each individual vehicle in your inventory — giving online shoppers a real, detailed look at the exact car, truck, or SUV they're considering before they ever step onto the lot, so serious buyers arrive already sold on the vehicle."],
    highlights: [
      "A custom 3D video walkthrough for each vehicle in your inventory",
      "A real, detailed look at the exact car, truck, or SUV",
      "Serious buyers arrive already sold on the vehicle",
    ],
  },
  {
    id: "paid-commercials",
    name: "Paid Commercials & Lead Generation To Acquire New Buyers",
    short: "Paid Commercials & Lead Gen",
    category: "Growth & Lead Generation",
    lead: "Never left wondering where your next sale is coming from.",
    intro: ["Between endless networking, hoping for a referral, and wondering where your next sale is coming from, relying on foot traffic alone leaves your sales pipeline unpredictable. We built a paid lead generation system designed to consistently generate qualified buyers and sellers, so you're never left wondering where your next sale is coming from. Here's exactly how the process works, step by step:"],
    steps: [
      { title: "We Build Your Ads", body: "We write and produce custom commercials and ads built specifically around your business." },
      { title: "We Launch To Your Market", body: "Your ads are placed directly in front of your local market, reaching the exact buyers you want to reach." },
      { title: "A Buyer Sees & Submits", body: "When a buyer sees your ad, they can fill out and submit a lead form right then and there." },
      { title: "Instant Routing", body: "The buyer is forwarded to your website to learn more about your business, while their information is sent immediately to your CRM." },
      { title: "Automatic Categorization", body: "Based on their answers, your CRM automatically categorizes the buyer and begins sending custom text messages and emails to follow up." },
      { title: "Called Within 30 Seconds", body: "Lead quality drops by more than 80% if they aren't contacted within 5 minutes — so your AI Agent calls every buyer within 30 seconds of the form being submitted, so nothing slips through the cracks." },
      { title: "Live Transfer", body: "If the buyer wants to speak with you directly, your AI Agent performs a live transfer, bringing you straight into the call." },
      { title: "The Conversation", body: "On the scheduled meeting or live transfer, you speak with the buyer directly about becoming a customer." },
      { title: "Close The Buyer", body: "You close the deal and turn the buyer into a paying, long-term customer." },
      { title: "Repeat", body: "The system runs continuously, generating and delivering new exclusive buyers on autopilot." },
    ],
    highlights: [
      "Custom commercials and ads built around your business",
      "Placed in front of the buyers in your local market",
      "Every buyer called by your AI Agent within 30 seconds",
      "Live transfer straight to you when a buyer wants to talk",
    ],
  },
  {
    id: "ai-chat",
    name: "AI Chat Agents",
    short: "AI Chat Agents",
    category: "AI Systems",
    lead: "Answers about specific vehicles, pricing, and financing — instantly.",
    intro: ["Shoppers browsing your inventory at night shouldn't have to wait until you open to get answers. Our AI Chat Agent answers questions about specific vehicles, pricing, and financing instantly, and books test drives directly onto your calendar."],
    highlights: [
      "Answers questions about specific vehicles instantly",
      "Handles pricing and financing questions",
      "Books test drives directly onto your calendar",
      "Keeps working while shoppers browse at night",
    ],
  },
  {
    id: "ai-voice",
    name: "AI Voice Agents",
    short: "AI Voice Agents",
    category: "AI Systems",
    lead: "A missed call is a missed sale.",
    intro: ["A missed call is a missed sale — and often a customer who calls the dealership down the street instead. Our AI Voice Agent answers every call in a natural conversation, discusses inventory, pricing, and financing, books test drives, and follows up with anyone who called while your sales team was on the floor."],
    highlights: [
      "Answers every call in a natural conversation",
      "Discusses inventory, pricing, and financing",
      "Books test drives",
      "Follows up with anyone who called while your team was on the floor",
    ],
  },
  {
    id: "content",
    name: "Content Creation & Growth",
    short: "Content Creation & Growth",
    category: "Media & 3D Video",
    lead: "300 to 1,500 pieces of content handled for you every single month.",
    intro: ["We plan the content strategy, script the videos, create the images, handle the editing, write the captions, schedule every post, and manage all engagement — a fully done-for-you content operation built around your brand. Choose 60, 100, 150, or 300 posts per month, published consistently across Instagram, Facebook, LinkedIn, TikTok, and YouTube. That's 300 to 1,500 pieces of content handled for you every single month, keeping your brand visible and top-of-mind without you ever having to pick up a camera, write a caption, or think about what to post next."],
    highlights: [
      "Content strategy planned and videos scripted",
      "Images, editing, and captions handled",
      "Every post scheduled and all engagement managed",
      "60, 100, 150, or 300 posts per month",
    ],
  },
  {
    id: "viral",
    name: "Viral Content Automation",
    short: "Viral Content Automation",
    category: "Media & 3D Video",
    lead: "Every campaign targets 100,000 to 1.5M+ views — or you don't pay.",
    intro: ["Organic posting alone rarely breaks through — reaching a genuinely large audience takes content specifically engineered to travel. We research what's currently working in your space, produce content built around proven viral mechanics and formats, and distribute it strategically to maximize reach. Every campaign targets 100,000 to 1.5M+ views — or you don't pay — giving your brand exposure to audiences far beyond what standard content marketing could ever achieve on its own."],
    highlights: [
      "Research into what's currently working in your space",
      "Content built around proven viral mechanics and formats",
      "Strategic distribution to maximize reach",
      "Every campaign targets 100,000 to 1.5M+ views — or you don't pay",
    ],
  },
];

// What gets installed, as short tags — the marquee strip and the intro
// screen. Exactly the client's seven services, in the client's order.
export const serviceTags = services.map((s) => s.name);

// Your CRM's buyer-interest pipeline — verbatim categories from the
// Website + CRM service copy.
export const buyerInterests = [
  "New Inventory",
  "Used Inventory",
  "Financing",
  "Trade-Ins",
  "Specific Vehicles",
];

export type Testimonial = {
  quote: string;
  /** First name + last initial, exactly as published. */
  name: string;
  service: string;
};

export const testimonials: Testimonial[] = [
  {
    quote: "I especially like having one place to see our inventory, what has already been communicated, and what needs to happen next. The website and automated follow-up work together instead of feeling like separate tools. We have been genuinely pleased with the outcome.",
    name: "Joanne S.",
    service: "Website + CRM + SMS Automations + Email Automations",
  },
  {
    quote: "I did not realize how much time we were losing on manual follow-up until we changed the system. Now the website, CRM, text messages, and emails keep sales follow-up moving while we focus on the business. It has been well worth the investment.",
    name: "Alex D.",
    service: "Website + CRM + SMS Automations + Email Automations",
  },
  {
    quote: "Before this, we were handling vehicle inquiries across too many different places. The new website, CRM, SMS, and email automations brought everything into one system and made follow-up much easier to stay on top of. It has made a noticeable difference for us.",
    name: "Ellen U.",
    service: "Website + CRM + SMS Automations + Email Automations",
  },
  {
    quote: "I especially like having one place to see our test drives, what has already been communicated, and what needs to happen next. The website and automated follow-up work together instead of feeling like separate tools. We have been genuinely pleased with the outcome.",
    name: "Lacey G.",
    service: "Website + CRM + SMS Automations + Email Automations",
  },
  {
    quote: "I did not realize how much time we were losing on manual follow-up until we changed the system. Now the website, CRM, text messages, and emails keep buyers moving while we focus on the business. It has been well worth the investment.",
    name: "Collin N.",
    service: "Website + CRM + SMS Automations + Email Automations",
  },
  {
    quote: "Before this, we were handling inventory across too many different places. The new website, CRM, SMS, and email automations brought everything into one system and made follow-up much easier to stay on top of. It has made a noticeable difference for us.",
    name: "Seth L.",
    service: "Website + CRM + SMS Automations + Email Automations",
  },
  {
    quote: "I especially like having one place to see our sales follow-up, what has already been communicated, and what needs to happen next. The website and automated follow-up work together instead of feeling like separate tools. We have been genuinely pleased with the outcome.",
    name: "Jacqueline Y.",
    service: "Website + CRM + SMS Automations + Email Automations",
  },
  {
    quote: "I did not realize how much time we were losing on manual follow-up until we changed the system. Now the website, CRM, text messages, and emails keep vehicle inquiries moving while we focus on the business. It has been well worth the investment.",
    name: "Marisa B.",
    service: "Website + CRM + SMS Automations + Email Automations",
  },
  {
    quote: "The aerial footage gave us a perspective of the dealership and vehicle lot that normal photos simply cannot provide. It makes the location easier to understand and gave us a much stronger piece of marketing content. It has made a noticeable difference for us.",
    name: "Glenn E.",
    service: "Aerial Flyover Video",
  },
  {
    quote: "The aerial footage gave us a perspective of the dealership and vehicle lot that normal photos simply cannot provide. It makes the location easier to understand and gave us a much stronger piece of marketing content. We have been genuinely pleased with the outcome.",
    name: "Eileen W.",
    service: "Aerial Flyover Video",
  },
  {
    quote: "The aerial footage gave us a perspective of the dealership and vehicle lot that normal photos simply cannot provide. It makes the location easier to understand and gave us a much stronger piece of marketing content. It has been well worth the investment.",
    name: "Diana M.",
    service: "Aerial Flyover Video",
  },
  {
    quote: "The walkthrough does a much better job of showing the dealership than a gallery of photos ever could. People get a feel for the space before they arrive, which has been really useful. It has made a noticeable difference for us.",
    name: "Gerald F.",
    service: "Dealership Video Walkthrough",
  },
  {
    quote: "The finished walkthrough has been one of the most useful pieces of content we received. It shows the dealership clearly without making it feel like a generic promotional video. We have been genuinely pleased with the outcome.",
    name: "Paula K.",
    service: "Dealership Video Walkthrough",
  },
  {
    quote: "I liked how the walkthrough was filmed from the customer's perspective. It makes the dealership easy to understand and gives our online presentation a much more polished feel. It has been well worth the investment.",
    name: "Tammie T.",
    service: "Dealership Video Walkthrough",
  },
  {
    quote: "We had plenty of pictures before, but the video gives people a completely different sense of the dealership. It feels natural and gives prospective customers a better idea of what to expect. It has made a noticeable difference for us.",
    name: "Shane J.",
    service: "Dealership Video Walkthrough",
  },
  {
    quote: "We were looking for a better way to generate inventory, and the campaign gave us a much more organized process for turning attention into real conversations. We have been genuinely pleased with the outcome.",
    name: "Leon R.",
    service: "Paid Commercials & Lead Generation To Acquire New Buyers",
  },
  {
    quote: "I like that the chat agent can handle the repetitive questions while our team focuses on more important conversations. It has made responding to inventory much easier. It has been well worth the investment.",
    name: "Crystal V.",
    service: "AI Chat Agents",
  },
  {
    quote: "The AI voice agent has made a noticeable difference when calls come in at inconvenient times. It can answer common questions, collect information, and help us stay connected with vehicle inquiries. It has made a noticeable difference for us.",
    name: "Geoffrey Q.",
    service: "AI Voice Agents",
  },
  {
    quote: "We had plenty of pictures before, but the video gives people a completely different sense of the dealership. It feels natural and gives prospective customers a better idea of what to expect. We have been genuinely pleased with the outcome.",
    name: "Rhys A.",
    service: "Custom Video Walkthrough Of Each Vehicle",
  },
  {
    quote: "Our content finally feels consistent with the quality of what we actually offer. The strategy around buyers gave us a much better system for staying visible without constantly starting from scratch. It has been well worth the investment.",
    name: "Kathryn O.",
    service: "Content Creation & Growth",
  },
];

// The video sales letter slot — set a real Vimeo ID once the client supplies
// one and the section renders on the next deploy. No ID → no section.
export const vsl: { vimeoId: string | null; title: string } = {
  vimeoId: null,
  title: "Watch how the system works",
};

// Shown only on the gated /confirmation page (after a real booking). Set a
// Vimeo ID if the client supplies a "watch this before we talk" video.
export const confirmationVideo: { vimeoId: string | null; title: string } = {
  vimeoId: null,
  title: "You're confirmed — watch this before we talk",
};

export const nav = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "What We Install", href: "/#installs" },
  { label: "Results", href: "/#results" },
  { label: "About", href: "/about" },
];

// Who this site is for (client instruction: car dealerships and car
// salesmen only). Descriptions condensed from the service copy.
export type Audience = { title: string; description: string };

export const industries: Audience[] = [
  {
    title: "Car Dealerships",
    description:
      "Managing inventory, sales staff, financing, trade-ins, and a constant flow of buyer inquiries all at once — and ready for a system that follows up with every one of them.",
  },
  {
    title: "Car Salesmen",
    description:
      "On the floor with customers while online inquiries and calls keep coming in — and ready for AI agents and automated follow-up that keep every buyer engaged until they're ready to visit.",
  },
];
