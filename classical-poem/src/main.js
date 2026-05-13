import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './assets/css/variables.css';
import './assets/css/global.css';

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
