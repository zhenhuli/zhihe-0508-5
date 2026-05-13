import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import NoticeDetail from '../views/NoticeDetail.vue'
import CreateNotice from '../views/CreateNotice.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/notice/:id',
    name: 'NoticeDetail',
    component: NoticeDetail
  },
  {
    path: '/create',
    name: 'CreateNotice',
    component: CreateNotice
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
