<template>
  <router-link :to="`/poem/${poem.id}`" class="poem-card card">
    <h3 class="poem-title">{{ poem.title }}</h3>
    <p class="poem-author">{{ poem.author }}</p>
    <div class="poem-preview">
      <p v-for="(line, index) in previewLines" :key="index" class="poem-line">
        {{ line }}
      </p>
    </div>
    <div class="poem-footer">
      <span class="read-more">查看详情 →</span>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'PoemCard',
  props: {
    poem: {
      type: Object,
      required: true
    }
  },
  computed: {
    previewLines() {
      return this.poem.content.slice(0, 2);
    }
  }
};
</script>

<style scoped>
.poem-card {
  display: block;
  height: 100%;
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

.poem-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, var(--color-ink-light) 0%, transparent 70%);
  opacity: 0;
  transition: opacity var(--transition-base);
  pointer-events: none;
}

.poem-card:hover::before {
  opacity: 1;
}

.poem-title {
  font-size: var(--font-size-xl);
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
  font-weight: normal;
}

.poem-author {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin-bottom: var(--spacing-lg);
}

.poem-preview {
  margin-bottom: var(--spacing-lg);
}

.poem-line {
  font-size: var(--font-size-base);
  color: var(--color-text);
  line-height: 2;
  letter-spacing: 2px;
}

.poem-footer {
  padding-top: var(--spacing-md);
  border-top: 1px dashed var(--color-border);
}

.read-more {
  font-size: var(--font-size-sm);
  color: var(--color-accent);
  transition: all var(--transition-fast);
}

.poem-card:hover .read-more {
  color: var(--color-secondary);
  padding-right: 4px;
}
</style>
