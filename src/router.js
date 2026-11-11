import { createRouter, createWebHistory } from 'vue-router'
import LearnersView from './views/LearnersView.vue'
import PlanView from './views/PlanView.vue'
import ProgressView from './views/ProgressView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'learners', component: LearnersView },
    { path: '/plan', name: 'plan', component: PlanView },
    { path: '/progress', name: 'progress', component: ProgressView },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})
