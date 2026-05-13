<template>
  <header class="header">
    <div class="container header-container">
      <router-link to="/" class="logo">
        <h1>古风诗词赏析</h1>
      </router-link>
      <nav class="nav">
        <router-link to="/" class="nav-link" exact>首页</router-link>
        <router-link to="/dynasty/tang" class="nav-link">唐诗</router-link>
        <router-link to="/dynasty/song" class="nav-link">宋词</router-link>
        <router-link to="/dynasty/yuan" class="nav-link">元曲</router-link>
      </nav>
      <div class="font-selector">
        <span class="font-label">字体：</span>
        <button 
          v-for="font in fonts" 
          :key="font.id"
          :class="{ 'font-btn': true, 'active': fontType === font.id }"
          @click="$emit('changeFont', font.id)"
        >
          {{ font.name }}
        </button>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HeaderNav',
  props: {
    fontType: {
      type: String,
      default: 'kaiti'
    }
  },
  data() {
    return {
      fonts: [
        { id: 'kaiti', name: '楷体' },
        { id: 'songti', name: '宋体' },
        { id: 'heiti', name: '黑体' }
      ]
    };
  }
};
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(253, 245, 230, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-border);
  z-index: 100;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-lg);
}

.logo h1 {
  font-size: var(--font-size-xl);
  color: var(--color-primary);
  font-weight: normal;
}

.nav {
  display: flex;
  gap: var(--spacing-lg);
}

.nav-link {
  font-size: var(--font-size-base);
  color: var(--color-text);
  transition: color var(--transition-fast);
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-primary);
  transition: width var(--transition-base);
}

.nav-link:hover::after,
.nav-link.router-link-exact-active::after {
  width: 100%;
}

.font-selector {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.font-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
}

.font-btn {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  background: transparent;
  color: var(--color-text);
  transition: all var(--transition-fast);
}

.font-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.font-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  .nav {
    gap: var(--spacing-md);
  }
}
</style>
