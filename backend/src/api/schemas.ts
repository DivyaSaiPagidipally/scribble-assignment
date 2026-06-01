import { z } from "zod";

export const createRoomSchema = z.object({
  playerName: z.string().trim().min(1, { message: "Name is required" })
});

export const joinRoomSchema = z.object({
  playerName: z.string().trim().min(1, { message: "Name is required" })
});

export const roomCodeParamsSchema = z.object({
  code: z.string().trim().length(4, { message: "Room code must be exactly 4 characters" })
});

export const roomViewerQuerySchema = z.object({
  participantId: z.string().optional()
});

export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}
