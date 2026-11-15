import { z } from "zod";

export const createRoomSchema = z.object({
  playerName: z.string().optional()
});

export const joinRoomSchema = z.object({
  playerName: z.string().optional()
});

export const roomCodeParamsSchema = z.object({
  code: z.string()
});

export const roomViewerQuerySchema = z.object({
  participantId: z.string().optional()
});

export const roomSnapshotSchema = z.object({
  code: z.string(),
  status: z.literal("lobby"),
  participants: z.array(z.object({
    id: z.string(),
    name: z.string(),
    role: z.enum(["drawer", "guesser"]),
    joinedAt: z.string()
  })),
  availableWords: z.array(z.string()),
  roles: z.array(z.enum(["drawer", "guesser"]))
});

export const roomSessionResponseSchema = z.object({
  participantId: z.string(),
  room: roomSnapshotSchema
});

export const roomResponseSchema = z.object({ room: roomSnapshotSchema });

export function validateResponse<T>(schema: z.ZodType<T>, value: unknown): T {
  const result = schema.safeParse(value);
  if (!result.success) throw new Error("Invalid room response");
  return result.data;
}

export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}
