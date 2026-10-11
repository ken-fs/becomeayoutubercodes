"use client";

import { useEffect, useRef } from "react";
import type { AdSlot } from "@/lib/ads";

/**
 * Adsterra banner, isolated inside its own srcdoc iframe.
 *
 * The network's snippet sets a single global `atOptions` and then loads
 * invoke.js, which renders wherever its own script tag sits. Two units on one
 * page would clobber each other's `atOptions`, so each unit gets its own
 * document — its own globals, no ordering rules to remember.
 *
 * The box reserves its exact size up front, so a slow or blocked ad never
 * shifts the layout (CLS is the one Core Web Vital a bad ad slot can ruin).
 */
export function AdsterraBanner({
  slot,
  className = "",
}: {
  slot: AdSlot;
  className?: string;
}) {
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = ref.current;
    if (!iframe || !slot.key) return;
    iframe.srcdoc = `<!doctype html><html><head><meta charset="utf-8">
<style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style>
</head><body>
<script type="text/javascript">
atOptions={key:'${slot.key}',format:'iframe',height:${slot.height},width:${slot.width},params:{}};
</${""}script>
<script type="text/javascript" src="${slot.src}"></${""}script>
</body></html>`;
  }, [slot.key, slot.width, slot.height, slot.src]);

  // Nothing to show until a key is configured.
  if (!slot.key) return null;

  return (
    <div className={"flex flex-col items-center " + className}>
      <span className="mb-1 text-[0.625rem] tracking-wide text-muted-foreground/70 uppercase">
        Ad
      </span>
      <iframe
        ref={ref}
        width={slot.width}
        height={slot.height}
        title="Advertisement"
        aria-hidden="true"
        tabIndex={-1}
        scrolling="no"
        loading="lazy"
        style={{
          border: 0,
          display: "block",
          margin: "0 auto",
          maxWidth: "100%",
          width: slot.width,
          height: slot.height,
        }}
      />
    </div>
  );
}
