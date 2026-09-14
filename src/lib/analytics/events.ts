type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    va?: (event: string, payload?: AnalyticsPayload) => void;
  }
}

export function trackAlephEvent(event: string, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent("aleph:event", { detail: { event, payload } }));
  window.va?.(event, payload);
}
