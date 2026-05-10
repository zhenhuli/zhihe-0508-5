import type { ChatMessage, Room, RoomUser, StudySession, UserRanking } from '~/types';

interface RoomData {
  [key: string]: Room;
}

interface StudyData {
  sessions: StudySession[];
}

interface ChatData {
  [roomId: string]: ChatMessage[];
}

let rooms: RoomData = {
  'quiet-room': {
    id: 'quiet-room',
    name: '安静自习室',
    description: '适合需要高度集中的任务，保持安静，专注学习',
    maxUsers: 100,
    users: [],
    type: 'quiet',
  },
  'discussion-room': {
    id: 'discussion-room',
    name: '讨论自习室',
    description: '可以自由交流，适合组队学习和讨论',
    maxUsers: 100,
    users: [],
    type: 'discussion',
  },
};

let studyData: StudyData = {
  sessions: [],
};

let chatData: ChatData = {
  'quiet-room': [],
  'discussion-room': [],
};

export const getRooms = (): Room[] => Object.values(rooms);

export const getRoom = (roomId: string): Room | null => {
  return rooms[roomId] || null;
};

export const addUserToRoom = (roomId: string, user: RoomUser): boolean => {
  const room = rooms[roomId];
  if (!room) return false;
  if (room.users.length >= room.maxUsers) return false;
  
  const existingUserIndex = room.users.findIndex(u => u.id === user.id);
  if (existingUserIndex !== -1) {
    room.users[existingUserIndex] = user;
  } else {
    room.users.push(user);
  }
  return true;
};

export const removeUserFromRoom = (roomId: string, userId: string): boolean => {
  const room = rooms[roomId];
  if (!room) return false;
  
  const index = room.users.findIndex(u => u.id === userId);
  if (index !== -1) {
    room.users.splice(index, 1);
    return true;
  }
  return false;
};

export const updateUserStudyStatus = (
  roomId: string,
  userId: string,
  isStudying: boolean,
  studyStartTime: number | null
): boolean => {
  const room = rooms[roomId];
  if (!room) return false;
  
  const user = room.users.find(u => u.id === userId);
  if (!user) return false;
  
  user.isStudying = isStudying;
  user.studyStartTime = studyStartTime;
  return true;
};

export const addStudySession = (session: StudySession): void => {
  studyData.sessions.push(session);
};

export const getStudySessions = (): StudySession[] => {
  return [...studyData.sessions];
};

export const getUserRanking = (): UserRanking[] => {
  const userStats = new Map<string, UserRanking>();
  
  studyData.sessions.forEach(session => {
    const existing = userStats.get(session.userId);
    if (existing) {
      existing.totalMinutes += session.duration;
      existing.sessions += 1;
    } else {
      userStats.set(session.userId, {
        userId: session.userId,
        userName: session.userName,
        totalMinutes: session.duration,
        sessions: 1,
      });
    }
  });
  
  return Array.from(userStats.values()).sort((a, b) => b.totalMinutes - a.totalMinutes);
};

export const getChatMessages = (roomId: string): ChatMessage[] => {
  return chatData[roomId] ? [...chatData[roomId]] : [];
};

export const addChatMessage = (
  roomId: string,
  message: ChatMessage
): boolean => {
  if (!chatData[roomId]) {
    chatData[roomId] = [];
  }
  
  chatData[roomId].push(message);
  
  if (chatData[roomId].length > 100) {
    chatData[roomId] = chatData[roomId].slice(-100);
  }
  
  return true;
};
