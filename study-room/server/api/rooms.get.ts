import { getRooms } from '~/server/storage/rooms';

export default defineEventHandler(() => {
  const rooms = getRooms().map(room => ({
    id: room.id,
    name: room.name,
    description: room.description,
    maxUsers: room.maxUsers,
    onlineUsers: room.users.length,
    type: room.type,
  }));
  
  return {
    success: true,
    data: rooms,
  };
});
