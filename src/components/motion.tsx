"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COUNTERS, formatCounter, type CounterKey } from "@/lib/site-data";
import { useSite } from "./site-provider";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function resetCounters() {
  const patients = document.getElementById("patient-count");
  if (patients) patients.textContent = "1,500+";
  document.querySelectorAll<HTMLElement>("[data-counter]").forEach((el) => {
    const [end, decimals, suffix] = COUNTERS[el.dataset.counter as CounterKey];
    el.textContent = formatCounter(end, decimals, suffix);
  });
}

/**
 * Page-wide GSAP entrance and ScrollTrigger animations. Everything is created inside
 * gsap.matchMedia, so it only runs without a reduced-motion preference and is reverted
 * (and re-created) when the user presses "Replay Scroll Animations".
 */
export function Motion() {
  const { replayToken } = useSite();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".gsap-nav", { y: -15, opacity: 0.2, duration: 0.7, ease: "power3.out", clearProps: "transform,opacity" });
        gsap.from(".gsap-hero-text", {
          y: 24,
          opacity: 0,
          filter: "blur(5px)",
          stagger: 0.12,
          duration: 0.9,
          ease: "power3.out",
          clearProps: "transform,opacity,filter",
        });
        gsap.from(".gsap-tooth-stage", { scale: 0.92, opacity: 0, duration: 1.15, ease: "power3.out", delay: 0.15, clearProps: "transform,opacity" });
        gsap.from(".gsap-floating-card", { y: 18, opacity: 0, duration: 0.8, stagger: 0.12, delay: 0.35, ease: "power3.out", clearProps: "transform,opacity" });
        gsap.from(".gsap-bottom-bar", { y: 16, opacity: 0, duration: 0.7, stagger: 0.08, delay: 0.4, clearProps: "transform,opacity" });

        const patientCount = document.getElementById("patient-count");
        const patients = { value: 0 };
        gsap.to(patients, {
          value: 1500,
          duration: 1.8,
          ease: "power3.out",
          onUpdate: () => {
            if (patientCount) patientCount.textContent = Math.round(patients.value).toLocaleString("en-US") + "+";
          },
        });

        const revealGroups: [string, string][] = [
          ["#about", ".about-header-reveal"],
          ["#services", ".services-header-reveal"],
          ["#results", ".results-header-reveal"],
          ["#journey", ".journey-header-reveal"],
          ["#contact", ".contact-console-reveal"],
        ];
        revealGroups.forEach(([trigger, targets]) =>
          gsap.from(targets, {
            y: 30,
            opacity: 0,
            duration: 0.85,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger, start: "top 86%", once: true },
            clearProps: "transform,opacity",
          }),
        );

        const wide = window.innerWidth >= 768;
        gsap.utils
          .toArray<HTMLElement>(".about-biometric-card, .service-bento-card, .results-metric-card, .journey-step-card")
          .forEach((card, index) => {
            gsap.from(card, {
              y: card.classList.contains("journey-step-card") ? 24 : 36,
              opacity: 0,
              duration: 0.85,
              delay: wide ? (index % 3) * 0.07 : 0,
              ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 90%", once: true },
              clearProps: "transform,opacity",
            });
          });

        gsap.utils.toArray<HTMLElement>(".cad-layer-panel, .services-showcase-card, .results-slider-stage").forEach((panel) =>
          gsap.from(panel, {
            y: 28,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: panel, start: "top 88%", once: true },
            clearProps: "transform,opacity",
          }),
        );

        gsap.fromTo(
          ".biometric-ring-circle",
          { strokeDashoffset: 251.2 },
          {
            strokeDashoffset: (_: number, el: SVGElement) => Number(el.dataset.targetOffset),
            duration: 1.4,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: ".about-cards-grid", start: "top 82%", once: true },
          },
        );
        gsap.from(".cad-layer-bar", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.3,
          stagger: 0.14,
          ease: "expo.out",
          scrollTrigger: { trigger: ".cad-layer-panel", start: "top 80%", once: true },
        });
        gsap.fromTo(
          ".journey-laser-fill",
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: ".journey-steps-wrapper", start: "top 72%", end: "bottom 68%", scrub: 0.5 },
          },
        );

        gsap.utils.toArray<HTMLElement>("[data-counter]").forEach((el) => {
          const key = el.dataset.counter as CounterKey;
          const [end, decimals, suffix] = COUNTERS[key];
          const count = { value: key === "laser" ? 0.15 : end * 0.75 };
          gsap.to(count, {
            value: end,
            duration: 1.6,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
            onUpdate: () => {
              el.textContent = formatCounter(count.value, decimals, suffix);
            },
          });
        });

        return resetCounters;
      });

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ scrollTrigger: { trigger: "#home", start: "top top", end: "bottom top", scrub: 0.65 } })
          .to(".gsap-hero-headline-wrap", { y: -70, opacity: 0.2, ease: "none" }, 0)
          .to(".gsap-card-left-wrap", { x: -90, opacity: 0, ease: "none" }, 0)
          .to(".gsap-card-right-wrap", { x: 90, opacity: 0, ease: "none" }, 0)
          .to(".gsap-hero-bottom-wrap", { y: 30, opacity: 0, ease: "none" }, 0);
      });

      ScrollTrigger.refresh();
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    },
    { dependencies: [replayToken], revertOnUpdate: true },
  );

  return null;
}
