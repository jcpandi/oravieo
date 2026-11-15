"use client";

import { CodeXml, Copy, X } from "lucide-react";
import { useRef, useState } from "react";
import { HOTSPOTS, type HotspotKey } from "@/lib/site-data";
import { Modal } from "./modal";
import { useSite } from "./site-provider";

const CODE_SNIPPET = `// src/components/motion.tsx — GSAP in a Next.js client component
"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Motion({ replayToken }: { replayToken: number }) {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".gsap-hero-text", {
        y: 24, opacity: 0, stagger: 0.12,
        duration: 0.9, ease: "power3.out",
      });

      gsap.fromTo(".journey-laser-fill",
        { scaleY: 0, transformOrigin: "top center" },
        { scaleY: 1, ease: "none", scrollTrigger: {
            trigger: ".journey-steps-wrapper",
            start: "top 72%", end: "bottom 68%", scrub: 0.5,
        }},
      );
    });
  }, { dependencies: [replayToken], revertOnUpdate: true });
  return null;
}

// Styling is Tailwind CSS v4 (src/app/globals.css).
// The 3D molar is three.js, loaded on demand (src/lib/molar.ts).`;

export function CodeDialog() {
  const { dialog, closeDialog, announce } = useSite();
  const [copyLabel, setCopyLabel] = useState("Copy Snippet");
  const preRef = useRef<HTMLPreElement>(null);

  const copy = async () => {
    let copied = false;
    try {
      await navigator.clipboard.writeText(CODE_SNIPPET);
      copied = true;
    } catch {
      copied = false;
    }
    if (!copied && preRef.current) {
      const range = document.createRange();
      range.selectNodeContents(preRef.current);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
    }
    setCopyLabel(copied ? "Copied!" : "Select code to copy");
    announce(copied ? "Code copied to clipboard" : "Select the code and use your device’s Copy command.");
    setTimeout(() => setCopyLabel("Copy Snippet"), 2200);
  };

  return (
    <Modal id="code-dialog" open={dialog?.kind === "code"} onClose={() => closeDialog("code")} labelledBy="code-title">
      <div className="bg-[#0b1e30] text-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 border border-white/15 shadow-2xl modal-card code-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <CodeXml className="w-5 h-5 text-sky-400" aria-hidden="true" />
            <h3 id="code-title" className="text-lg font-semibold">
              Next.js + Tailwind CSS + GSAP
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium"
            >
              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
              {copyLabel}
            </button>
            <button
              aria-label="Close code example"
              type="button"
              onClick={() => closeDialog()}
              className="p-1.5 rounded-full text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
        <pre
          ref={preRef}
          tabIndex={0}
          className="p-4 rounded-2xl bg-[#071320] text-sky-100 text-xs overflow-x-auto leading-relaxed font-mono max-h-[420px]"
        >
          {CODE_SNIPPET}
        </pre>
      </div>
    </Modal>
  );
}

export function HotspotDialog() {
  const { dialog, closeDialog } = useSite();
  // Keep the last hotspot's text while the dialog closes.
  const [shown, setShown] = useState<HotspotKey>("precision");
  if (dialog?.kind === "hotspot" && dialog.hotspot !== shown) setShown(dialog.hotspot);
  const detail = HOTSPOTS[shown];

  return (
    <Modal id="hotspot-dialog" open={dialog?.kind === "hotspot"} onClose={() => closeDialog("hotspot")} labelledBy="hotspot-title">
      <div className="modal-card hotspot-card">
        <button type="button" onClick={() => closeDialog()} aria-label="Close detail" className="dialog-close">
          ×
        </button>
        <p className="text-xs tracking-widest text-sky-200 mb-3">{detail.badge}</p>
        <h2 id="hotspot-title" className="text-2xl font-semibold mb-3">
          {detail.title}
        </h2>
        <p className="text-sm text-white/80 leading-relaxed">{detail.description}</p>
      </div>
    </Modal>
  );
}
