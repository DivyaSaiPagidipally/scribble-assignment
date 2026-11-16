import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { StartPage } from "./StartPage";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("StartPage", () => {
  it("shows Hello in the footer after the main page content", () => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    try {
      act(() => root.render(<MemoryRouter><StartPage /></MemoryRouter>));
      const panel = container.querySelector(".hero");
      const footer = panel?.querySelector("footer");
      expect(footer?.textContent).toBe("Hello");
      expect(panel?.lastElementChild).toBe(footer);
      expect(panel?.querySelector('a[href="/create-room"]')?.textContent).toBe("Create Room");
      expect(panel?.querySelector('a[href="/join-room"]')?.textContent).toBe("Join Room");
    } finally {
      act(() => root.unmount());
      container.remove();
    }
  });
});
