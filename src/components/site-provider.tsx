"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import type { MolarApi } from "@/lib/molar";
import { TREATMENT_NAMES, type HotspotKey, type SectionId, type ServiceKey } from "@/lib/site-data";

type Dialog = { kind: "booking" } | { kind: "code" } | { kind: "hotspot"; hotspot: HotspotKey } | null;

interface SiteContextValue {
  service: ServiceKey;
  selectService: (key: ServiceKey, options?: { scroll?: boolean }) => void;
  dialog: Dialog;
  openDialog: (dialog: NonNullable<Dialog>) => void;
  /** Closes the open dialog; with `kind`, only if that dialog is the one open. */
  closeDialog: (kind?: NonNullable<Dialog>["kind"]) => void;
  activeSection: SectionId;
  setActiveSection: (id: SectionId) => void;
  molar: RefObject<MolarApi | null>;
  /** Bumped to re-run every GSAP entrance and scroll animation. */
  replayToken: number;
  replay: () => void;
  announce: (message: string) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const SiteContext = createContext<SiteContextValue | null>(null);

export function useSite() {
  const value = useContext(SiteContext);
  if (!value) throw new Error("useSite must be used inside <SiteProvider>");
  return value;
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [service, setService] = useState<ServiceKey>("restorative");
  const [dialog, setDialog] = useState<Dialog>(null);
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const [replayToken, setReplayToken] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState("");
  const statusTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const molar = useRef<MolarApi | null>(null);

  // Clear, then set, so screen readers repeat identical consecutive messages.
  const announce = useCallback((message: string) => {
    clearTimeout(statusTimer.current);
    setStatus("");
    statusTimer.current = setTimeout(() => setStatus(message), 40);
  }, []);

  const selectService = useCallback(
    (key: ServiceKey, { scroll = false }: { scroll?: boolean } = {}) => {
      setService(key);
      if (scroll) {
        document.getElementById("services")?.scrollIntoView({ behavior: prefersReducedMotion() ? "instant" : "smooth" });
      }
      announce(`${TREATMENT_NAMES[key]} selected`);
    },
    [announce],
  );

  const openDialog = useCallback((next: NonNullable<Dialog>) => {
    setMenuOpen(false);
    setDialog(next);
  }, []);
  const closeDialog = useCallback(
    (kind?: NonNullable<Dialog>["kind"]) => setDialog((current) => (!kind || current?.kind === kind ? null : current)),
    [],
  );

  // Lock page scroll while any dialog is open.
  useEffect(() => {
    document.body.classList.toggle("modal-open", dialog !== null);
  }, [dialog]);

  const replay = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    molar.current?.reset();
    setReplayToken((token) => token + 1);
    announce("Page animations replayed");
  }, [announce]);

  const value = useMemo<SiteContextValue>(
    () => ({
      service,
      selectService,
      dialog,
      openDialog,
      closeDialog,
      activeSection,
      setActiveSection,
      molar,
      replayToken,
      replay,
      announce,
      menuOpen,
      setMenuOpen,
    }),
    [service, selectService, dialog, openDialog, closeDialog, activeSection, replayToken, replay, announce, menuOpen],
  );

  return (
    <SiteContext.Provider value={value}>
      {children}
      <div className="sr-only" role="status" aria-live="polite">
        {status}
      </div>
    </SiteContext.Provider>
  );
}
