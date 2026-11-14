import { act, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { api, type RoomSnapshot } from "../services/api";
import { RoomStoreProvider, useRoomState, useRoomStore } from "../state/roomStore";
import { LobbyPage } from "./LobbyPage";

const ada = { id: "p1", name: "Ada", joinedAt: "2025-01-01" };
const bob = { id: "p2", name: "Bob", joinedAt: "2025-01-02" };
const snapshot = (participants: RoomSnapshot["participants"]): RoomSnapshot => ({
  code: "ABCD", status: "lobby", participants, availableWords: [], roles: ["drawer", "guesser"]
});

function SeededLobby({ room }: { room: RoomSnapshot }) {
  const store = useRoomStore();
  const state = useRoomState();
  useEffect(() => {
    store.setRoomSession({ participantId: "p1", room });
  }, [room, store]);
  return state.room ? <LobbyPage /> : null;
}

function renderLobby(room: RoomSnapshot) {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => root.render(
    <RoomStoreProvider>
      <MemoryRouter><SeededLobby room={room} /></MemoryRouter>
    </RoomStoreProvider>
  ));
  return {
    container,
    cleanup() {
      act(() => root.unmount());
      container.remove();
    }
  };
}

async function refresh(container: HTMLElement) {
  const button = Array.from(container.querySelectorAll("button")).find((item) => item.textContent === "Refresh Room");
  if (!button) throw new Error("Refresh button missing");
  await act(async () => button.click());
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("lobby participants", () => {
  it("shows every player as a named card followed by the player count", () => {
    const view = renderLobby(snapshot([ada, bob]));
    try {
      const cards = view.container.querySelectorAll(".player-list > .player-card");
      expect(Array.from(cards, (card) => card.textContent)).toEqual(["Ada", "Bob"]);
      expect(view.container.querySelector(".player-list + p")?.textContent).toBe("2 players");
    } finally {
      view.cleanup();
    }
  });

  it("shows an empty state and zero count when no one has joined", () => {
    const view = renderLobby(snapshot([]));
    try {
      expect(view.container.textContent).toContain("No participants are connected to this room yet.");
      expect(view.container.textContent).toContain("0 players");
      expect(view.container.querySelectorAll(".player-card")).toHaveLength(0);
    } finally {
      view.cleanup();
    }
  });

  it("updates cards, count and empty state from refreshed snapshots", async () => {
    const fetchRoom = vi.spyOn(api, "fetchRoom")
      .mockResolvedValueOnce({ room: snapshot([ada, bob]) })
      .mockResolvedValueOnce({ room: snapshot([]) });
    const view = renderLobby(snapshot([ada]));
    try {
      expect(view.container.querySelector(".player-list + p")?.textContent).toBe("1 player");
      await refresh(view.container);
      expect(fetchRoom).toHaveBeenCalledWith("ABCD", "p1");
      expect(Array.from(view.container.querySelectorAll(".player-card"), (card) => card.textContent)).toEqual(["Ada", "Bob"]);
      expect(view.container.querySelector(".player-list + p")?.textContent).toBe("2 players");
      await refresh(view.container);
      expect(view.container.querySelectorAll(".player-card")).toHaveLength(0);
      expect(view.container.textContent).toContain("No participants are connected to this room yet.");
      expect(view.container.textContent).toContain("0 players");
    } finally {
      view.cleanup();
    }
  });

  it("keeps the last list and reports a refresh failure", async () => {
    vi.spyOn(api, "fetchRoom").mockRejectedValue(new Error("Network error"));
    const view = renderLobby(snapshot([ada]));
    try {
      await refresh(view.container);
      expect(view.container.querySelector(".player-card")?.textContent).toBe("Ada");
      expect(view.container.textContent).toContain("1 player");
      expect(view.container.textContent).toContain("Network error");
    } finally {
      view.cleanup();
    }
  });
});
