import { describe, expect, it } from "vitest";
import { createRoom, getRoom, joinRoom, saveRoom, toRoomSnapshot } from "./roomStore.js";

describe("roomStore", () => {
  it("createRoom returns a room with a 4-character uppercase code", () => {
    const result = createRoom("Alice");

    expect(result.room.code).toMatch(/^[A-Z0-9]{4}$/);
    expect(result.room.participants).toHaveLength(1);
    expect(result.room.participants[0].name).toBe("Alice");
    expect(result.participantId).toBeDefined();
  });

  it("assigns the creator as drawer and every subsequent joiner as guesser in snapshots", () => {
    const created = createRoom("Alice");
    const bob = joinRoom(created.room.code, "Bob");
    const carol = joinRoom(created.room.code, "Carol");
    expect(toRoomSnapshot(created.room).participants.map(({ name, role }) => [name, role])).toEqual([["Alice", "drawer"]]);
    expect(bob).not.toBeNull();
    expect(carol).not.toBeNull();
    const stored = getRoom(created.room.code);
    expect(stored).not.toBeNull();
    expect(toRoomSnapshot(stored!).participants.map(({ name, role }) => [name, role])).toEqual([
      ["Alice", "drawer"], ["Bob", "guesser"], ["Carol", "guesser"]
    ]);
    expect(toRoomSnapshot(carol!.room, carol!.participantId).participants).toEqual(stored!.participants);
  });

  it("does not assign a new drawer when joining an empty saved room", () => {
    const { room } = createRoom("Alice");
    saveRoom({ ...room, participants: [] });
    expect(joinRoom(room.code, "Bob")?.room.participants[0].role).toBe("guesser");
  });

  it("joinRoom returns null for an unknown room code", () => {
    const result = joinRoom("ZZZZ", "Bob");

    expect(result).toBeNull();
  });
});
