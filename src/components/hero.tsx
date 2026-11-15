"use client";

import { ArrowDown, Check, Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { MolarMode } from "@/lib/molar";
import { NAV_LINKS, SERVICE_KEYS, type HotspotKey } from "@/lib/site-data";
import { MolarViewer } from "./molar-viewer";
import { useSite } from "./site-provider";

const SCAN_MODES: { mode: MolarMode; label: string }[] = [
  { mode: "hybrid", label: "3D Hybrid Scan" },
  { mode: "wireframe", label: "CAD Mesh" },
  { mode: "enamel", label: "Pure Porcelain" },
];

function Logo() {
  return (
    <a href="#home" className="flex items-center gap-3 group focus:outline-hidden">
      <div className="relative w-8 h-8 flex items-center justify-center">
        <svg
          focusable="false"
          aria-hidden="true"
          viewBox="0 0 36 36"
          className="w-8 h-8 text-white transition-transform duration-500 group-hover:rotate-12"
          fill="none"
        >
          <path
            d="M18 3.5C25.8 3.5 31.5 9.6 31.5 17.5C31.5 25.4 25.2 32.5 18 32.5C10.8 32.5 4.5 25.4 4.5 17.5C4.5 9.6 10.2 3.5 18 3.5Z"
            stroke="currentColor"
            strokeWidth="2.1"
          />
          <path
            d="M18.5 7.5C23.8 7.5 27.8 11.8 27.8 17.3C27.8 22.8 23.4 27.8 18.5 27.8C14.1 27.8 11.2 23.9 11.2 17.8C11.2 12.1 13.8 7.5 18.5 7.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeOpacity="0.85"
          />
        </svg>
      </div>
      <span className="text-white text-[22px] font-semibold tracking-[-0.02em]">Oravieo</span>
    </a>
  );
}

function Header() {
  const { activeSection, openDialog, menuOpen, setMenuOpen } = useSite();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onClick = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    const onDesktop = (event: MediaQueryListEvent) => event.matches && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    desktop.addEventListener("change", onDesktop);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [menuOpen, setMenuOpen]);

  const links = (closeOnClick: boolean) =>
    NAV_LINKS.map((link) => (
      <a
        key={link.href}
        href={link.href}
        aria-current={link.href === `#${activeSection}` ? "location" : undefined}
        onClick={closeOnClick ? () => setMenuOpen(false) : undefined}
        className="hover:text-white transition-colors py-1"
      >
        {link.label}
      </a>
    ));

  return (
    <header
      ref={headerRef}
      className="gsap-nav relative z-30 w-full border-b border-white/25 bg-[#3c6e97]/20 backdrop-blur-md"
    >
      <div className="max-w-[1380px] mx-auto px-6 sm:px-12 h-[86px] flex items-center justify-between">
        <Logo />
        <nav
          aria-label="Main navigation"
          className="hidden md:flex items-center gap-9 lg:gap-11 text-[14.5px] font-normal text-white/90 desktop-navigation"
        >
          {links(false)}
        </nav>
        <div className="flex items-center gap-3">
          <button
            aria-haspopup="dialog"
            type="button"
            onClick={() => openDialog({ kind: "booking" })}
            className="header-book px-7 py-3 rounded-full bg-[#163d5c] hover:bg-[#0d2e4c] text-white text-[14px] font-medium tracking-wide border border-white/15 shadow-lg shadow-[#0d2e4c]/25 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
          >
            Book Visit
          </button>
          <button
            ref={toggleRef}
            className="menu-toggle"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu size={22} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>
      </div>
      <nav hidden={!menuOpen} id="mobile-navigation" aria-label="Mobile navigation" className="mobile-navigation">
        {links(true)}
      </nav>
    </header>
  );
}

function FloatingCard({ hotspot, title, subtitle, dark }: { hotspot: HotspotKey; title: string; subtitle: string; dark?: boolean }) {
  const { openDialog } = useSite();
  return (
    <button
      aria-haspopup="dialog"
      type="button"
      onClick={() => openDialog({ kind: "hotspot", hotspot })}
      className={`gsap-floating-card flex items-center gap-4 cursor-pointer group px-5 py-4 rounded-[20px] backdrop-blur-md border transition-all duration-300 ${
        dark
          ? "w-[258px] md:w-[284px] bg-[#2b587e]/65 hover:bg-[#234c6e]/80 border-white/25 shadow-[0_20px_50px_rgba(13,46,76,0.24)]"
          : "w-[248px] md:w-[272px] bg-white/75 hover:bg-white/90 border-white/60 shadow-[0_20px_50px_rgba(24,68,108,0.18)]"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform ${
          dark ? "bg-white/90" : "bg-[#0d2e4c]"
        }`}
      >
        <Check className={`w-4 h-4 ${dark ? "text-[#0d2e4c]" : "text-white"}`} strokeWidth={2.5} aria-hidden="true" />
      </div>
      <div className="text-left">
        <div className={`card-title text-[17px] font-semibold leading-snug ${dark ? "text-white" : "text-[#0d2e4c]"}`}>
          {title}
        </div>
        <div className={`card-subtitle text-[13.5px] font-normal leading-snug mt-0.5 ${dark ? "text-white/85" : "text-[#355573]"}`}>
          {subtitle}
        </div>
      </div>
    </button>
  );
}

function MobileCallout({ hotspot, title, subtitle, dark }: { hotspot: HotspotKey; title: string; subtitle: string; dark?: boolean }) {
  const { openDialog } = useSite();
  return (
    <button
      aria-haspopup="dialog"
      type="button"
      onClick={() => openDialog({ kind: "hotspot", hotspot })}
      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl backdrop-blur-md border ${
        dark ? "bg-[#2b587e]/75 border-white/25" : "bg-white/80 border-white/60"
      }`}
    >
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${dark ? "bg-white/90" : "bg-[#0d2e4c]"}`}>
        <Check className={`w-3.5 h-3.5 ${dark ? "text-[#0d2e4c]" : "text-white"}`} aria-hidden="true" />
      </div>
      <div className="text-left">
        <div className={`text-xs font-semibold ${dark ? "text-white" : "text-[#0d2e4c]"}`}>{title}</div>
        <div className={`text-[10px] ${dark ? "text-white/85" : "text-[#355573]"}`}>{subtitle}</div>
      </div>
    </button>
  );
}

function ScanSwitcher() {
  const { molar, announce } = useSite();
  const [mode, setMode] = useState<MolarMode>("hybrid");
  return (
    <div
      aria-label="Tooth display mode"
      role="group"
      className="mb-3 flex items-center gap-1 p-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[11px] text-white/90 scan-switcher"
    >
      {SCAN_MODES.map((item) => (
        <button
          key={item.mode}
          aria-pressed={mode === item.mode}
          type="button"
          className="scan-button"
          onClick={() => {
            setMode(item.mode);
            molar.current?.setMode(item.mode);
            announce(`${item.label} display selected`);
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function Hero() {
  const { openDialog, selectService } = useSite();

  return (
    <section
      id="home"
      className="relative min-h-[940px] lg:h-screen lg:min-h-[850px] lg:max-h-[1080px] w-full overflow-hidden flex flex-col justify-between select-none"
      style={{ background: "radial-gradient(58% 48% at 50% 54%, #dbeeff 0%, #98c1e3 42%, #6395be 76%, #45779f 100%)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.14) 0%, rgba(45,86,122,0.18) 18%, rgba(255,255,255,0.22) 34%, rgba(50,94,132,0.12) 64%, rgba(255,255,255,0.28) 76%, rgba(34,74,108,0.22) 92%, rgba(255,255,255,0.12) 100%)",
        }}
      />
      <div
        className="absolute bottom-0 inset-x-0 h-[220px] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(164,204,235,0) 0%, rgba(196,224,245,0.35) 35%, rgba(114,159,198,0.65) 100%)",
        }}
      />
      <div
        className="absolute bottom-[205px] inset-x-0 h-[1px] pointer-events-none opacity-55"
        style={{
          background: "linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0.1) 100%)",
        }}
      />

      <Header />

      <div className="gsap-hero-headline-wrap relative z-20 flex flex-col items-center text-center px-4 pt-7 sm:pt-9 lg:pt-10">
        <p className="gsap-hero-text text-[11px] sm:text-[12px] uppercase tracking-[0.16em] text-white/90 font-medium mb-3.5">
          PRECISION DENTISTRY • PERSONALIZED CARE
        </p>
        <h1 className="gsap-hero-text text-[38px] sm:text-[54px] md:text-[62px] lg:text-[66px] font-semibold text-white leading-[1.08] tracking-[-0.03em] max-w-4xl drop-shadow-xs">
          Advanced care.
          <br />
          A naturally confident smile.
        </h1>
        <p className="gsap-hero-text mt-4 text-[15px] sm:text-[17.5px] text-white/90 font-normal leading-[1.55] max-w-[610px]">
          Modern restorative dentistry designed around precision, comfort, and results that feel completely natural.
        </p>
      </div>

      <div className="hero-stage-row relative z-10 flex-1 w-full max-w-[1360px] mx-auto flex items-center justify-center">
        <div className="gsap-tooth-stage w-full h-full flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center select-none tooth-scene">
            <div
              className="absolute w-[360px] h-[360px] sm:w-[490px] sm:h-[490px] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(235,248,255,0.72) 0%, rgba(164,210,242,0.38) 45%, rgba(92,146,192,0) 74%)",
                filter: "blur(22px)",
              }}
            />
            <div
              className="absolute w-[85%] max-w-[680px] h-[1px] pointer-events-none opacity-75"
              style={{
                top: "31%",
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(168,232,255,0.85) 25%, rgba(255,255,255,0.95) 50%, rgba(168,232,255,0.85) 75%, transparent 100%)",
                boxShadow: "0 0 18px 2px rgba(145,225,255,0.65)",
              }}
            />
            <div
              className="absolute w-[75%] max-w-[580px] h-[1px] pointer-events-none opacity-80"
              style={{
                top: "62%",
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(155,228,255,0.75) 28%, rgba(255,255,255,1) 56%, rgba(155,228,255,0.8) 78%, transparent 100%)",
                boxShadow: "0 0 22px 3px rgba(135,220,255,0.75)",
              }}
            />
            <MolarViewer />
          </div>
        </div>
        <div className="gsap-card-left-wrap hidden sm:block absolute left-[4%] md:left-[7%] lg:left-[10.5%] top-[51%] -translate-y-1/2">
          <FloatingCard hotspot="precision" title="Precision" subtitle="Digital Smile Planning" />
        </div>
        <div className="gsap-card-right-wrap hidden sm:block absolute right-[4%] md:right-[7%] lg:right-[10.5%] top-[51%] -translate-y-1/2">
          <FloatingCard hotspot="comfort" title="Comfort" subtitle="Gentle, patient-first care" dark />
        </div>
      </div>

      <div className="relative z-20 flex sm:hidden gap-3 px-4 mb-4 justify-center mobile-callouts">
        <MobileCallout hotspot="precision" title="Precision" subtitle="Digital Smile Planning" />
        <MobileCallout hotspot="comfort" title="Comfort" subtitle="Gentle, patient-first" dark />
      </div>

      <div className="gsap-hero-bottom-wrap relative z-20 w-full max-w-[1380px] mx-auto px-6 sm:px-12 pb-7 sm:pb-9 flex flex-col sm:flex-row items-center justify-between gap-6 hero-bottom">
        <div className="gsap-bottom-bar text-center sm:text-left">
          <div id="patient-count" className="text-[36px] sm:text-[42px] font-bold text-white leading-none tracking-tight">
            1,500+
          </div>
          <p className="mt-1.5 text-[13.5px] text-white/85 leading-[1.35] max-w-[165px]">patients cared for with precision</p>
        </div>
        <div className="gsap-bottom-bar flex flex-col items-center">
          <ScanSwitcher />
          <button
            aria-haspopup="dialog"
            type="button"
            onClick={() => openDialog({ kind: "booking" })}
            className="px-10 py-4 rounded-full bg-[#0b2b47] hover:bg-[#071f35] text-white text-[16px] font-medium tracking-wide shadow-[0_14px_34px_rgba(8,33,56,0.45)] border border-white/15 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
          >
            Book a Consultation
          </button>
          <div className="mt-4 flex items-center gap-2 text-[11.5px] sm:text-[12px] tracking-[0.14em] uppercase text-white/90 font-medium">
            {SERVICE_KEYS.map((key, index) => (
              <span key={key} className="contents">
                {index > 0 && <span className="text-white/50">/</span>}
                <a href="#services" onClick={() => selectService(key)} className="hover:text-white transition-opacity">
                  {key.toUpperCase()}
                </a>
              </span>
            ))}
          </div>
        </div>
        <a
          href="#about"
          aria-label="Scroll to explore"
          className="gsap-bottom-bar relative w-[92px] h-[92px] flex items-center justify-center group cursor-pointer"
        >
          <svg focusable="false" aria-hidden="true" viewBox="0 0 100 100" className="w-full h-full animate-spin-slow text-white/90">
            <defs>
              <path id="scrollCirclePath" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
            </defs>
            <text fill="currentColor" fontSize="8.3" fontWeight="500" letterSpacing="2.05px">
              <textPath href="#scrollCirclePath" startOffset="0%">
                SCROLL TO EXPLORE • SCROLL TO EXPLORE •
              </textPath>
            </text>
          </svg>
          <div className="absolute w-[52px] h-[52px] rounded-full border border-white/60 flex items-center justify-center group-hover:bg-white/15 transition-colors">
            <ArrowDown
              className="w-5 h-5 text-white group-hover:translate-y-0.5 transition-transform"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </div>
        </a>
      </div>
    </section>
  );
}
