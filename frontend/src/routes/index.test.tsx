import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../App";

afterEach(() => {
  vi.unstubAllGlobals();
  window.history.replaceState(null, "", "/");
});

describe("app routes", () => {
  it("explains the room and player data collected on the privacy page", () => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    window.history.replaceState(null, "", "/privacy");
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    try {
      act(() => root.render(<App />));
      const paragraphs = Array.from(container.querySelectorAll("main p"), (p) => p.textContent ?? "");
      expect(paragraphs.some((text) => /player names/i.test(text) && /room codes/i.test(text))).toBe(true);
    } finally {
      act(() => root.unmount());
      container.remove();
    }
  });

  it("shows the Privacy Policy heading on direct navigation to /privacy", () => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    window.history.replaceState(null, "", "/privacy");
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    try {
      act(() => root.render(<App />));
      expect(container.querySelector("h1")?.textContent).toBe("Privacy Policy");
      expect(window.location.pathname).toBe("/privacy");
    } finally {
      act(() => root.unmount());
      container.remove();
    }
  });
});
