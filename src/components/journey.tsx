import { Award } from "lucide-react";

const STEPS = [
  {
    badge: "SUB-MICRON DIAGNOSTICS",
    title: "3D CBCT & Optical Intraoral Mapping",
    text: "Forget messy traditional impressions. Our contactless RayScan wand captures 4,800 frames per second to generate a lifelike 3D digital twin of your teeth, roots, and jaw acoustics.",
    benchmark: "45 Seconds Scan Time",
  },
  {
    badge: "FACIAL HARMONY ARCHITECTURE",
    title: "Interactive Digital Smile Trial",
    text: "Co-design your smile alongside our master prosthodontists. Preview exact tooth proportions, incisal translucency, and lip dynamics in real time before any clinical work begins.",
    benchmark: "100% Predictable Preview",
  },
  {
    badge: "ANXIETY-FREE SANCTUARY",
    title: "Laser-Guided Micro-Preparation",
    text: "Guided by 3D holographic boundaries, we preserve up to 95% of healthy natural enamel using gentle water-laser optics and computer-regulated micro-comfort anesthesia.",
    benchmark: "Zero Vibration Protocol",
  },
  {
    badge: "ARTISAN CERAMICS",
    title: "Biomimetic Porcelain Integration",
    text: "Hand-finished lithium disilicate and feldspathic restorations are bonded at the molecular level, replicating natural light refraction and lifetime structural strength.",
    benchmark: "15-Year Craft Guarantee",
  },
];

export function Journey() {
  return (
    <section id="journey" className="py-24 px-6 sm:px-12 max-w-[1340px] mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="journey-header-reveal inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#285b85] mb-3">
          <Award className="w-4 h-4" aria-hidden="true" />
          The Patient-First Protocol
        </span>
        <h2 className="journey-header-reveal text-3xl sm:text-5xl font-semibold text-[#0d2e4c] tracking-tight">
          Four calm steps to a confident smile.
        </h2>
        <p className="journey-header-reveal text-slate-600 mt-3 text-base">
          Scroll down to trace our guided clinical laser pathway from 3D digital mapping to final porcelain placement.
        </p>
      </div>
      <div className="journey-steps-wrapper relative max-w-4xl mx-auto">
        <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-[3px] -translate-x-1/2 bg-slate-200 rounded-full overflow-hidden">
          <div className="journey-laser-fill w-full h-full bg-linear-to-b from-[#0d2e4c] via-[#2b7ac4] to-[#5ce1ff] shadow-[0_0_16px_#38bdf8]" />
        </div>
        <div className="space-y-12">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className={`relative flex flex-col items-start gap-8 ${index % 2 ? "md:flex-row-reverse" : "md:flex-row"}`}
            >
              <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-6 w-11 h-11 rounded-full bg-[#0d2e4c] text-white border-4 border-[#e8f1f8] shadow-lg flex items-center justify-center text-xs font-bold z-10">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="w-full md:w-1/2 pl-16 md:pl-0 md:px-10">
                <div className="journey-step-card p-7 rounded-3xl bg-white border border-slate-100 shadow-[0_18px_45px_rgba(13,46,76,0.06)] hover:border-sky-200 transition-colors">
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.16em] px-3 py-1 rounded-full bg-[#e6f1fa] text-[#1c527e] mb-3">
                    {step.badge}
                  </span>
                  <h3 className="text-xl font-semibold text-[#0d2e4c] mb-2">{step.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{step.text}</p>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0d2e4c]">
                    <span>Clinical Benchmark</span>
                    <span className="text-[#285b85]">{step.benchmark}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
