import { describe, expect, it } from "vitest";
import { createRoomSchema, joinRoomSchema, roomCodeParamsSchema } from "./schemas.js";

describe("schemas", () => {
  it("createRoomSchema accepts a valid body with playerName and trims it", () => {
    const result = createRoomSchema.parse({ playerName: "  Alice   " });
    expect(result.playerName).toBe("Alice");
  });

  it("createRoomSchema rejects empty or whitespace-only playerName", () => {
    expect(() => createRoomSchema.parse({ playerName: "" })).toThrow();
    expect(() => createRoomSchema.parse({ playerName: "   " })).toThrow();
  });

  it("joinRoomSchema rejects empty or whitespace-only playerName", () => {
    expect(() => joinRoomSchema.parse({ playerName: "" })).toThrow();
    expect(() => joinRoomSchema.parse({ playerName: "   " })).toThrow();
  });

  it("roomCodeParamsSchema rejects missing code", () => {
    expect(() => roomCodeParamsSchema.parse({})).toThrow();
  });
});
