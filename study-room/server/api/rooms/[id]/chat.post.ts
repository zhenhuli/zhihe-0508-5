import { addChatMessage, getChatMessages } from '~/server/storage/rooms';
import type { ChatMessage } from '~/types';

export default defineEventHandler(async (event) => {
  const roomId = getRouterParam(event, 'id');
  if (!roomId) {
    return {
      success: false,
      error: 'Room ID is required',
    };
  }
  
  const body = await readBody(event);
  const { userId, userName, content } = body;
  
  if (!userId || !userName || !content) {
    return {
      success: false,
      error: 'User ID, name, and content are required',
    };
  }
  
  if (!content.trim()) {
    return {
      success: false,
      error: 'Message content cannot be empty',
    };
  }
  
  const message: ChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    userName,
    content: content.trim(),
    timestamp: Date.now(),
  };
  
  addChatMessage(roomId, message);
  
  const messages = getChatMessages(roomId);
  
  return {
    success: true,
    data: messages,
  };
});
