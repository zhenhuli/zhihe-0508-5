export type RoomType = 'quiet' | 'discussion';

export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface RoomUser extends User {
  isStudying: boolean;
  studyStartTime: number | null;
  joinedAt: number;
}

export interface StudySession {
  id: string;
  userId: string;
  userName: string;
  startTime: number;
  endTime: number | null;
  duration: number;
  roomId: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: number;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  maxUsers: number;
  users: RoomUser[];
  type: RoomType;
}

export interface UserRanking {
  userId: string;
  userName: string;
  totalMinutes: number;
  sessions: number;
}
