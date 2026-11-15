import { Cpu, HeartHandshake, Microscope, Scan, type LucideIcon } from "lucide-react";
import { COUNTERS, formatCounter, type CounterKey } from "@/lib/site-data";

export function Counter({ name, className }: { name: CounterKey; className?: string }) {
  const [end, decimals, suffix] = COUNTERS[name];
  return (
    <div data-counter={name} className={className}>
      {formatCounter(end, decimals, suffix)}
    </div>
  );
}

const BIOMETRICS: {
  badge: string;
  counter: CounterKey;
  offset: number;
  stroke: string;
  icon: LucideIcon;
  iconColor: string;
  title: string;
  text: string;
}[] = [
  {
    badge: "OPTICAL FIT",
    counter: "fit",
    offset: 6,
    stroke: "#0d2e4c",
    icon: Cpu,
    iconColor: "text-[#0d2e4c]",
    title: "AI-Driven Bite Analysis",
    text: "Digital T-Scan sensors measure micro-second occlusal contact timing so your new restorations feel weightless from day one.",
  },
  {
    badge: "LASER TOLERANCE",
    counter: "laser",
    offset: 18,
    stroke: "#28689c",
    icon: Scan,
    iconColor: "text-[#28689c]",
    title: "Micro-Guided Enamel Preservation",
    text: "3D holographic bounding boxes guide every laser pulse, preserving up to 95% of healthy biological tooth structure.",
  },
  {
    badge: "PATIENT SERENITY",
    counter: "comfort",
    offset: 0,
    stroke: "#0d2e4c",
    icon: HeartHandshake,
    iconColor: "text-[#0d2e4c]",
    title: "Private Sanctuary Suites",
    text: "Architectural acoustics, circadian sky-lighting, and computer-regulated numbing wand technology replace clinical stress with calm.",
  },
];

const LAYERS = [
  { name: "Incisal Halo & Enamel Translucency Layer", spec: "580 MPa Refractive Glaze", width: "96%" },
  { name: "Biomimetic Dentin Core Absorption Matrix", spec: "Elasticity Modulus 18.6 GPa", width: "92%" },
  { name: "Marginal Seal & Root Furcation Bonding", spec: "12-Micron Laser Margin", width: "99%" },
];

export function About() {
  return (
    <section id="about" className="py-24 px-6 sm:px-12 max-w-[1340px] mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="about-header-reveal inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#285b85] mb-3">
          <Microscope className="w-4 h-4" aria-hidden="true" />
          Digital Smile Architecture
        </span>
        <h2 className="about-header-reveal text-3xl sm:text-5xl font-semibold text-[#0d2e4c] tracking-tight leading-tight">
          Where 3D Biometrics Meet Artisan Craft.
        </h2>
        <p className="about-header-reveal text-slate-600 mt-4 text-base sm:text-lg leading-relaxed">
          Every tooth restoration is digitally engineered using optical coherence tomography and dynamic bite-force
          mapping before it is hand-finished in pure porcelain.
        </p>
      </div>

      <div className="about-cards-grid grid grid-cols-1 md:grid-cols-3 gap-7 mb-12">
        {BIOMETRICS.map(({ icon: Icon, ...card }) => (
          <div
            key={card.counter}
            className="about-biometric-card p-8 rounded-[28px] bg-white border border-slate-100 shadow-[0_18px_45px_rgba(13,46,76,0.05)] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-sky-700 bg-sky-50 px-3 py-1 rounded-full">
                  {card.badge}
                </span>
                <Counter name={card.counter} className="text-4xl font-bold text-[#0d2e4c] mt-3" />
              </div>
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg focusable="false" aria-hidden="true" className="w-20 h-20 -rotate-90" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r="40" stroke="#e2eff8" strokeWidth="7" fill="none" />
                  <circle
                    className="biometric-ring-circle"
                    data-target-offset={card.offset}
                    cx="48"
                    cy="48"
                    r="40"
                    stroke={card.stroke}
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray="251.2"
                    strokeDashoffset={card.offset}
                    fill="none"
                  />
                </svg>
                <Icon className={`w-6 h-6 absolute ${card.iconColor}`} aria-hidden="true" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#0d2e4c] mb-2">{card.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{card.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div
        className="cad-layer-panel rounded-[32px] p-8 sm:p-10 text-white shadow-xl relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0d2e4c 0%, #1f4e77 55%, #3d75a4 100%)" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">MULTI-LAYER BIOMIMETICS</span>
            <h3 className="text-2xl sm:text-3xl font-semibold mt-2 mb-3">Structural Porcelain Telemetry</h3>
            <p className="text-sm text-white/80 leading-relaxed">
              As you scroll into view, our CAD/CAM structural stress bars calibrate across all three anatomical tooth
              zones—matching natural dentin elasticity and enamel surface hardness.
            </p>
          </div>
          <div className="lg:col-span-7 space-y-4">
            {LAYERS.map((layer) => (
              <div key={layer.name} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
                <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                  <span className="layer-name font-semibold text-white">{layer.name}</span>
                  <span className="text-sky-200 font-mono">{layer.spec}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/15 overflow-hidden">
                  <div
                    className="cad-layer-bar h-full rounded-full bg-linear-to-r from-sky-300 via-white to-sky-200"
                    style={{ width: layer.width }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
