import { defineStore } from 'pinia';
import type { ChatMessage, Room, RoomUser, UserRanking, RoomType } from '~/types';

interface RoomState {
  currentUser: {
    id: string;
    name: string;
  } | null;
  currentRoom: Room | null;
  rooms: Array<{
    id: string;
    name: string;
    description: string;
    maxUsers: number;
    onlineUsers: number;
    type: RoomType;
  }>;
  rankings: UserRanking[];
  chatMessages: ChatMessage[];
  pollInterval: ReturnType<typeof setInterval> | null;
}

export const useRoomStore = defineStore('room', {
  state: (): RoomState => ({
    currentUser: null,
    currentRoom: null,
    rooms: [],
    rankings: [],
    chatMessages: [],
    pollInterval: null,
  }),
  
  getters: {
    isInRoom: (state) => state.currentRoom !== null,
    isQuietRoom: (state) => state.currentRoom?.type === 'quiet',
    isDiscussionRoom: (state) => state.currentRoom?.type === 'discussion',
    isStudying: (state) => {
      if (!state.currentUser || !state.currentRoom) return false;
      const user = state.currentRoom.users.find(u => u.id === state.currentUser!.id);
      return user?.isStudying || false;
    },
    onlineUsers: (state) => {
      if (!state.currentRoom) return 0;
      return state.currentRoom.users.length;
    },
    studyingUsers: (state) => {
      if (!state.currentRoom) return [];
      return state.currentRoom.users.filter(u => u.isStudying);
    },
  },
  
  actions: {
    setUser(name: string) {
      const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.currentUser = { id, name };
      localStorage.setItem('studyRoomUser', JSON.stringify(this.currentUser));
    },
    
    loadUserFromStorage() {
      const stored = localStorage.getItem('studyRoomUser');
      if (stored) {
        try {
          this.currentUser = JSON.parse(stored);
        } catch {
          this.currentUser = null;
        }
      }
    },
    
    clearUser() {
      this.currentUser = null;
      localStorage.removeItem('studyRoomUser');
    },
    
    async fetchRooms() {
      const { data } = await $fetch('/api/rooms');
      if (data) {
        this.rooms = data;
      }
    },
    
    async fetchRoomDetails(roomId: string) {
      const { data } = await $fetch(`/api/rooms/${roomId}`);
      if (data) {
        this.currentRoom = data as Room;
      }
    },
    
    async joinRoom(roomId: string) {
      if (!this.currentUser) return false;
      
      const { success, data, error } = await $fetch(`/api/rooms/${roomId}/join`, {
        method: 'POST',
        body: {
          userId: this.currentUser.id,
          userName: this.currentUser.name,
        },
      });
      
      if (success && data) {
        this.currentRoom = data as Room;
        this.startPolling();
        return true;
      }
      
      console.error('Failed to join room:', error);
      return false;
    },
    
    async leaveRoom() {
      if (!this.currentUser || !this.currentRoom) return;
      
      this.stopPolling();
      
      await $fetch(`/api/rooms/${this.currentRoom.id}/leave`, {
        method: 'POST',
        body: {
          userId: this.currentUser.id,
        },
      });
      
      this.currentRoom = null;
    },
    
    async startStudy() {
      if (!this.currentUser || !this.currentRoom) return false;
      
      const { success, data } = await $fetch(`/api/rooms/${this.currentRoom.id}/study`, {
        method: 'POST',
        body: {
          userId: this.currentUser.id,
          action: 'start',
        },
      });
      
      if (success && data) {
        this.currentRoom = data as Room;
        return true;
      }
      
      return false;
    },
    
    async stopStudy() {
      if (!this.currentUser || !this.currentRoom) return false;
      
      const { success, data } = await $fetch(`/api/rooms/${this.currentRoom.id}/study`, {
        method: 'POST',
        body: {
          userId: this.currentUser.id,
          action: 'stop',
        },
      });
      
      if (success && data) {
        this.currentRoom = data as Room;
        return true;
      }
      
      return false;
    },
    
    async fetchRankings() {
      const { data } = await $fetch('/api/ranking');
      if (data) {
        this.rankings = data as UserRanking[];
      }
    },
    
    async fetchChatMessages() {
      if (!this.currentRoom) return;
      
      const { data } = await $fetch(`/api/rooms/${this.currentRoom.id}/chat`);
      if (data) {
        this.chatMessages = data as ChatMessage[];
      }
    },
    
    async sendChatMessage(content: string) {
      if (!this.currentUser || !this.currentRoom) return false;
      
      const { success, data } = await $fetch(`/api/rooms/${this.currentRoom.id}/chat`, {
        method: 'POST',
        body: {
          userId: this.currentUser.id,
          userName: this.currentUser.name,
          content,
        },
      });
      
      if (success && data) {
        this.chatMessages = data as ChatMessage[];
        return true;
      }
      
      return false;
    },
    
    startPolling() {
      if (this.pollInterval) return;
      
      this.pollInterval = setInterval(async () => {
        if (this.currentRoom) {
          await this.fetchRoomDetails(this.currentRoom.id);
          if (this.currentRoom.type === 'discussion') {
            await this.fetchChatMessages();
          }
        }
        await this.fetchRankings();
      }, 3000);
    },
    
    stopPolling() {
      if (this.pollInterval) {
        clearInterval(this.pollInterval);
        this.pollInterval = null;
      }
    },
  },
});
