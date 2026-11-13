import { act, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { api, type RoomSnapshot } from "../services/api";
import { RoomStoreProvider, useRoomStore } from "../state/roomStore";
import { LobbyPage } from "./LobbyPage";

const room: RoomSnapshot = {
  code: "ABCD", status: "lobby", hostParticipantId: "p1",
  participants: [
    { id: "p1", name: "Alice", joinedAt: "2024-01-01" },
    { id: "p2", name: "Bob", joinedAt: "2024-01-02" }
  ],
  availableWords: [], roles: []
};

function Setup() {
  const store = useRoomStore();
  useEffect(() => store.setRoomSession({ participantId: "p2", room }), [store]);
  return <LobbyPage />;
}

function renderLobby() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => root.render(<RoomStoreProvider><MemoryRouter><Setup /></MemoryRouter></RoomStoreProvider>));
  return { container, cleanup: () => { act(() => root.unmount()); container.remove(); } };
}

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("lobby participants", () => {
  it("lists each player by name and marks only the creator as Host", () => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    const { container, cleanup } = renderLobby();
    try {
      const players = container.querySelectorAll(".player-list li");
      expect(Array.from(players, (player) => player.textContent)).toEqual(["AliceHost", "Bob"]);
      expect(players[0].querySelector(".player-list__meta")?.textContent).toBe("Host");
      expect(players[1].querySelector(".player-list__meta")).toBeNull();
    } finally { cleanup(); }
  });

  it("polls for new players and stops polling after leaving the lobby", async () => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    vi.useFakeTimers();
    const fetchRoom = vi.spyOn(api, "fetchRoom").mockResolvedValue({ room: {
      ...room, participants: [...room.participants, { id: "p3", name: "Carol", joinedAt: "2024-01-03" }]
    } });
    const { container, cleanup } = renderLobby();
    try {
      await act(async () => { await vi.advanceTimersByTimeAsync(2000); });
      expect(fetchRoom).toHaveBeenCalledWith("ABCD", "p2");
      expect(Array.from(container.querySelectorAll(".player-list li"), (player) => player.textContent)).toEqual(["AliceHost", "Bob", "Carol"]);
    } finally { cleanup(); }
    await act(async () => { await vi.advanceTimersByTimeAsync(4000); });
    expect(fetchRoom).toHaveBeenCalledTimes(1);
  });

  it("shares an in-flight poll with a manual refresh", async () => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    vi.useFakeTimers();
    let resolveFetch!: (value: { room: RoomSnapshot }) => void;
    const fetchRoom = vi.spyOn(api, "fetchRoom").mockReturnValue(new Promise((resolve) => { resolveFetch = resolve; }));
    const { container, cleanup } = renderLobby();
    try {
      await act(async () => { await vi.advanceTimersByTimeAsync(2000); });
      const button = Array.from(container.querySelectorAll("button")).find((item) => item.textContent === "Refresh Room");
      if (!button) throw new Error("Refresh button missing");
      act(() => button.click());
      expect(fetchRoom).toHaveBeenCalledTimes(1);
      await act(async () => { resolveFetch({ room }); });
    } finally { cleanup(); }
  });

  it("keeps the last list on a polling failure and recovers on retry", async () => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    vi.useFakeTimers();
    vi.spyOn(api, "fetchRoom").mockRejectedValueOnce(new Error("Network error")).mockResolvedValueOnce({ room });
    const { container, cleanup } = renderLobby();
    try {
      await act(async () => { await vi.advanceTimersByTimeAsync(2000); });
      expect(container.textContent).toContain("Network error");
      expect(container.querySelectorAll(".player-list li")).toHaveLength(2);
      await act(async () => { await vi.advanceTimersByTimeAsync(2000); });
      expect(container.textContent).not.toContain("Network error");
    } finally { cleanup(); }
  });
});
