"use client";

import { useState } from "react";
import { Check, Copy } from "@phosphor-icons/react/dist/ssr";

/**
 * Copy control for a redeem code.
 *
 * Codes are case-sensitive, so a mis-copied string is the single most common
 * failure. The button confirms inline rather than with a toast: the feedback
 * belongs where the user is looking.
 */
export function CopyCode({ code }: { code: string }) {
  const [state, setState] = useState<"idle" | "ok" | "fail">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setState("ok");
    } catch {
      setState("fail");
    }
    setTimeout(() => setState("idle"), 1600);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy code ${code}`}
      className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[var(--radius-control)] border rule bg-card px-3 text-xs font-medium transition-colors hover:bg-muted active:scale-[0.97]"
    >
      {state === "ok" ? (
        <>
          <Check size={13} weight="bold" className="text-primary" />
          <span className="text-primary">Copied</span>
        </>
      ) : state === "fail" ? (
        <span>Select and copy</span>
      ) : (
        <>
          <Copy size={13} weight="bold" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}
