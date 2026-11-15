/* Treatment copy and figures preserved from the supplied design. They are illustrative. */

export const SERVICE_KEYS = ["restorative", "cosmetic", "implants"] as const;
export type ServiceKey = (typeof SERVICE_KEYS)[number];

export interface Service {
  tag: string;
  title: string;
  description: string;
  metrics: { label: string; value: string }[];
  features: string[];
}

export const SERVICES: Record<ServiceKey, Service> = {
  restorative: {
    tag: "RESTORATIVE PRECISION",
    title: "Biomimetic Porcelain & Micro-Restorations",
    description:
      "Using 12-micron intraoral optical scanning and finite-element stress mapping, we rebuild damaged enamel to mimic the exact light transmission and flexural strength of a virgin tooth.",
    metrics: [
      { label: "Marginal Fit Accuracy", value: "12 μm" },
      { label: "Enamel Preservation", value: "94.8%" },
      { label: "Bite Force Rating", value: "850 MPa" },
    ],
    features: [
      "3D CAD/CAM single-visit porcelain inlays & crowns",
      "Zero-sensitivity laser cavity preparation",
      "Natural translucency gradient matching",
    ],
  },
  cosmetic: {
    tag: "COSMETIC ARCHITECTURE",
    title: "Digital Smile Design & Ultra-Thin Veneers",
    description:
      "Preview your custom smile in 3D before a single tooth is touched. Hand-layered feldspathic and lithium disilicate veneers crafted at 0.2mm contact-lens thickness.",
    metrics: [
      { label: "Veneer Thickness", value: "0.2 mm" },
      { label: "Facial Harmony Match", value: "99.4%" },
      { label: "Shade Stability", value: "20+ Yrs" },
    ],
    features: [
      "Dynamic 4D facial-motion smile simulation",
      "No-prep & minimal-prep enamel preservation",
      "Custom micro-texture & incisal halo detailing",
    ],
  },
  implants: {
    tag: "GUIDED IMPLANTOLOGY",
    title: "3D Computer-Guided Titanium & Zirconia Implants",
    description:
      "Sub-millimeter CBCT virtual surgery planning allows gentle, suture-free implant placement with immediate provisional restorations on the very same day.",
    metrics: [
      { label: "3D Angular Precision", value: "0.18°" },
      { label: "Osseointegration Rate", value: "99.2%" },
      { label: "Recovery Comfort", value: "24 Hrs" },
    ],
    features: [
      "Biocompatible ceramic & grade-5 titanium anchors",
      "3D-printed surgical guide for keyhole placement",
      "Custom-milled emergence profile abutments",
    ],
  },
};

export const SERVICE_TABS: Record<ServiceKey, string> = {
  restorative: "Restorative",
  cosmetic: "Cosmetic",
  implants: "Implants",
};

export const TREATMENT_NAMES: Record<ServiceKey, string> = {
  restorative: "Restorative Care",
  cosmetic: "Cosmetic Veneers",
  implants: "3D Implants",
};

export const BENTO_CARDS: { key: ServiceKey; code: string; title: string; description: string; stat: string }[] = [
  {
    key: "restorative",
    code: "01 / RESTORATIVE",
    title: "Biomimetic Crowns & Inlays",
    description: "Structural enamel reconstruction with 12μm CAD margins.",
    stat: "850 MPa Strength",
  },
  {
    key: "cosmetic",
    code: "02 / COSMETIC",
    title: "Contact-Lens Porcelain Veneers",
    description: "0.2mm ultra-thin hand-layered ceramic for natural light refraction.",
    stat: "Zero-Prep Option",
  },
  {
    key: "implants",
    code: "03 / IMPLANTS",
    title: "3D Guided Bionics & Implants",
    description: "Keyhole CBCT computer-guided titanium & ceramic root replacements.",
    stat: "99.2% Integration",
  },
];

export const TIME_WINDOWS = ["09:00 AM", "10:30 AM", "02:00 PM", "04:15 PM"] as const;
export type TimeWindow = (typeof TIME_WINDOWS)[number];
export const DEFAULT_TIME_WINDOW: TimeWindow = "10:30 AM";

/** How many upcoming weekdays the booking form offers. The server accepts the same window. */
export const BOOKING_WEEKDAYS = 10;

export type HotspotKey = "precision" | "comfort";
export const HOTSPOTS: Record<HotspotKey, { title: string; badge: string; description: string }> = {
  precision: {
    title: "Precision Digital Smile Planning",
    badge: "12-MICRON OPTICAL SCAN",
    description:
      "Every restoration begins with a 3D holographic mesh of your enamel topography, occlusal bite force vectors, and facial symmetry.",
  },
  comfort: {
    title: "Gentle, Patient-First Comfort",
    badge: "ANXIETY-FREE PROTOCOL",
    description:
      "Computer-assisted micro-anesthesia, acoustic noise cancellation, and minimally invasive laser therapy ensure a serene experience.",
  },
};

export const SECTIONS = [
  { id: "home", label: "01 / Hero Stage" },
  { id: "about", label: "02 / 3D Biometrics" },
  { id: "services", label: "03 / Clinical Services" },
  { id: "results", label: "04 / Smile Outcomes" },
  { id: "journey", label: "05 / Patient Journey" },
  { id: "contact", label: "06 / Concierge Booking" },
] as const;
export type SectionId = (typeof SECTIONS)[number]["id"];

export const NAV_LINKS: { href: `#${SectionId}`; label: string }[] = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About Us" },
  { href: "#services", label: "Services" },
  { href: "#results", label: "Results" },
  { href: "#contact", label: "Contact" },
];

/** Counter end values: [end, decimals, suffix]. */
export const COUNTERS = {
  fit: [99.8, 1, "%"],
  laser: [0.02, 2, "mm"],
  comfort: [100, 0, "%"],
  light: [99.4, 1, "%"],
  survival: [98.9, 1, "%"],
  cases: [1500, 0, "+"],
} as const satisfies Record<string, readonly [number, number, string]>;
export type CounterKey = keyof typeof COUNTERS;

export function formatCounter(value: number, decimals: number, suffix: string) {
  return (
    value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix
  );
}

/** Upcoming weekdays as YYYY-MM-DD, starting tomorrow (local time). */
export function upcomingWeekdays(count = BOOKING_WEEKDAYS, from = new Date()) {
  const date = new Date(from);
  date.setHours(12, 0, 0, 0);
  const days: { value: string; label: string }[] = [];
  const format = new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric" });
  while (days.length < count) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    const value = [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
    days.push({ value, label: format.format(date) });
  }
  return days;
}
