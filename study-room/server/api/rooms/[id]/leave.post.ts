import { getRoom, removeUserFromRoom } from '~/server/storage/rooms';

export default defineEventHandler(async (event) => {
  const roomId = getRouterParam(event, 'id');
  if (!roomId) {
    return {
      success: false,
      error: 'Room ID is required',
    };
  }
  
  const body = await readBody(event);
  const { userId } = body;
  
  if (!userId) {
    return {
      success: false,
      error: 'User ID is required',
    };
  }
  
  const success = removeUserFromRoom(roomId, userId);
  if (!success) {
    return {
      success: false,
      error: 'Failed to leave room',
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
