import { act, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, it, vi } from "vitest";
import { api, type RoomSnapshot } from "../services/api";
import { RoomStoreProvider, useRoomStore } from "./roomStore";

const room: RoomSnapshot = {
  code: "ABCD", status: "lobby", hostParticipantId: "p1", participants: [], availableWords: [], roles: []
};

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

it("does not replace a new room with a late response from the previous room", async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  let resolveFetch!: (value: { room: RoomSnapshot }) => void;
  vi.spyOn(api, "fetchRoom").mockReturnValue(new Promise((resolve) => { resolveFetch = resolve; }));
  let store!: ReturnType<typeof useRoomStore>;
  function CaptureStore() {
    const currentStore = useRoomStore();
    useEffect(() => { store = currentStore; }, [currentStore]);
    return null;
  }
  const container = document.createElement("div");
  const root = createRoot(container);
  act(() => root.render(<RoomStoreProvider><CaptureStore /></RoomStoreProvider>));
  try {
    store.setRoomSession({ participantId: "p1", room });
    const pending = store.fetchRoom();
    const nextRoom = { ...room, code: "WXYZ", hostParticipantId: "p2" };
    store.setRoomSession({ participantId: "p2", room: nextRoom });
    resolveFetch({ room });
    await pending;
    expect(store.getSnapshot().room).toEqual(nextRoom);
  } finally { act(() => root.unmount()); }
});
