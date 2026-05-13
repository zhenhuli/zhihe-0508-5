<template>
  <div class="poem-detail">
    <div class="container">
      <div class="detail-header">
        <router-link :to="`/dynasty/${poem.dynasty}`" class="back-btn">
          ← 返回{{ dynastyName }}
        </router-link>
      </div>

      <article class="poem-content card">
        <header class="poem-header">
          <h1 class="poem-title">{{ poem.title }}</h1>
          <p class="poem-author">
            <span class="dynasty-tag">{{ dynastyName }}</span>
            {{ poem.author }}
          </p>
        </header>

        <div class="poem-body">
          <div class="poem-text">
            <p v-for="(line, index) in poem.content" :key="index" class="poem-line">
              {{ line }}
            </p>
          </div>
        </div>

        <section class="poem-section">
          <h3 class="section-subtitle">【注释】</h3>
          <div class="annotation-list">
            <p v-for="(note, index) in poem.annotation" :key="index" class="annotation-item">
              {{ index + 1 }}. {{ note }}
            </p>
          </div>
        </section>

        <section class="poem-section">
          <h3 class="section-subtitle">【赏析】</h3>
          <div class="appreciation-text">
            {{ poem.appreciation }}
          </div>
        </section>
      </article>

      <div class="related-section">
        <h3 class="section-title">相关推荐</h3>
        <div class="poems-grid">
          <PoemCard 
            v-for="poem in relatedPoems" 
            :key="poem.id" 
            :poem="poem" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PoemCard from '../components/PoemCard.vue';
import { dynasties, poems } from '../data/poems';

export default {
  name: 'PoemDetail',
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
    poemId() {
      return parseInt(this.$route.params.id);
    },
    poem() {
      return this.poems.find(p => p.id === this.poemId) || {};
    },
    dynastyName() {
      const dynasty = this.dynasties.find(d => d.id === this.poem.dynasty);
      return dynasty ? dynasty.name : '';
    },
    relatedPoems() {
      return this.poems
        .filter(p => p.dynasty === this.poem.dynasty && p.id !== this.poem.id)
        .slice(0, 3);
    }
  }
};
</script>

<style scoped>
.poem-detail {
  min-height: 100vh;
  padding-top: 100px;
  padding-bottom: 60px;
}

.detail-header {
  margin-bottom: var(--spacing-lg);
}

.back-btn {
  display: inline-block;
  color: var(--color-text-light);
  font-size: var(--font-size-sm);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.back-btn:hover {
  color: var(--color-primary);
}

.poem-content {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-2xl);
}

.poem-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
  padding-bottom: var(--spacing-xl);
  border-bottom: 2px solid var(--color-border);
}

.poem-title {
  font-size: var(--font-size-2xl);
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
  font-weight: normal;
}

.poem-author {
  font-size: var(--font-size-lg);
  color: var(--color-text-light);
}

.dynasty-tag {
  display: inline-block;
  padding: 2px 8px;
  background: var(--color-ink-light);
  color: var(--color-primary);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  margin-right: var(--spacing-sm);
}

.poem-body {
  margin-bottom: var(--spacing-2xl);
}

.poem-text {
  text-align: center;
  padding: var(--spacing-xl) 0;
  background: var(--color-ink-light);
  border-radius: var(--border-radius-lg);
}

.poem-line {
  font-size: var(--font-size-xl);
  color: var(--color-text);
  line-height: 2.5;
  letter-spacing: 4px;
}

.poem-section {
  margin-bottom: var(--spacing-xl);
}

.section-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
  font-weight: normal;
}

.annotation-list {
  padding-left: var(--spacing-lg);
}

.annotation-item {
  font-size: var(--font-size-base);
  color: var(--color-text);
  line-height: 2;
  margin-bottom: var(--spacing-sm);
}

.appreciation-text {
  font-size: var(--font-size-base);
  color: var(--color-text);
  line-height: 2;
  text-align: justify;
  text-indent: 2em;
}

.related-section {
  max-width: 1000px;
  margin: var(--spacing-2xl) auto 0;
}

.poems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-xl);
}

@media (max-width: 768px) {
  .poem-content {
    padding: var(--spacing-lg);
  }
  
  .poem-title {
    font-size: var(--font-size-xl);
  }
  
  .poem-line {
    font-size: var(--font-size-lg);
    letter-spacing: 2px;
  }
}
</style>
