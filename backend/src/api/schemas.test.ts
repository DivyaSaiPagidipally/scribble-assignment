import { describe, expect, it } from "vitest";
import { createRoomSchema, roomCodeParamsSchema, roomResponseSchema, validateResponse } from "./schemas.js";

describe("schemas", () => {
  it("createRoomSchema accepts a valid body with playerName", () => {
    const result = createRoomSchema.parse({ playerName: "Alice" });

    expect(result.playerName).toBe("Alice");
  });

  it("rejects a room response with a missing or invalid participant role", () => {
    const room = { code: "ABCD", status: "lobby", roles: [], participants: [{ id: "1", name: "Alice", joinedAt: "today" }] };
    expect(() => validateResponse(roomResponseSchema, { room })).toThrow("Invalid room response");
    expect(() => validateResponse(roomResponseSchema, { room: { ...room, participants: [{ ...room.participants[0], role: "host" }] } })).toThrow("Invalid room response");
  });

  it("roomCodeParamsSchema rejects missing code", () => {
    expect(() => roomCodeParamsSchema.parse({})).toThrow();
  });
});
