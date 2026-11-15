export type ParticipantRole = "drawer" | "guesser";
export type RoomStatus = "lobby";

export interface Participant {
  id: string;
  name: string;
  role: ParticipantRole;
  joinedAt: string;
}

export interface Room {
  code: string;
  status: RoomStatus;
  participants: Participant[];
  createdAt: string;
  updatedAt: string;
}

export interface RoomSnapshot {
  code: string;
  status: RoomStatus;
  participants: Participant[];
  roles: ParticipantRole[];
  currentWord?: string;
}

export interface RoomSessionResponse {
  participantId: string;
  room: RoomSnapshot;
}
