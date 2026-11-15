import { CodeXml, RotateCcw } from "lucide-react";
import { BookButton, CodeButton, ReplayButton } from "./action-buttons";

export function Footer() {
  return (
    <footer id="contact" className="bg-[#0d2e4c] text-white pt-20 pb-16 px-6 sm:px-12 border-t border-white/10">
      <div className="max-w-[1340px] mx-auto">
        <div
          className="contact-console-reveal rounded-[32px] p-8 sm:p-12 mb-16 border border-white/20 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8"
          style={{
            background:
              "radial-gradient(circle at 80% 20%, rgba(124,224,255,0.22) 0%, rgba(25,68,107,0.65) 55%, rgba(11,37,61,0.9) 100%)",
          }}
        >
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">PERSONALIZED CONSULTATION</span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-white mt-2 mb-3">Ready for a naturally confident smile?</h2>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              Experience a private 3D digital smile consultation in our sanctuary suites—complete with optical scanning and
              transparent treatment planning.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <BookButton className="px-8 py-4 rounded-full bg-white text-[#0d2e4c] hover:bg-sky-50 text-sm font-semibold shadow-xl transition-transform hover:scale-[1.03]">
              Book a Consultation
            </BookButton>
            <ReplayButton className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium border border-white/20 transition-colors">
              <RotateCcw className="w-4 h-4 text-sky-300" aria-hidden="true" />
              Replay Scroll Animations
            </ReplayButton>
          </div>
        </div>
        <div className="contact-console-reveal flex flex-col md:flex-row items-start md:items-center justify-between gap-10 pt-6 border-t border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-full border border-white/80" />
              </div>
              <span className="text-xl font-semibold">Oravieo</span>
            </div>
            <p className="text-sm text-white/70 max-w-sm">
              Precision restorative, cosmetic, and implant dentistry crafted around natural aesthetics and patient comfort.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <CodeButton className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/15 transition-colors">
              <CodeXml className="w-4 h-4 text-sky-300" aria-hidden="true" />
              View Next.js + GSAP Code
            </CodeButton>
            <BookButton className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-[#0d2e4c] hover:bg-sky-50 text-sm font-semibold transition-colors">
              Book Visit
            </BookButton>
          </div>
        </div>
        <p className="site-footnote">
          Treatment descriptions and figures are retained from the supplied design and are illustrative. Appointment
          requests are reviewed by the clinic team and are not confirmed until we contact you.
        </p>
      </div>
    </footer>
  );
}
