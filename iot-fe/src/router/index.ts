import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import Dashboard from '@/pages/Dashboard.vue'
import DataSensor from '@/pages/DataSensor.vue'
import Profile from '@/pages/Profile.vue'
import History from '@/pages/History.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'root',
      component: AppLayout,
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: Dashboard,
        },
        {
          path: 'data-sensor',
          name: 'data-sensor',
          component: DataSensor,
        },
        {
          path: 'profile',
          name: 'profile',
          component: Profile,
        },
        {
          path: 'history',
          name: 'history',
          component: History,
        },
      ],
    },
  ],
})

export default router
