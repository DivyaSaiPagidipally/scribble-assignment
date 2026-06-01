import { randomUUID } from "node:crypto";
import type { Participant, Room, RoomSnapshot } from "../models/game.js";
import { STARTER_ROLES, STARTER_WORDS } from "../seed/starterData.js";

const rooms = new Map<string, Room>();

function now() {
  return new Date().toISOString();
}

function generateCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  for (let index = 0; index < 4; index += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return code;
}

function generateUniqueCode() {
  let code = generateCode();

  while (rooms.has(code)) {
    code = generateCode();
  }

  return code;
}

function displayName(name?: string) {
  return name ? name.trim() : "Player";
}

function createParticipant(name?: string): Participant {
  return {
    id: randomUUID(),
    name: displayName(name),
    joinedAt: now()
  };
}

function cloneRoom(room: Room) {
  return structuredClone(room);
}

export function listWords() {
  return [...STARTER_WORDS];
}

export function createRoom(playerName?: string) {
  const participant = createParticipant(playerName);
  const room: Room = {
    code: generateUniqueCode(),
    status: "lobby",
    participants: [participant],
    hostId: participant.id,
    createdAt: now(),
    updatedAt: now()
  };

  rooms.set(room.code, room);

  return {
    room: cloneRoom(room),
    participantId: participant.id
  };
}

export function joinRoom(code: string, playerName?: string) {
  const room = rooms.get(code.trim().toUpperCase());

  if (!room) {
    return null;
  }

  const participant = createParticipant(playerName);
  room.participants.push(participant);
  room.updatedAt = now();
  rooms.set(room.code, room);

  return {
    room: cloneRoom(room),
    participantId: participant.id
  };
}

export function getRoom(code: string) {
  const room = rooms.get(code.trim().toUpperCase());
  return room ? cloneRoom(room) : null;
}

export function saveRoom(room: Room) {
  room.updatedAt = now();
  rooms.set(room.code, cloneRoom(room));
  return getRoom(room.code);
}

export function startGame(code: string, participantId: string): { success: boolean; error?: string } {
  const room = rooms.get(code.trim().toUpperCase());
  if (!room) {
    return { success: false, error: "Room not found" };
  }
  if (room.hostId !== participantId) {
    return { success: false, error: "Only the host can start the game" };
  }
  if (room.participants.length < 2) {
    return { success: false, error: "At least 2 players are required to start the game" };
  }
  room.status = "game";
  room.updatedAt = now();
  rooms.set(room.code, room);
  return { success: true };
}

export function leaveRoom(code: string, participantId: string): { success: boolean; error?: string } {
  const room = rooms.get(code.trim().toUpperCase());
  if (!room) {
    return { success: false, error: "Room not found" };
  }

  if (room.hostId === participantId) {
    rooms.delete(room.code);
    return { success: true };
  }

  const index = room.participants.findIndex((p) => p.id === participantId);
  if (index !== -1) {
    room.participants.splice(index, 1);
    room.updatedAt = now();
    rooms.set(room.code, room);
    return { success: true };
  }

  return { success: false, error: "Participant not found" };
}

export function toRoomSnapshot(room: Room, viewerParticipantId?: string): RoomSnapshot {
  void viewerParticipantId;

  return {
    code: room.code,
    status: room.status,
    participants: room.participants.map((participant) => ({
      ...participant,
      isHost: participant.id === room.hostId
    })),
    availableWords: listWords(),
    roles: [...STARTER_ROLES]
  };
}
