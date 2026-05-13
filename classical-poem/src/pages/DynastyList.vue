<template>
  <div class="dynasty-list">
    <div class="container">
      <div class="page-header">
        <router-link to="/" class="back-btn">← 返回首页</router-link>
        <h2 class="page-title">{{ dynastyName }}</h2>
        <p class="page-subtitle">{{ dynastyDescription }}</p>
      </div>

      <div class="dynasty-tabs">
        <router-link 
          v-for="d in dynasties" 
          :key="d.id"
          :to="`/dynasty/${d.id}`"
          :class="{ 'tab-btn': true, 'active': d.id === dynasty }"
        >
          {{ d.name }}
        </router-link>
      </div>

      <div class="poems-grid">
        <PoemCard 
          v-for="poem in dynastyPoems" 
          :key="poem.id" 
          :poem="poem" 
        />
      </div>

      <div v-if="dynastyPoems.length === 0" class="empty-state">
        <p>该朝代暂无诗词作品</p>
      </div>
    </div>
  </div>
</template>

<script>
import PoemCard from '../components/PoemCard.vue';
import { dynasties, poems } from '../data/poems';

export default {
  name: 'DynastyList',
  components: {
    PoemCard
  },
  data() {
    return {
      dynasties,
      poems
    };
  },
  computed: {
    dynasty() {
      return this.$route.params.dynasty;
    },
    dynastyPoems() {
      return this.poems.filter(poem => poem.dynasty === this.dynasty);
    },
    dynastyInfo() {
      return this.dynasties.find(d => d.id === this.dynasty) || {};
    },
    dynastyName() {
      return this.dynastyInfo.name || '诗词作品';
    },
    dynastyDescription() {
      return this.dynastyInfo.description || '';
    }
  }
};
</script>

<style scoped>
.dynasty-list {
  min-height: 100vh;
  padding-top: 100px;
  padding-bottom: 60px;
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.back-btn {
  display: inline-block;
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-light);
  font-size: var(--font-size-sm);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.back-btn:hover {
  color: var(--color-primary);
}

.page-title {
  font-size: var(--font-size-3xl);
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
  font-weight: normal;
}

.page-subtitle {
  font-size: var(--font-size-base);
  color: var(--color-text-light);
}

.dynasty-tabs {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-2xl);
  flex-wrap: wrap;
}

.tab-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  color: var(--color-text);
  text-decoration: none;
  font-size: var(--font-size-base);
  transition: all var(--transition-fast);
}

.tab-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.tab-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.poems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--color-text-light);
  font-size: var(--font-size-lg);
}

@media (max-width: 768px) {
  .page-title {
    font-size: var(--font-size-2xl);
  }
}
</style>
