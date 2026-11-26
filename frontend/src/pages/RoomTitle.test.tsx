import { act, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { RoomSnapshot } from "../services/api";
import { RoomStoreProvider, useRoomState, useRoomStore } from "../state/roomStore";
import { CreateRoomPage } from "./CreateRoomPage";
import { GamePage } from "./GamePage";
import { JoinRoomPage } from "./JoinRoomPage";
import { LobbyPage } from "./LobbyPage";
import { StartPage } from "./StartPage";

const room = (code: string): RoomSnapshot => ({
  code, status: "lobby", participants: [], availableWords: [], roles: ["drawer", "guesser"]
});

function Controls() {
  const store = useRoomStore();
  const navigate = useNavigate();
  const state = useRoomState();
  useEffect(() => {
    store.setRoomSession({ participantId: "p1", room: room("ABCD") });
  }, [store]);
  return <>
    <button onClick={() => store.setRoomSnapshot(room("WXYZ"))}>Change room</button>
    <button onClick={() => navigate("/game")}>Go to game</button>
    <button onClick={() => navigate("/lobby")}>Go to lobby</button>
    <button onClick={() => navigate("/")}>Go to start</button>
    <button onClick={() => navigate("/create-room")}>Go to create</button>
    <button onClick={() => navigate("/join-room")}>Go to join</button>
    {state.room && <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/create-room" element={<CreateRoomPage />} />
      <Route path="/join-room" element={<JoinRoomPage />} />
      <Route path="/lobby" element={<LobbyPage />} />
      <Route path="/game" element={<GamePage />} />
    </Routes>}
  </>;
}

function renderRoom(initialPath = "/lobby") {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => root.render(
    <RoomStoreProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <Controls />
      </MemoryRouter>
    </RoomStoreProvider>
  ));
  return {
    click(label: string) {
      const button = Array.from(container.querySelectorAll("button")).find((item) => item.textContent === label);
      if (!button) throw new Error(`Button ${label} missing`);
      act(() => button.click());
    },
    cleanup() {
      act(() => root.unmount());
      container.remove();
    }
  };
}

afterEach(() => {
  document.title = "Scribble";
  vi.unstubAllGlobals();
});

describe("room tab title", () => {
  it("shows the current room code in the lobby and game, including after a room update", () => {
    const view = renderRoom();
    try {
      expect(document.title).toBe("Scribble · Room ABCD");
      view.click("Change room");
      expect(document.title).toBe("Scribble · Room WXYZ");
      view.click("Go to game");
      expect(document.title).toBe("Scribble · Room WXYZ");
      view.click("Exit Game");
      expect(document.title).toBe("Scribble · Room WXYZ");
    } finally {
      view.cleanup();
    }
  });

  it("uses the default title on start, create and join pages, including after leaving either room page", () => {
    for (const [path, destination] of [["/", "Go to start"], ["/create-room", "Go to create"], ["/join-room", "Go to join"]]) {
      document.title = "Scribble";
      const view = renderRoom(path);
      try {
        expect(document.title).toBe("Scribble");
        for (const roomPage of ["Go to lobby", "Go to game"]) {
          view.click(roomPage);
          expect(document.title).toBe("Scribble · Room ABCD");
          view.click(destination);
          expect(document.title).toBe("Scribble");
        }
      } finally {
        view.cleanup();
      }
    }
  });
});
