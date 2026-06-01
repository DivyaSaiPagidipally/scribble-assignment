import { describe, expect, it } from "vitest";
import { createRoom, getRoom, joinRoom } from "./roomStore.js";

describe("roomStore", () => {
  it("createRoom returns a room with a 4-character uppercase code", () => {
    const result = createRoom("Alice");

    expect(result.room.code).toMatch(/^[A-Z0-9]{4}$/);
    expect(result.room.participants).toHaveLength(1);
    expect(result.room.participants[0].name).toBe("Alice");
    expect(result.participantId).toBeDefined();
  });

  it("createRoom trims the player name", () => {
    const result = createRoom("  Charlie  ");
    expect(result.room.participants[0].name).toBe("Charlie");
  });

  it("createRoom falls back to Player if name is empty or undefined", () => {
    const result = createRoom();
    expect(result.room.participants[0].name).toBe("Player");
  });

  it("joinRoom returns null for an unknown room code", () => {
    const result = joinRoom("ZZZZ", "Bob");

    expect(result).toBeNull();
  });

  it("joinRoom adds a participant with a trimmed custom name to an existing room", () => {
    const created = createRoom("Alice");
    const result = joinRoom(created.room.code, "  Bob  ");

    expect(result).not.toBeNull();
    expect(result!.room.participants).toHaveLength(2);
    expect(result!.room.participants[1].name).toBe("Bob");
  });

  it("roomStore isolates different rooms", () => {
    const room1 = createRoom("Alice");
    const room2 = createRoom("Bob");

    expect(room1.room.code).not.toBe(room2.room.code);
    expect(room1.room.participants).toHaveLength(1);
    expect(room2.room.participants).toHaveLength(1);
    expect(room1.room.participants[0].name).toBe("Alice");
    expect(room2.room.participants[0].name).toBe("Bob");

    joinRoom(room1.room.code, "Charlie");
    const r1Updated = getRoom(room1.room.code);
    const r2Updated = getRoom(room2.room.code);

    expect(r1Updated!.participants).toHaveLength(2);
    expect(r2Updated!.participants).toHaveLength(1);
  });
});
