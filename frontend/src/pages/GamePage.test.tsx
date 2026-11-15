import { act, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { RoomSnapshot } from "../services/api";
import { RoomStoreProvider, useRoomState, useRoomStore } from "../state/roomStore";
import { GamePage } from "./GamePage";

const room: RoomSnapshot = {
  code: "ABCD", status: "lobby", roles: ["drawer", "guesser"],
  participants: [
    { id: "p1", name: "Ada", role: "drawer", joinedAt: "today" },
    { id: "p2", name: "Bob", role: "guesser", joinedAt: "today" }
  ],
  currentWord: "rocket"
};

function SeededGame({ participantId, snapshot }: { participantId: string; snapshot: RoomSnapshot }) {
  const store = useRoomStore();
  const state = useRoomState();
  useEffect(() => {
    store.setRoomSession({ participantId, room: snapshot });
  }, [participantId, snapshot, store]);
  return state.room ? <GamePage /> : null;
}

function renderGame(participantId: string, snapshot = room) {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => root.render(<RoomStoreProvider><MemoryRouter><SeededGame participantId={participantId} snapshot={snapshot} /></MemoryRouter></RoomStoreProvider>));
  return { container, cleanup() { act(() => root.unmount()); container.remove(); } };
}

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe("game word card", () => {
  it("hides the word from guessers and unknown viewers even if supplied in a snapshot", () => {
    for (const participantId of ["p2", "unknown"]) {
      const view = renderGame(participantId);
      try {
        expect(view.container.textContent).not.toContain("rocket");
        expect(view.container.textContent).not.toContain("Your word");
      } finally { view.cleanup(); }
    }
  });

  it("shows no word card if a drawer snapshot has no word", () => {
    const view = renderGame("p1", { ...room, currentWord: undefined });
    try { expect(view.container.textContent).not.toContain("Your word"); } finally { view.cleanup(); }
  });

  it("shows the current word in a card to the drawer", () => {
    const view = renderGame("p1");
    try {
      const card = Array.from(view.container.querySelectorAll(".card")).find((item) => item.querySelector("h2")?.textContent === "Your word");
      expect(card?.querySelector(".card__body")?.textContent).toContain("rocket");
    } finally { view.cleanup(); }
  });
});
