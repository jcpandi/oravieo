"use client";

import { RotateCcw } from "lucide-react";
import { useEffect, useRef } from "react";
import { SECTIONS } from "@/lib/site-data";
import { ReplayButton } from "./action-buttons";
import { useSite } from "./site-provider";

/** Top progress bar, the bottom-left section indicator, and the molar's scroll progress. */
export function ScrollTelemetry() {
  const { activeSection, setActiveSection, molar } = useSite();
  const barRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.round(max > 0 ? (window.scrollY / max) * 100 : 0);
      if (barRef.current) barRef.current.style.width = `${progress}%`;
      if (labelRef.current) labelRef.current.textContent = `${progress}%`;

      const sections = SECTIONS.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el);
      const active =
        [...sections].reverse().find((section) => section.getBoundingClientRect().top <= window.innerHeight * 0.45) ??
        sections[0];
      if (active) setActiveSection(active.id as (typeof SECTIONS)[number]["id"]);

      const home = document.getElementById("home");
      if (home) molar.current?.setProgress(Math.min(1, Math.max(0, window.scrollY / home.offsetHeight)));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [setActiveSection, molar]);

  const label = SECTIONS.find((s) => s.id === activeSection)?.label ?? SECTIONS[0].label;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-[3px] z-50 bg-white/15 pointer-events-none">
        <div
          ref={barRef}
          id="page-progress"
          className="h-full bg-linear-to-r from-[#80dcff] via-white to-[#38bdf8] shadow-[0_0_12px_#7ce0ff] transition-all duration-75"
          style={{ width: "0%" }}
        />
      </div>
      <div className="fixed bottom-5 left-5 z-40 hidden xl:flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#0d2e4c]/85 backdrop-blur-md text-white border border-white/15 shadow-xl text-xs scroll-telemetry">
        <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
        <span className="font-medium text-sky-200">{label}</span>
        <span className="text-white/40">|</span>
        <span ref={labelRef} className="font-mono text-[11px] text-white/80">
          0%
        </span>
        <ReplayButton
          aria-label="Replay scroll animations"
          title="Replay ScrollTrigger Animations"
          className="ml-1 p-1 rounded-full hover:bg-white/15 text-sky-200 hover:text-white transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
        </ReplayButton>
      </div>
    </>
  );
}
