<template>
  <div class="min-h-screen p-4">
    <div class="max-w-7xl mx-auto">
      <header class="flex justify-between items-center mb-8">
        <div class="flex items-center gap-4">
          <button
            @click="handleLeave"
            class="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>返回</span>
          </button>
          <div>
            <h1 class="text-3xl font-bold text-slate-800">
              {{ roomStore.currentRoom?.name || '自习室' }}
            </h1>
            <p class="text-slate-600">
              {{ roomStore.currentRoom?.description }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
            <span class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <span class="font-medium text-slate-700">
              {{ roomStore.onlineUsers }} 人在线
            </span>
          </div>
          <div class="bg-white px-4 py-2 rounded-lg shadow">
            <span class="text-slate-600">{{ roomStore.currentUser?.name }}</span>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <template v-if="roomStore.isQuietRoom">
            <div class="bg-white rounded-2xl shadow-xl p-8">
              <div class="text-center">
                <div class="mb-6">
                  <h2 class="text-2xl font-semibold text-slate-800 mb-2">
                    {{ roomStore.isStudying ? '专注中...' : '准备开始' }}
                  </h2>
                  <p class="text-slate-600">
                    {{ roomStore.isStudying ? '保持专注，加油！' : '点击开始按钮，开始你的专注之旅' }}
                  </p>
                </div>
                
                <div class="mb-8">
                  <div class="text-7xl font-bold text-slate-800 font-mono mb-2">
                    {{ formattedTime }}
                  </div>
                  <div v-if="roomStore.isStudying" class="flex items-center justify-center gap-2 text-green-600">
                    <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span class="text-sm font-medium">正在专注中</span>
                  </div>
                </div>
                
                <button
                  @click="toggleStudy"
                  :class="[
                    'px-12 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105',
                    roomStore.isStudying
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white'
                  ]"
                >
                  {{ roomStore.isStudying ? '结束专注' : '开始专注' }}
                </button>
              </div>
            </div>
            
            <div class="bg-white rounded-2xl shadow-xl p-6">
              <h3 class="text-xl font-semibold text-slate-800 mb-4">
                在线成员 ({{ roomStore.currentRoom?.users.length || 0 }})
              </h3>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div
                  v-for="user in roomStore.currentRoom?.users"
                  :key="user.id"
                  class="flex items-center gap-3 p-4 rounded-xl border border-slate-200"
                  :class="{
                    'border-green-400 bg-green-50': user.isStudying,
                    'bg-slate-50': !user.isStudying
                  }"
                >
                  <div class="relative">
                    <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-semibold">
                      {{ user.name.charAt(0).toUpperCase() }}
                    </div>
                    <span
                      v-if="user.isStudying"
                      class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
                    ></span>
                  </div>
                  <div>
                    <div class="font-medium text-slate-800">
                      {{ user.name }}
                    </div>
                    <div class="text-sm" :class="user.isStudying ? 'text-green-600' : 'text-slate-500'">
                      {{ user.isStudying ? '专注中' : '在线' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          
          <template v-else>
            <div class="bg-white rounded-2xl shadow-xl flex flex-col h-[600px]">
              <div class="p-4 border-b border-slate-200">
                <h3 class="text-xl font-semibold text-slate-800">
                  聊天室
                </h3>
                <p class="text-sm text-slate-500">
                  与大家一起交流讨论
                </p>
              </div>
              
              <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
                <div v-if="roomStore.chatMessages.length === 0" class="flex items-center justify-center h-full">
                  <p class="text-slate-500">暂无消息，开始发送第一条消息吧！</p>
                </div>
                <div
                  v-for="message in roomStore.chatMessages"
                  :key="message.id"
                  class="flex gap-3"
                  :class="message.userId === roomStore.currentUser?.id ? 'flex-row-reverse' : ''"
                >
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {{ message.userName.charAt(0).toUpperCase() }}
                  </div>
                  <div
                    class="max-w-[70%]"
                    :class="message.userId === roomStore.currentUser?.id ? 'text-right' : ''"
                  >
                    <div class="flex items-center gap-2 mb-1" :class="message.userId === roomStore.currentUser?.id ? 'flex-row-reverse' : ''">
                      <span class="text-sm font-medium text-slate-700">
                        {{ message.userName }}
                      </span>
                      <span class="text-xs text-slate-400">
                        {{ formatTime(message.timestamp) }}
                      </span>
                    </div>
                    <div
                      class="inline-block px-4 py-2 rounded-2xl"
                      :class="message.userId === roomStore.currentUser?.id ? 'bg-primary-500 text-white rounded-tr-sm' : 'bg-slate-100 text-slate-800 rounded-tl-sm'"
                    >
                      {{ message.content }}
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="p-4 border-t border-slate-200">
                <form @submit.prevent="handleSendMessage" class="flex gap-3">
                  <input
                    v-model="newMessage"
                    type="text"
                    placeholder="输入消息..."
                    class="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    发送
                  </button>
                </form>
              </div>
            </div>
          </template>
        </div>

        <div class="space-y-6">
          <div class="bg-white rounded-2xl shadow-xl p-6">
            <h3 class="text-xl font-semibold text-slate-800 mb-4">
              专注排行榜
            </h3>
            <div v-if="roomStore.rankings.length > 0" class="space-y-3">
              <div
                v-for="(ranking, index) in roomStore.rankings.slice(0, 10)"
                :key="ranking.userId"
                class="flex items-center gap-3 p-3 rounded-lg"
                :class="{
                  'bg-yellow-50': index === 0,
                  'bg-slate-50': index > 0
                }"
              >
                <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                     :class="getRankingBg(index)">
                  {{ index + 1 }}
                </div>
                <div class="flex-1">
                  <div class="font-medium text-slate-800">
                    {{ ranking.userName }}
                  </div>
                  <div class="text-xs text-slate-500">
                    {{ ranking.sessions }} 次专注
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-semibold text-slate-800">
                    {{ ranking.totalMinutes }}
                  </div>
                  <div class="text-xs text-slate-500">分钟</div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-slate-500">
              暂无专注记录
            </div>
          </div>
          
          <div class="bg-white rounded-2xl shadow-xl p-6">
            <h3 class="text-xl font-semibold text-slate-800 mb-4">
              在线成员
            </h3>
            <div v-if="roomStore.currentRoom?.users" class="space-y-3 max-h-80 overflow-y-auto">
              <div
                v-for="user in roomStore.currentRoom.users"
                :key="user.id"
                class="flex items-center gap-3 p-3 rounded-lg bg-slate-50"
              >
                <div class="relative">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-semibold">
                    {{ user.name.charAt(0).toUpperCase() }}
                  </div>
                  <span
                    v-if="user.isStudying"
                    class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                  ></span>
                </div>
                <div class="flex-1">
                  <div class="font-medium text-slate-800">
                    {{ user.name }}
                  </div>
                  <div class="text-xs" :class="user.isStudying ? 'text-green-600' : 'text-slate-500'">
                    {{ user.isStudying ? '专注中' : '在线' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const roomStore = useRoomStore();

const chatContainer = ref<HTMLElement | null>(null);
const newMessage = ref('');

const currentTime = ref(0);
let timerInterval: ReturnType<typeof setInterval> | null = null;

const formattedTime = computed(() => {
  const hours = Math.floor(currentTime.value / 3600);
  const minutes = Math.floor((currentTime.value % 3600) / 60);
  const seconds = currentTime.value % 60;
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ].join(':');
});

const getRankingBg = (index: number) => {
  if (index === 0) return 'bg-yellow-400 text-white';
  if (index === 1) return 'bg-slate-300 text-slate-800';
  if (index === 2) return 'bg-amber-600 text-white';
  return 'bg-slate-100 text-slate-600';
};

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
};

const startTimer = () => {
  if (timerInterval) return;
  
  const currentUser = roomStore.currentRoom?.users.find(u => u.id === roomStore.currentUser?.id);
  if (currentUser?.studyStartTime) {
    currentTime.value = Math.floor((Date.now() - currentUser.studyStartTime) / 1000);
  } else {
    currentTime.value = 0;
  }
  
  timerInterval = setInterval(() => {
    currentTime.value++;
  }, 1000);
};

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  currentTime.value = 0;
};

const toggleStudy = async () => {
  if (roomStore.isStudying) {
    await roomStore.stopStudy();
    stopTimer();
  } else {
    await roomStore.startStudy();
    startTimer();
  }
};

const handleSendMessage = async () => {
  if (!newMessage.value.trim()) return;
  
  const success = await roomStore.sendChatMessage(newMessage.value.trim());
  if (success) {
    newMessage.value = '';
    scrollToBottom();
  }
};

const handleLeave = async () => {
  if (roomStore.isStudying) {
    await roomStore.stopStudy();
  }
  stopTimer();
  await roomStore.leaveRoom();
  router.push('/');
};

watch(() => roomStore.isStudying, (isStudying) => {
  if (isStudying) {
    startTimer();
  } else {
    stopTimer();
  }
});

watch(() => roomStore.chatMessages, () => {
  scrollToBottom();
}, { deep: true });

onMounted(async () => {
  const roomId = route.params.id as string;
  
  roomStore.loadUserFromStorage();
  
  if (!roomStore.currentUser) {
    router.push('/');
    return;
  }
  
  if (!roomStore.currentRoom || roomStore.currentRoom.id !== roomId) {
    const success = await roomStore.joinRoom(roomId);
    if (!success) {
      router.push('/');
      return;
    }
  }
  
  await roomStore.fetchRankings();
  
  if (roomStore.isDiscussionRoom) {
    await roomStore.fetchChatMessages();
    scrollToBottom();
  }
});

onUnmounted(() => {
  stopTimer();
});
</script>
