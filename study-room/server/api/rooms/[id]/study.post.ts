import { addStudySession, getRoom, updateUserStudyStatus } from '~/server/storage/rooms';
import type { StudySession } from '~/types';

export default defineEventHandler(async (event) => {
  const roomId = getRouterParam(event, 'id');
  if (!roomId) {
    return {
      success: false,
      error: 'Room ID is required',
    };
  }
  
  const body = await readBody(event);
  const { userId, action } = body;
  
  if (!userId || !action) {
    return {
      success: false,
      error: 'User ID and action are required',
    };
  }
  
  const room = getRoom(roomId);
  if (!room) {
    return {
      success: false,
      error: 'Room not found',
    };
  }
  
  const user = room.users.find(u => u.id === userId);
  if (!user) {
    return {
      success: false,
      error: 'User not found in room',
    };
  }
  
  if (action === 'start') {
    const success = updateUserStudyStatus(roomId, userId, true, Date.now());
    if (!success) {
      return {
        success: false,
        error: 'Failed to start study',
      };
    }
  } else if (action === 'stop') {
    const studyStartTime = user.studyStartTime;
    if (studyStartTime) {
      const endTime = Date.now();
      const duration = Math.round((endTime - studyStartTime) / 60000);
      
      const session: StudySession = {
        id: `session_${Date.now()}_${userId}`,
        userId,
        userName: user.name,
        startTime: studyStartTime,
        endTime,
        duration: duration > 0 ? duration : 1,
        roomId,
      };
      
      addStudySession(session);
    }
    
    const success = updateUserStudyStatus(roomId, userId, false, null);
    if (!success) {
      return {
        success: false,
        error: 'Failed to stop study',
      };
    }
  } else {
    return {
      success: false,
      error: 'Invalid action',
    };
  }
  
  const updatedRoom = getRoom(roomId);
  return {
    success: true,
    data: {
      id: updatedRoom!.id,
      name: updatedRoom!.name,
      description: updatedRoom!.description,
      maxUsers: updatedRoom!.maxUsers,
      onlineUsers: updatedRoom!.users.length,
      users: updatedRoom!.users,
      type: updatedRoom!.type,
    },
  };
});
