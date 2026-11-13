import { act, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { api, type RoomSnapshot } from "../services/api";
import { RoomStoreProvider, useRoomStore } from "../state/roomStore";
import { LobbyPage } from "./LobbyPage";

const participants = [
  { id: "p1", name: "Alice", joinedAt: "2025-01-01" },
  { id: "p2", name: "Bob", joinedAt: "2025-01-01" }
];

function roomWithPlayers(players: RoomSnapshot["participants"]): RoomSnapshot {
  return { code: "ABCD", status: "lobby", participants: players, availableWords: [], roles: [] };
}

function InitializeRoom({ room }: { room: RoomSnapshot }) {
  const store = useRoomStore();
  useEffect(() => {
    store.setRoomSession({ participantId: "p1", room });
  }, [room, store]);
  return <LobbyPage />;
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("lobby player count", () => {
  it("updates the count and list after players join and leave on refresh", async () => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    const joined = [...participants, { id: "p3", name: "Carol", joinedAt: "2025-01-01" }];
    const fetchRoom = vi.spyOn(api, "fetchRoom")
      .mockResolvedValueOnce({ room: roomWithPlayers(joined) })
      .mockResolvedValueOnce({ room: roomWithPlayers([]) });
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    try {
      act(() => root.render(
        <RoomStoreProvider><MemoryRouter><InitializeRoom room={roomWithPlayers(participants)} /></MemoryRouter></RoomStoreProvider>
      ));
      const refresh = Array.from(container.querySelectorAll("button")).find((button) => button.textContent === "Refresh Room");
      if (!refresh) throw new Error("Refresh button missing");
      await act(async () => refresh.click());
      expect(fetchRoom).toHaveBeenCalledWith("ABCD", "p1");
      expect(container.querySelector(".card h2")?.textContent).toBe("Participants (3 players)");
      expect(container.querySelectorAll(".player-list li")).toHaveLength(3);
      expect(container.querySelector(".player-list")?.textContent).toContain("Carol");
      await act(async () => refresh.click());
      expect(container.querySelector(".card h2")?.textContent).toBe("Participants (0 players)");
      expect(container.querySelectorAll(".player-list li")).toHaveLength(0);
      expect(container.textContent).toContain("No participants are connected");
    } finally {
      act(() => root.unmount());
      container.remove();
    }
  });

  it("uses the singular label for one player", () => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    try {
      act(() => root.render(
        <RoomStoreProvider><MemoryRouter><InitializeRoom room={roomWithPlayers(participants.slice(0, 1))} /></MemoryRouter></RoomStoreProvider>
      ));
      expect(container.querySelector(".card h2")?.textContent).toBe("Participants (1 player)");
      expect(container.querySelectorAll(".player-list li")).toHaveLength(1);
    } finally {
      act(() => root.unmount());
      container.remove();
    }
  });

  it("shows the current count beside the participant list heading", () => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    try {
      act(() => root.render(
        <RoomStoreProvider><MemoryRouter><InitializeRoom room={roomWithPlayers(participants)} /></MemoryRouter></RoomStoreProvider>
      ));
      const list = container.querySelector(".player-list");
      const card = list?.closest(".card");
      expect(card?.querySelector("h2")?.textContent).toBe("Participants (2 players)");
      expect(list?.querySelectorAll("li")).toHaveLength(2);
    } finally {
      act(() => root.unmount());
      container.remove();
    }
  });
});
