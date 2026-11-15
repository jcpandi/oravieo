"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Activity, ArrowUpRight, Check, ChevronRight, Scan } from "lucide-react";
import { useRef, type KeyboardEvent } from "react";
import { BENTO_CARDS, SERVICE_KEYS, SERVICE_TABS, SERVICES } from "@/lib/site-data";
import { prefersReducedMotion, useSite } from "./site-provider";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Services() {
  const { service, selectService, openDialog } = useSite();
  const data = SERVICES[service];
  const panelRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const shownService = useRef(service);

  // Soft cross-fade of the panel contents whenever the treatment changes.
  useGSAP(
    () => {
      if (shownService.current === service) return;
      shownService.current = service;
      if (!prefersReducedMotion()) {
        gsap.fromTo(
          panelRef.current!.children,
          { y: 8, opacity: 0.65 },
          { y: 0, opacity: 1, duration: 0.32, stagger: 0.04, overwrite: true, clearProps: "transform,opacity" },
        );
      }
      ScrollTrigger.refresh();
    },
    { dependencies: [service] },
  );

  const onTabKeyDown = (event: KeyboardEvent) => {
    const index = SERVICE_KEYS.indexOf(service);
    let next: number;
    if (event.key === "ArrowRight") next = (index + 1) % SERVICE_KEYS.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + SERVICE_KEYS.length) % SERVICE_KEYS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = SERVICE_KEYS.length - 1;
    else return;
    event.preventDefault();
    const key = SERVICE_KEYS[next];
    selectService(key);
    tabRefs.current[key]?.focus();
  };

  return (
    <section id="services" className="py-24 px-6 sm:px-12 max-w-[1340px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
        <div>
          <span className="services-header-reveal inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#285b85] mb-3">
            <Scan className="w-4 h-4" aria-hidden="true" />
            Clinical Disciplines
          </span>
          <h2 className="services-header-reveal text-3xl sm:text-5xl font-semibold text-[#0d2e4c] tracking-tight">
            Engineered for biological longevity.
          </h2>
        </div>
        <div
          aria-label="Treatment disciplines"
          role="tablist"
          onKeyDown={onTabKeyDown}
          className="services-header-reveal inline-flex p-1.5 rounded-full bg-white shadow-xs border border-slate-200/80 self-start service-tabs"
        >
          {SERVICE_KEYS.map((key) => (
            <button
              key={key}
              ref={(el) => {
                tabRefs.current[key] = el;
              }}
              tabIndex={service === key ? 0 : -1}
              aria-selected={service === key}
              aria-controls="service-panel"
              role="tab"
              id={`tab-${key}`}
              type="button"
              className="service-tab"
              onClick={() => selectService(key)}
            >
              {SERVICE_TABS[key]}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={panelRef}
        aria-labelledby={`tab-${service}`}
        role="tabpanel"
        id="service-panel"
        className="services-showcase-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white rounded-[32px] p-8 sm:p-12 shadow-[0_24px_60px_rgba(13,46,76,0.06)] border border-slate-100 mb-10"
      >
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="inline-block px-3.5 py-1 rounded-full bg-[#e6f1fa] text-[#1c527e] text-xs font-semibold tracking-wider mb-5">
              {data.tag}
            </div>
            <h3 className="text-2xl sm:text-4xl font-semibold text-[#0d2e4c] leading-tight mb-4">{data.title}</h3>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8">{data.description}</p>
            <div className="space-y-3.5 mb-8">
              {data.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-[#0d2e4c] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                  <span className="text-slate-800 font-medium text-sm sm:text-base">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <button
              aria-haspopup="dialog"
              type="button"
              onClick={() => openDialog({ kind: "booking" })}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0d2e4c] hover:bg-[#16446b] text-white text-sm font-medium transition-all"
            >
              Schedule 3D Scan Consultation
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <span className="text-xs text-slate-500">Includes complimentary CBCT &amp; Digital Smile Preview</span>
          </div>
        </div>
        <div
          className="lg:col-span-5 rounded-3xl p-8 text-white flex flex-col justify-between relative overflow-hidden"
          style={{ background: "linear-gradient(145deg, #0d2e4c 0%, #255780 55%, #4d85b3 100%)" }}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between text-xs uppercase tracking-widest text-sky-200/90 mb-6">
              <span>CAD / CAM Telemetry</span>
              <Activity className="w-4 h-4 text-sky-300" aria-hidden="true" />
            </div>
            <div id="service-metrics" className="grid grid-cols-1 gap-4 my-2">
              {data.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-between"
                >
                  <span className="text-sm text-white/80">{metric.label}</span>
                  <span className="text-2xl font-bold text-white tracking-tight">{metric.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10 mt-8 pt-5 border-t border-white/15 flex items-center justify-between text-xs text-sky-100/80">
            <span>Optical Scanner: Oravieo RayScan Pro</span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-200 font-medium">Calibrated</span>
          </div>
        </div>
      </div>

      <div className="service-bento-grid grid grid-cols-1 md:grid-cols-3 gap-6">
        {BENTO_CARDS.map((card) => (
          <button
            key={card.key}
            aria-pressed={service === card.key}
            type="button"
            onClick={() => selectService(card.key, { scroll: true })}
            className="service-bento-card group p-7 rounded-3xl border text-left"
          >
            <div className="flex items-center justify-between text-xs font-semibold tracking-widest uppercase mb-4">
              <span className="bento-code">{card.code}</span>
              <ArrowUpRight
                className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                aria-hidden="true"
              />
            </div>
            <h4 className="text-xl font-semibold mb-2">{card.title}</h4>
            <p className="bento-description text-sm leading-relaxed mb-6">{card.description}</p>
            <div className="bento-stat inline-block px-3.5 py-1.5 rounded-full text-xs font-medium">{card.stat}</div>
          </button>
        ))}
      </div>
    </section>
  );
}
