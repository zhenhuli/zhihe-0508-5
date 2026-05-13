<template>
  <router-link :to="`/dynasty/${dynasty.id}`" class="dynasty-card">
    <div class="card-inner">
      <h3 class="dynasty-name">{{ dynasty.name }}</h3>
      <p class="dynasty-desc">{{ dynasty.description }}</p>
      <div class="dynasty-count">
        <span>{{ dynasty.count }}</span> 首作品
      </div>
      <div class="dynasty-decoration"></div>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'DynastyCard',
  props: {
    dynasty: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>
.dynasty-card {
  display: block;
  text-decoration: none;
}

.card-inner {
  position: relative;
  padding: var(--spacing-2xl) var(--spacing-xl);
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  text-align: center;
  overflow: hidden;
  transition: all var(--transition-base);
}

.card-inner:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-accent);
}

.dynasty-name {
  font-size: var(--font-size-2xl);
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
  font-weight: normal;
}

.dynasty-desc {
  font-size: var(--font-size-base);
  color: var(--color-text-light);
  margin-bottom: var(--spacing-lg);
  line-height: 1.6;
}

.dynasty-count {
  font-size: var(--font-size-sm);
  color: var(--color-accent);
}

.dynasty-count span {
  font-size: var(--font-size-xl);
  font-weight: bold;
  color: var(--color-primary);
}

.dynasty-decoration {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 4px;
  background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
  opacity: 0.6;
}
</style>
