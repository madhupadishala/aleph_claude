"use client";

import { useEffect } from "react";

export default function ResourcesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Resources page error", error);
  }, [error]);

  return (
    <main className="page-wrap narrow">
      <p className="eyebrow">RESOURCES</p>
      <h1>Let&apos;s reload the practice tools.</h1>
      <p>
        The Resources page hit a temporary browser error. Your information is not
        stored, and you can safely reload the tools.
      </p>
      <button type="button" className="button primary" onClick={() => reset()}>
        Reload resources
      </button>
    </main>
  );
}
