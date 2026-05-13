import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../pages/Home.vue';
import DynastyList from '../pages/DynastyList.vue';
import PoemDetail from '../pages/PoemDetail.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/dynasty/:dynasty',
    name: 'DynastyList',
    component: DynastyList
  },
  {
    path: '/poem/:id',
    name: 'PoemDetail',
    component: PoemDetail
  }
];

const router = new VueRouter({
  mode: 'hash',
  routes
});

export default router;
