import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { api } from "../services/api";
import { RoomStoreProvider } from "../state/roomStore";
import { CreateRoomPage } from "./CreateRoomPage";
import { LobbyPage } from "./LobbyPage";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("create room", () => {
  it("shows the room code and Copy button in the lobby badge after creation", async () => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    vi.spyOn(api, "createRoom").mockResolvedValue({
      participantId: "p1",
      room: { code: "ABCD", status: "lobby", participants: [], availableWords: [], roles: [] },
    });
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    try {
      act(() => root.render(
        <RoomStoreProvider>
          <MemoryRouter initialEntries={["/create-room"]}>
            <Routes>
              <Route path="/create-room" element={<CreateRoomPage />} />
              <Route path="/lobby" element={<LobbyPage />} />
            </Routes>
          </MemoryRouter>
        </RoomStoreProvider>
      ));
      const form = container.querySelector("form");
      if (!form) throw new Error("Create room form missing");
      await act(async () => form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
      expect(api.createRoom).toHaveBeenCalled();
      const badge = container.querySelector(".room-code-badge");
      expect(badge?.querySelector(".room-code-badge__code")?.textContent).toBe("ABCD");
      expect(badge?.querySelector("button")?.textContent).toBe("Copy");
      expect(container.querySelector(".lobby-header")?.contains(badge ?? null)).toBe(true);
    } finally {
      act(() => root.unmount());
      container.remove();
    }
  });
});
