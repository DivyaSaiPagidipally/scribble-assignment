import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import { api } from "../services/api";
import styles from "../styles/app.css?raw";
import { AppShell } from "./AppShell";

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function expectFooter() {
  const footer = container.querySelector(".app-shell > footer");
  expect(footer?.textContent).toBe(`© ${new Date().getFullYear()} Scribble`);
  expect(footer?.previousElementSibling?.tagName).toBe("MAIN");
}

describe("app footer", () => {
  it.each(["/", "/create-room", "/join-room", "/unknown"])(
    "shows the current year on %s", (path) => {
      window.history.replaceState(null, "", path);
      act(() => root.render(<App />));
      expectFooter();
    }
  );

  it("shows the footer in the lobby and game after creating a room", async () => {
    vi.spyOn(api, "createRoom").mockResolvedValue({
      participantId: "p1",
      room: { code: "ABCD", status: "lobby", participants: [], availableWords: [], roles: [] },
    });
    window.history.replaceState(null, "", "/create-room");
    act(() => root.render(<App />));
    const form = container.querySelector("form");
    if (!form) throw new Error("Create room form missing");
    await act(async () => form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
    expect(window.location.pathname).toBe("/lobby");
    expectFooter();
    const start = Array.from(container.querySelectorAll("button")).find((button) => button.textContent === "Start Game");
    if (!start) throw new Error("Start Game button missing");
    act(() => start.click());
    expect(window.location.pathname).toBe("/game");
    expectFooter();
  });

  it("uses the local year at render time", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2031, 5, 1));
    act(() => root.render(<AppShell>Content</AppShell>));
    expect(container.querySelector("footer")?.textContent).toBe("© 2031 Scribble");
    vi.setSystemTime(new Date(2032, 0, 1));
    act(() => root.render(<AppShell>Content</AppShell>));
    expect(container.querySelector("footer")?.textContent).toBe("© 2032 Scribble");
  });

  it("uses a flowing flex layout that leaves space below content", () => {
    const style = document.createElement("style");
    style.textContent = styles;
    document.head.appendChild(style);
    try {
      act(() => root.render(<AppShell>Content</AppShell>));
      const shell = container.querySelector<HTMLElement>(".app-shell");
      const main = container.querySelector<HTMLElement>("main");
      const footer = container.querySelector<HTMLElement>("footer");
      if (!shell || !main || !footer) throw new Error("Shell elements missing");
      expect(getComputedStyle(shell).display).toBe("flex");
      expect(getComputedStyle(shell).flexDirection).toBe("column");
      expect(getComputedStyle(shell).minHeight).toBe("100vh");
      expect(getComputedStyle(main).flexGrow).toBe("1");
      expect(getComputedStyle(footer).position).not.toMatch(/^(fixed|absolute)$/);
      expect(getComputedStyle(footer).paddingTop).toBe("24px");
    } finally {
      style.remove();
    }
  });
});
