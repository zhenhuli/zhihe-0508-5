<template>
  <div id="app" :class="{ 'font-songti': fontType === 'songti', 'font-kaiti': fontType === 'kaiti', 'font-heiti': fontType === 'heiti' }">
    <InkBackground />
    <HeaderNav :fontType="fontType" @changeFont="changeFont" />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
import HeaderNav from './components/HeaderNav.vue';
import InkBackground from './components/InkBackground.vue';

export default {
  name: 'App',
  components: {
    HeaderNav,
    InkBackground
  },
  data() {
    return {
      fontType: 'kaiti'
    };
  },
  methods: {
    changeFont(font) {
      this.fontType = font;
    }
  }
};
</script>

<style>
#app {
  min-height: 100vh;
  position: relative;
}

.main-content {
  position: relative;
  z-index: 10;
  padding-top: 80px;
}
</style>
