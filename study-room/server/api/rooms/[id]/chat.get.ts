import { getChatMessages } from '~/server/storage/rooms';

export default defineEventHandler((event) => {
  const roomId = getRouterParam(event, 'id');
  if (!roomId) {
    return {
      success: false,
      error: 'Room ID is required',
    };
  }
  
  const messages = getChatMessages(roomId);
  
  return {
    success: true,
    data: messages,
  };
});
