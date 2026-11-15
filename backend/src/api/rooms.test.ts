import { once } from "node:events";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createApp } from "../app.js";
import type { Server } from "node:http";
import type { ParticipantRole } from "../models/game.js";
import { createRoom, saveRoom } from "../services/roomStore.js";

let server: Server;
let baseUrl: string;

beforeAll(async () => {
  server = createApp().listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Missing server address");
  baseUrl = `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

describe("room API roles", () => {
  it("includes assigned roles in create, join and refreshed snapshots", async () => {
    const post = (path: string, playerName: string) => fetch(`${baseUrl}${path}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ playerName })
    });
    const createdResponse = await post("/rooms", "Alice");
    expect(createdResponse.status).toBe(201);
    const created = await createdResponse.json();
    expect(created.room.participants).toEqual([expect.objectContaining({ name: "Alice", role: "drawer" })]);
    const joinedResponse = await post(`/rooms/${created.room.code}/join`, "Bob");
    expect(joinedResponse.status).toBe(200);
    const joined = await joinedResponse.json();
    expect(joined.room.participants).toEqual([
      expect.objectContaining({ name: "Alice", role: "drawer" }),
      expect.objectContaining({ name: "Bob", role: "guesser" })
    ]);
    const refreshedResponse = await fetch(`${baseUrl}/rooms/${created.room.code}`);
    expect(refreshedResponse.status).toBe(200);
    const refreshed = await refreshedResponse.json();
    expect(refreshed.room.participants).toEqual(joined.room.participants);
  });

  it("returns the current word to the drawer on create and refresh", async () => {
    const response = await fetch(`${baseUrl}/rooms`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ playerName: "Alice" })
    });
    const created = await response.json();
    expect(created.room.currentWord).toBeTruthy();
    const refreshed = await (await fetch(`${baseUrl}/rooms/${created.room.code}?participantId=${created.participantId}`)).json();
    expect(refreshed.room.currentWord).toBe(created.room.currentWord);
  });

  it("omits the word and word list from guesser, anonymous and unknown viewer responses", async () => {
    const post = (path: string) => fetch(`${baseUrl}${path}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ playerName: "Player" })
    });
    const created = await (await post("/rooms")).json();
    const joined = await (await post(`/rooms/${created.room.code}/join`)).json();
    const paths = [
      `/rooms/${created.room.code}?participantId=${joined.participantId}`,
      `/rooms/${created.room.code}`,
      `/rooms/${created.room.code}?participantId=unknown`
    ];
    expect(joined.room).not.toHaveProperty("currentWord");
    expect(joined.room).not.toHaveProperty("availableWords");
    for (const path of paths) {
      const { room } = await (await fetch(`${baseUrl}${path}`)).json();
      expect(room).not.toHaveProperty("currentWord");
      expect(room).not.toHaveProperty("availableWords");
    }
  });

  it("reports invalid stored response data as a server error", async () => {
    const { room } = createRoom("Alice");
    saveRoom({ ...room, participants: [{ ...room.participants[0], role: "invalid" as ParticipantRole }] });
    const response = await fetch(`${baseUrl}/rooms/${room.code}`);
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ message: "Invalid room response" });
  });
});
