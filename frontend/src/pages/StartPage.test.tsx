import { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import App from "../App";

it("shows hi on the main page alongside the room links", () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  window.history.replaceState(null, "", "/");
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  try {
    act(() => root.render(<App />));
    const main = container.querySelector("main");
    expect(Array.from(main?.querySelectorAll("p") ?? []).some((p) => p.textContent === "hi")).toBe(true);
    expect(main?.querySelector('a[href="/create-room"]')?.textContent?.trim()).toBe("Create Room");
    expect(main?.querySelector('a[href="/join-room"]')?.textContent?.trim()).toBe("Join Room");
  } finally {
    act(() => root.unmount());
    container.remove();
    vi.unstubAllGlobals();
  }
});
