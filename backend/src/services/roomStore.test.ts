import { describe, expect, it } from "vitest";
import { createRoom, getRoom, joinRoom, toRoomSnapshot } from "./roomStore.js";

describe("roomStore", () => {
  it("createRoom returns a room with a 4-character uppercase code", () => {
    const result = createRoom("Alice");

    expect(result.room.code).toMatch(/^[A-Z0-9]{4}$/);
    expect(result.room.participants).toHaveLength(1);
    expect(result.room.participants[0].name).toBe("Alice");
    expect(result.participantId).toBeDefined();
  });

  it("preserves the creator as host and includes all names in snapshots after joins", () => {
    const created = createRoom("Alice");
    const joined = joinRoom(created.room.code, "Bob");
    expect(joined).not.toBeNull();
    const room = getRoom(created.room.code);
    if (!room || !joined) throw new Error("Room or join missing");
    const snapshot = toRoomSnapshot(room, joined.participantId);
    expect(snapshot.hostParticipantId).toBe(created.participantId);
    expect(snapshot.participants.map((player) => player.name)).toEqual(["Alice", "Bob"]);
    expect(toRoomSnapshot(joined.room).hostParticipantId).toBe(created.participantId);
  });

  it("joinRoom returns null for an unknown room code", () => {
    const result = joinRoom("ZZZZ", "Bob");

    expect(result).toBeNull();
  });
});
