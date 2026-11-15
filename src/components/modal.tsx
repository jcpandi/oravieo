"use client";

import gsap from "gsap";
import { useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "./site-provider";

interface ModalProps {
  id: string;
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  describedBy?: string;
  children: ReactNode;
}

/**
 * Native <dialog> shown with showModal(): the browser provides focus containment,
 * Escape-to-close and the backdrop. Focus returns to the control that opened it.
 */
export function Modal({ id, open, onClose, labelledBy, describedBy, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const backdropPointer = useRef(false);

  // Native "close" fires for Escape, backdrop clicks and dialog.close(); sync React state from it.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => {
      onCloseRef.current();
      if (opener.current?.isConnected) opener.current.focus({ preventScroll: true });
    };
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      opener.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
      // Animate the card, not the dialog, so the dialog stays in the browser's top layer.
      const card = dialog.firstElementChild;
      if (card && !prefersReducedMotion()) {
        gsap.fromTo(card, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.24, overwrite: true, clearProps: "transform,opacity" });
      }
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      id={id}
      className="modal-overlay"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      onPointerDown={(event) => {
        backdropPointer.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && backdropPointer.current) event.currentTarget.close();
      }}
    >
      {children}
    </dialog>
  );
}
