"use client";

import { SlidersVertical } from "lucide-react";
import { useRef, useState, type PointerEvent } from "react";
import { Counter } from "./about";

/** Six front teeth: x, width, height, corner radius. */
const TEETH = [
  [45, 58, 115, 22],
  [110, 68, 132, 24],
  [185, 72, 146, 24],
  [263, 72, 146, 24],
  [342, 68, 132, 24],
  [417, 58, 115, 22],
] as const;
const TOP = 22;

function PorcelainTeeth() {
  return (
    <svg focusable="false" aria-hidden="true" viewBox="0 0 520 190" className="w-full max-w-[460px] drop-shadow-xl">
      <defs>
        <linearGradient id="enamelGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#f3f9ff" />
          <stop offset="100%" stopColor="#d9ecfa" />
        </linearGradient>
      </defs>
      {TEETH.map(([x, w, h, rx]) => (
        <g key={x}>
          <rect x={x} y={TOP} width={w} height={h} rx={rx} fill="url(#enamelGrad)" stroke="#bfdcf2" strokeWidth="2" />
          <rect x={x + 12} y={TOP + 12} width="8" height={h * 0.55} rx="4" fill="#ffffff" opacity="0.85" />
        </g>
      ))}
    </svg>
  );
}

function BlueprintTeeth() {
  return (
    <svg focusable="false" aria-hidden="true" viewBox="0 0 520 190" className="w-full max-w-[460px]">
      <line x1="20" y1="95" x2="500" y2="95" stroke="#5ce1ff" strokeDasharray="4 4" strokeWidth="1" />
      <line x1="260" y1="10" x2="260" y2="180" stroke="#5ce1ff" strokeDasharray="4 4" strokeWidth="1.5" />
      {TEETH.map(([x, w, h, rx]) => (
        <g key={x}>
          <rect x={x} y={TOP} width={w} height={h} rx={rx} fill="rgba(86, 204, 242, 0.12)" stroke="#7ce0ff" strokeWidth="1.75" />
          <line x1={x + w / 2} y1={TOP} x2={x + w / 2} y2={TOP + h} stroke="#7ce0ff" strokeOpacity="0.4" />
          <line x1={x} y1={TOP + h * 0.4} x2={x + w} y2={TOP + h * 0.4} stroke="#7ce0ff" strokeOpacity="0.4" />
          <line x1={x} y1={TOP + h * 0.7} x2={x + w} y2={TOP + h * 0.7} stroke="#7ce0ff" strokeOpacity="0.4" />
        </g>
      ))}
    </svg>
  );
}

const METRICS = [
  {
    counter: "light",
    label: "OPTICAL REFRACTION MATCH",
    text: "Identical light transmission to natural virgin enamel under UV and daylight.",
  },
  {
    counter: "survival",
    label: "10-YEAR CLINICAL INTEGRITY",
    text: "Documented survival rate across bonded biomimetic ceramic restorations.",
  },
] as const;

export function Results() {
  const [value, setValue] = useState(54);
  const rangeRef = useRef<HTMLInputElement>(null);
  const dragPointer = useRef<number | null>(null);

  // The whole image is a drag target; keyboard interaction stays native to the range input.
  const moveTo = (event: PointerEvent<HTMLInputElement>) => {
    const rect = rangeRef.current!.getBoundingClientRect();
    setValue(Math.round(Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100))));
  };

  return (
    <section id="results" className="py-24 px-6 sm:px-12 bg-linear-to-b from-[#d9eaf7] to-[#e8f1f8]">
      <div className="max-w-[1340px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="results-header-reveal inline-block text-xs font-semibold uppercase tracking-[0.18em] text-[#285b85]">
            PRECISION OUTCOMES
          </span>
          <h2 className="results-header-reveal text-3xl sm:text-5xl font-semibold text-[#0d2e4c] tracking-tight mt-2">
            Results that feel completely natural.
          </h2>
          <p className="results-header-reveal text-slate-600 mt-3 text-base">
            Slide to compare our 3D digital structural blueprint with the finished hand-glazed biomimetic porcelain
            restoration.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="results-slider-stage lg:col-span-8 rounded-[32px] overflow-hidden shadow-2xl border-4 border-white bg-[#1e496d] relative h-[380px] sm:h-[440px] select-none">
            <div
              className="comparison-layer absolute inset-0 flex flex-col items-center justify-center p-8"
              style={{ background: "radial-gradient(circle at 50% 50%, #cde6fb 0%, #5b8fb9 70%, #2b5980 100%)" }}
            >
              <div className="text-xs font-semibold uppercase tracking-widest text-[#0d2e4c] bg-white/80 px-4 py-1.5 rounded-full mb-6">
                Final Hand-Layered Porcelain Restoration
              </div>
              <PorcelainTeeth />
              <p className="mt-6 text-sm font-medium text-[#0d2e4c]">100% Biomimetic Translucency • Shade BL2 Natural</p>
            </div>
            <div
              className="comparison-layer absolute inset-0 flex flex-col items-center justify-center p-8"
              style={{
                clipPath: `inset(0 ${100 - value}% 0 0)`,
                background: "radial-gradient(circle at 50% 50%, #1c4c74 0%, #0d2e4c 85%)",
              }}
            >
              <div className="text-xs font-semibold uppercase tracking-widest text-sky-200 bg-sky-400/20 border border-sky-300/30 px-4 py-1.5 rounded-full mb-6">
                3D CAD Topographical Mesh Blueprint
              </div>
              <BlueprintTeeth />
              <p className="mt-6 text-sm font-medium text-sky-200">Golden Ratio 1.618:1 Arch Calibration • 12μm Margin</p>
            </div>
            <input
              ref={rangeRef}
              id="comparison-range"
              type="range"
              min={0}
              max={100}
              value={value}
              onChange={(event) => setValue(Number(event.target.value))}
              onPointerDown={(event) => {
                if (event.button !== 0) return;
                dragPointer.current = event.pointerId;
                event.currentTarget.setPointerCapture(event.pointerId);
                moveTo(event);
              }}
              onPointerMove={(event) => {
                if (dragPointer.current === event.pointerId) moveTo(event);
              }}
              onPointerUp={() => (dragPointer.current = null)}
              onPointerCancel={() => (dragPointer.current = null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
              aria-label="Reveal digital blueprint versus finished porcelain"
              aria-valuetext={`${value} percent digital blueprint, ${100 - value} percent finished porcelain`}
            />
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_15px_#fff] z-20 pointer-events-none"
              style={{ left: `${value}%` }}
            >
              <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white text-[#0d2e4c] shadow-xl flex items-center justify-center">
                <SlidersVertical className="w-5 h-5" aria-hidden="true" />
              </div>
            </div>
            <div className="comparison-labels" aria-hidden="true">
              <span>Digital blueprint</span>
              <span>Finished porcelain</span>
            </div>
          </div>
          <div className="results-metrics-col lg:col-span-4 space-y-4">
            {METRICS.map((metric) => (
              <div key={metric.counter} className="results-metric-card p-6 rounded-3xl bg-white border border-slate-100 shadow-md">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#285b85]">{metric.label}</span>
                <Counter name={metric.counter} className="text-3xl sm:text-4xl font-bold text-[#0d2e4c] mt-1" />
                <p className="text-xs text-slate-600 mt-1">{metric.text}</p>
              </div>
            ))}
            <div className="results-metric-card p-6 rounded-3xl bg-[#0d2e4c] text-white shadow-lg">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-sky-300">PRECISION ARCHIVE</span>
              <Counter name="cases" className="text-3xl sm:text-4xl font-bold text-white mt-1" />
              <p className="text-xs text-white/80 mt-1">
                Patients cared for with personalized 3D smile design &amp; comfort protocols.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
