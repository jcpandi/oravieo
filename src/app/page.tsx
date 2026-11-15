import { About } from "@/components/about";
import { BookingDialog } from "@/components/booking-dialog";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { CodeDialog, HotspotDialog } from "@/components/info-dialogs";
import { Journey } from "@/components/journey";
import { Motion } from "@/components/motion";
import { Results } from "@/components/results";
import { ScrollTelemetry } from "@/components/scroll-telemetry";
import { Services } from "@/components/services";
import { SiteProvider } from "@/components/site-provider";

export default function Home() {
  return (
    <SiteProvider>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="font-sans antialiased text-slate-900 bg-[#e8f1f8] selection:bg-[#0d2e4c] selection:text-white overflow-x-hidden">
        <ScrollTelemetry />
        <main tabIndex={-1} id="main-content" className="min-h-screen">
          <Hero />
          <About />
          <Services />
          <Results />
          <Journey />
        </main>
        <Footer />
      </div>
      <BookingDialog />
      <CodeDialog />
      <HotspotDialog />
      <Motion />
    </SiteProvider>
  );
}
