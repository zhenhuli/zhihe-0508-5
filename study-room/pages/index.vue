<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-4xl">
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
          线上自习室
        </h1>
        <p class="text-lg text-slate-600">
          与来自世界各地的学习者一起，专注学习，共同进步
        </p>
      </div>
      
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div v-if="!roomStore.currentUser" class="mb-8">
          <h2 class="text-2xl font-semibold text-slate-800 mb-4">
            欢迎来到自习室
          </h2>
          <p class="text-slate-600 mb-4">
            请输入你的昵称来开始学习之旅
          </p>
          <form @submit.prevent="handleSetName" class="flex gap-3">
            <input
              v-model="userName"
              type="text"
              placeholder="请输入昵称..."
              class="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              开始
            </button>
          </form>
        </div>
        
        <div v-else>
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-semibold text-slate-800">
              选择自习室
            </h2>
            <div class="flex items-center gap-3">
              <span class="text-slate-600">欢迎，{{ roomStore.currentUser.name }}</span>
              <button
                @click="roomStore.clearUser"
                class="text-sm text-slate-500 hover:text-slate-700"
              >
                退出
              </button>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="room in roomStore.rooms"
              :key="room.id"
              class="border border-slate-200 rounded-xl p-6 hover:border-primary-400 hover:shadow-md transition-all cursor-pointer"
              @click="handleJoinRoom(room.id)"
            >
              <div class="flex items-start justify-between mb-4">
                <h3 class="text-lg font-semibold text-slate-800">
                  {{ room.name }}
                </h3>
                <div class="flex items-center gap-1 text-sm">
                  <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span class="text-slate-600">
                    {{ room.onlineUsers }}/{{ room.maxUsers }}
                  </span>
                </div>
              </div>
              <p class="text-slate-600 text-sm mb-4">
                {{ room.description }}
              </p>
              <div class="flex items-center justify-between">
                <div class="flex -space-x-2">
                  <div
                    v-for="i in Math.min(room.onlineUsers, 5)"
                    :key="i"
                    class="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 border-2 border-white"
                  ></div>
                </div>
                <span class="text-primary-600 font-medium text-sm">
                  进入 →
                </span>
              </div>
            </div>
          </div>
          
          <div v-if="roomStore.rankings.length > 0" class="mt-8">
            <h3 class="text-xl font-semibold text-slate-800 mb-4">
              专注时长排行榜
            </h3>
            <div class="border border-slate-200 rounded-xl overflow-hidden">
              <table class="w-full">
                <thead class="bg-slate-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-sm font-medium text-slate-600">排名</th>
                    <th class="px-6 py-3 text-left text-sm font-medium text-slate-600">用户</th>
                    <th class="px-6 py-3 text-left text-sm font-medium text-slate-600">专注时长</th>
                    <th class="px-6 py-3 text-left text-sm font-medium text-slate-600">次数</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200">
                  <tr
                    v-for="(ranking, index) in roomStore.rankings.slice(0, 5)"
                    :key="ranking.userId"
                    class="hover:bg-slate-50"
                  >
                    <td class="px-6 py-4">
                      <span
                        v-if="index === 0"
                        class="text-yellow-500 font-bold text-lg"
                      >🏆</span>
                      <span
                        v-else-if="index === 1"
                        class="text-slate-400 font-bold text-lg"
                      >🥈</span>
                      <span
                        v-else-if="index === 2"
                        class="text-amber-600 font-bold text-lg"
                      >🥉</span>
                      <span v-else class="text-slate-600">{{ index + 1 }}</span>
                    </td>
                    <td class="px-6 py-4 text-slate-800">{{ ranking.userName }}</td>
                    <td class="px-6 py-4 text-slate-800">{{ ranking.totalMinutes }} 分钟</td>
                    <td class="px-6 py-4 text-slate-600">{{ ranking.sessions }} 次</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const roomStore = useRoomStore();
const userName = ref('');

const handleSetName = () => {
  if (userName.value.trim()) {
    roomStore.setUser(userName.value.trim());
  }
};

const handleJoinRoom = async (roomId: string) => {
  const success = await roomStore.joinRoom(roomId);
  if (success) {
    router.push(`/room/${roomId}`);
  }
};

onMounted(() => {
  roomStore.loadUserFromStorage();
  roomStore.fetchRooms();
  roomStore.fetchRankings();
});
</script>
