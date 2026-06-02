import { describe, expect, it } from "vitest";
import { createRoom, getRoom, joinRoom, toRoomSnapshot, startGame, leaveRoom } from "./roomStore.js";

describe("roomStore", () => {
  it("createRoom returns a room with a 4-character uppercase code", () => {
    const result = createRoom("Alice");

    expect(result.room.code).toMatch(/^[A-Z0-9]{4}$/);
    expect(result.room.participants).toHaveLength(1);
    expect(result.room.participants[0].name).toBe("Alice");
    expect(result.participantId).toBeDefined();
  });

  it("createRoom sets hostId to the creator participantId", () => {
    const result = createRoom("Alice");
    expect(result.room.hostId).toBe(result.participantId);
  });

  it("toRoomSnapshot sets isHost to true for host, false for guest", () => {
    const created = createRoom("Alice");
    const aliceId = created.participantId;
    const room = created.room;

    const aliceSnapshot = toRoomSnapshot(room, aliceId).participants[0];
    expect(aliceSnapshot.isHost).toBe(true);

    const joined = joinRoom(room.code, "Bob");
    expect(joined.success).toBe(true);
    const bobId = joined!.participantId;
    const updatedRoom = getRoom(room.code)!;

    const bobSnapshot = toRoomSnapshot(updatedRoom, bobId).participants.find(p => p.id === bobId);
    expect(bobSnapshot!.isHost).toBe(false);
  });

  it("createRoom trims the player name", () => {
    const result = createRoom("  Charlie  ");
    expect(result.room.participants[0].name).toBe("Charlie");
  });

  it("createRoom falls back to Player if name is empty or undefined", () => {
    const result = createRoom();
    expect(result.room.participants[0].name).toBe("Player");
  });

  it("joinRoom returns error for an unknown room code", () => {
    const result = joinRoom("ZZZZ", "Bob");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Room not found");
  });

  it("joinRoom adds a participant with a trimmed custom name to an existing room", () => {
    const created = createRoom("Alice");
    const result = joinRoom(created.room.code, "  Bob  ");

    expect(result.success).toBe(true);
    expect(result.room!.participants).toHaveLength(2);
    expect(result.room!.participants[1].name).toBe("Bob");
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

  it("roomStore isolates rooms and handles lowercase/untrimmed codes in joinRoom and getRoom", () => {
    const created = createRoom("Alice");
    const code = created.room.code;

    const result = joinRoom(" " + code.toLowerCase() + " ", "Bob");
    expect(result.success).toBe(true);
    expect(result.room!.participants).toHaveLength(2);

    const room = getRoom(code.toLowerCase())!;
    expect(room.participants).toHaveLength(2);
    expect(room.participants[1].name).toBe("Bob");
  });

  it("startGame changes room status to game if caller is host and player count >= 2", () => {
    const created = createRoom("Alice");
    const code = created.room.code;
    const hostId = created.participantId;

    // Try starting with 1 player (fails)
    const result1 = startGame(code, hostId);
    expect(result1.success).toBe(false);
    expect(result1.error).toBe("At least 2 players are required to start the game");

    // Add guest
    const joined = joinRoom(code, "Bob");
    expect(joined.success).toBe(true);
    const guestId = joined.participantId as string;

    // Try starting as guest (fails)
    const result2 = startGame(code, guestId);
    expect(result2.success).toBe(false);
    expect(result2.error).toBe("Only the host can start the game");

    // Start as host (succeeds)
    const result3 = startGame(code, hostId);
    expect(result3.success).toBe(true);

    const room = getRoom(code)!;
    expect(room.status).toBe("game");
  });

  it("leaveRoom removes guest, or deletes room if host leaves", () => {
    const created = createRoom("Alice");
    const code = created.room.code;
    const hostId = created.participantId;

    const joined = joinRoom(code, "Bob");
    expect(joined.success).toBe(true);
    const guestId = joined.participantId as string;

    // Guest leaves (removed, room still exists)
    const leaveGuestResult = leaveRoom(code, guestId);
    expect(leaveGuestResult.success).toBe(true);
    expect(getRoom(code)!.participants).toHaveLength(1);

    // Host leaves (room deleted)
    const leaveHostResult = leaveRoom(code, hostId);
    expect(leaveHostResult.success).toBe(true);
    expect(getRoom(code)).toBeNull();
  });
  it("joinRoom returns error when room is already in game", () => {
    const created = createRoom("Alice");
    const code = created.room.code;
    const hostId = created.participantId;

    // Add a guest
    const joined = joinRoom(code, "Bob");
    expect(joined.success).toBe(true);

    // Start the game
    const startResult = startGame(code, hostId);
    expect(startResult.success).toBe(true);

    // Try to join after game has started
    const joinAfterStart = joinRoom(code, "Charlie");
    expect(joinAfterStart.success).toBe(false);
    expect(joinAfterStart.error).toBe("Room is already in game");

    // Verify room still has only 2 participants
    const room = getRoom(code)!;
    expect(room.participants).toHaveLength(2);
  });
});
