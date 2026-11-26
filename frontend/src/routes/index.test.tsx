import { act, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RoomStoreProvider, useRoomState, useRoomStore } from "../state/roomStore";
import { AppRoutes } from "./index";

function SeededRoutes() {
  const store = useRoomStore();
  const { room } = useRoomState();
  useEffect(() => {
    store.setRoomSession({
      participantId: "p1",
      room: { code: "ABCD", status: "lobby", participants: [{ id: "p1", name: "Ada", role: "drawer", joinedAt: "2025-01-01" }], availableWords: [], roles: ["drawer", "guesser"] }
    });
  }, [store]);
  return room ? <AppRoutes /> : null;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("app shell footer", () => {
  it.each([
    ["/", "Scribble Game"],
    ["/create-room", "Create Room"],
    ["/join-room", "Join Room"],
    ["/lobby", "Lobby"],
    ["/game", "Guess the Word!"]
  ])("shows the build label on %s", (path, heading) => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    window.history.pushState({}, "", path);
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    try {
      act(() => root.render(<RoomStoreProvider><SeededRoutes /></RoomStoreProvider>));
      expect(container.querySelector("main h1")?.textContent).toBe(heading);
      expect(container.querySelector(".app-shell > footer")?.textContent).toBe("Scribble lab · starter build");
    } finally {
      act(() => root.unmount());
      container.remove();
    }
  });
});
