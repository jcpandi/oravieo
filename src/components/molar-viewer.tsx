"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSite } from "./site-provider";

export function MolarViewer() {
  const { molar } = useSite();
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let disposed = false;
    let dispose: (() => void) | undefined;

    // three.js loads only on the client, after first paint, in its own chunk.
    import("@/lib/molar")
      .then(({ createMolar }) => {
        if (disposed) return;
        try {
          const api = createMolar(container, { onReadyChange: setReady, onDraggingChange: setDragging });
          molar.current = api;
          dispose = api.dispose;
        } catch {
          container.querySelector("canvas")?.remove();
          setFailed(true);
        }
      })
      .catch(() => setFailed(true));

    return () => {
      disposed = true;
      dispose?.();
      molar.current = null;
    };
  }, [molar]);

  return (
    <div
      ref={containerRef}
      aria-label="Interactive 3D molar. Drag or use arrow keys to rotate. Press Home to reset."
      role="img"
      tabIndex={0}
      id="tooth-viewer"
      data-ready={ready}
      data-dragging={dragging}
      className="relative z-10 w-full cursor-grab active:cursor-grabbing tooth-viewer"
      title="Drag to rotate. Arrow keys also rotate; Home resets the view."
    >
      <Image
        className="tooth-fallback"
        src="/tooth-fallback.svg"
        alt="Porcelain molar with a digital scan frame"
        width={460}
        height={520}
        unoptimized
      />
      <span className="viewer-hint">
        {failed ? "3D preview unavailable on this device" : "Drag to explore · Arrow keys to rotate"}
      </span>
    </div>
  );
}
