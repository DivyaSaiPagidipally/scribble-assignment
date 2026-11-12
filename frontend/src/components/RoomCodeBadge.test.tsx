import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RoomCodeBadge } from "./RoomCodeBadge";

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
  Reflect.deleteProperty(navigator, "clipboard");
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function button() {
  const element = container.querySelector("button");
  if (!element) throw new Error("Copy button missing");
  return element;
}

describe("RoomCodeBadge", () => {
  it("keeps the code readable next to a focusable, named native button", () => {
    act(() => root.render(<RoomCodeBadge code="Ab12" />));
    const code = container.querySelector(".room-code-badge__code");
    expect(code?.textContent).toBe("Ab12");
    expect(code?.nextElementSibling).toBe(button());
    expect(button().textContent).toBe("Copy");
    expect(button().type).toBe("button");
    button().focus();
    expect(document.activeElement).toBe(button());
    expect(button().tabIndex).toBe(0);
  });

  it("copies the unchanged code and resets Copied two seconds after the latest click", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    act(() => root.render(<RoomCodeBadge code="Ab12" />));
    await act(async () => button().click());
    expect(writeText).toHaveBeenCalledWith("Ab12");
    expect(button().textContent).toBe("Copied");
    act(() => vi.advanceTimersByTime(1500));
    await act(async () => button().click());
    act(() => vi.advanceTimersByTime(1999));
    expect(button().textContent).toBe("Copied");
    act(() => vi.advanceTimersByTime(1));
    expect(button().textContent).toBe("Copy");
    expect(container.querySelector(".room-code-badge__code")?.textContent).toBe("Ab12");
  });

  it("reports clipboard rejection or unavailability without claiming success", async () => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) } });
    act(() => root.render(<RoomCodeBadge code="ABCD" />));
    await act(async () => button().click());
    expect(button().textContent).toBe("Copy");
    expect(container.querySelector('[role="status"]')?.textContent).toContain("Copy failed");
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined });
    await act(async () => button().click());
    expect(button().textContent).toBe("Copy");
    expect(container.querySelector('[role="status"]')?.textContent).toContain("Copy failed");
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: vi.fn().mockResolvedValue(undefined) } });
    await act(async () => button().click());
    expect(button().textContent).toBe("Copied");
    expect(container.querySelector('[role="status"]')?.textContent).not.toContain("Copy failed");
  });

  it("ignores an old copy result when the room code changes", async () => {
    let resolveCopy: () => void = () => {};
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: () => new Promise<void>((resolve) => { resolveCopy = resolve; }) } });
    act(() => root.render(<RoomCodeBadge code="OLD" />));
    act(() => button().click());
    act(() => root.render(<RoomCodeBadge code="NEW" />));
    await act(async () => resolveCopy());
    expect(button().textContent).toBe("Copy");
    expect(container.querySelector(".room-code-badge__code")?.textContent).toBe("NEW");
  });
});
