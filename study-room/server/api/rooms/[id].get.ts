import { getRoom } from '~/server/storage/rooms';

export default defineEventHandler((event) => {
  const roomId = getRouterParam(event, 'id');
  if (!roomId) {
    return {
      success: false,
      error: 'Room ID is required',
    };
  }
  
  const room = getRoom(roomId);
  if (!room) {
    return {
      success: false,
      error: 'Room not found',
    };
  }
  
  return {
    success: true,
    data: {
      id: room.id,
      name: room.name,
      description: room.description,
      maxUsers: room.maxUsers,
      onlineUsers: room.users.length,
      users: room.users,
      type: room.type,
    },
  };
});
