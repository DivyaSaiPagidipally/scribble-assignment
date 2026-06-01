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

  it("createRoomSchema and joinRoomSchema reject playerName longer than 32 characters", () => {
    const longName = "a".repeat(33);
    expect(() => createRoomSchema.parse({ playerName: longName })).toThrow();
    expect(() => joinRoomSchema.parse({ playerName: longName })).toThrow();
  });

  it("roomCodeParamsSchema rejects invalid characters, lowercase, or incorrect lengths", () => {
    expect(roomCodeParamsSchema.parse({ code: "abcd" })).toEqual({ code: "ABCD" }); // auto-uppercase
    expect(roomCodeParamsSchema.parse({ code: "A1B2" })).toEqual({ code: "A1B2" });
    expect(() => roomCodeParamsSchema.parse({ code: "ABC" })).toThrow();
    expect(() => roomCodeParamsSchema.parse({ code: "ABCDE" })).toThrow();
    expect(() => roomCodeParamsSchema.parse({ code: "AB-C" })).toThrow();
  });
});
