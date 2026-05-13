<template>
  <div class="home">
    <section class="hero">
      <div class="container">
        <h2 class="hero-title">品读千古佳作</h2>
        <p class="hero-subtitle">感受中华文化的博大精深</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h3 class="section-title">按朝代浏览</h3>
        <div class="dynasties-grid">
          <DynastyCard 
            v-for="dynasty in dynasties" 
            :key="dynasty.id" 
            :dynasty="dynasty" 
          />
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h3 class="section-title">精选诗词</h3>
        <div class="poems-grid">
          <PoemCard 
            v-for="poem in featuredPoems" 
            :key="poem.id" 
            :poem="poem" 
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import DynastyCard from '../components/DynastyCard.vue';
import PoemCard from '../components/PoemCard.vue';
import { dynasties, poems } from '../data/poems';

export default {
  name: 'Home',
  components: {
    DynastyCard,
    PoemCard
  },
  data() {
    return {
      dynasties,
      poems
    };
  },
  computed: {
    featuredPoems() {
      return this.poems.slice(0, 6);
    }
  }
};
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.hero {
  padding: 120px 0 80px;
  text-align: center;
}

.hero-title {
  font-size: 48px;
  color: var(--color-primary);
  margin-bottom: var(--spacing-lg);
  font-weight: normal;
  letter-spacing: 4px;
}

.hero-subtitle {
  font-size: var(--font-size-xl);
  color: var(--color-text-light);
  font-weight: normal;
}

.section {
  padding: 60px 0;
}

.dynasties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--spacing-xl);
  margin-top: var(--spacing-xl);
}

.poems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-xl);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 32px;
  }
  
  .hero {
    padding: 100px 0 60px;
  }
  
  .section {
    padding: 40px 0;
  }
}
</style>
