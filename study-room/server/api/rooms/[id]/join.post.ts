import { addUserToRoom, getRoom } from '~/server/storage/rooms';
import type { RoomUser } from '~/types';

export default defineEventHandler(async (event) => {
  const roomId = getRouterParam(event, 'id');
  if (!roomId) {
    return {
      success: false,
      error: 'Room ID is required',
    };
  }
  
  const body = await readBody(event);
  const { userId, userName } = body;
  
  if (!userId || !userName) {
    return {
      success: false,
      error: 'User ID and name are required',
    };
  }
  
  const roomUser: RoomUser = {
    id: userId,
    name: userName,
    isStudying: false,
    studyStartTime: null,
    joinedAt: Date.now(),
  };
  
  const success = addUserToRoom(roomId, roomUser);
  if (!success) {
    return {
      success: false,
      error: 'Failed to join room',
    };
  }
  
  const room = getRoom(roomId);
  return {
    success: true,
    data: {
      id: room!.id,
      name: room!.name,
      description: room!.description,
      maxUsers: room!.maxUsers,
      onlineUsers: room!.users.length,
      users: room!.users,
      type: room!.type,
    },
  };
});
