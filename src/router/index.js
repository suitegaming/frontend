import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'

import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('@/views/AdminDashboard.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/manage-products',
    name: 'ManageProducts',
    component: () => import('@/views/ManageProducts.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/registrar-turno',
    name: 'RegistrarTurno',
    component: () => import('@/views/RegistrarTurno.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/resumen-turnos',
    name: 'ResumenTurnos',
    component: () => import('@/views/ResumenTurnos.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/turno/:id/summary',
    name: 'TurnoSummary',
    component: () => import('@/views/TurnoSummary.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/product-history',
    name: 'ProductHistory',
    component: () => import('@/views/ProductHistory.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/control-caja',
    name: 'ControlCaja',
    component: () => import('@/views/ControlCaja.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/tasks',
    name: 'AdminTasks',
    component: () => import('@/views/AdminTasks.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/monthly-report',
    name: 'MonthlyReport',
    component: () => import('@/views/MonthlyReport.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/analytics',
    name: 'AnalyticsDashboard',
    component: () => import('@/views/AnalyticsDashboard.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/my-tasks',
    name: 'MyTasks',
    component: () => import('@/views/MyTasks.vue'),
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/login')
  }
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return next('/') // Redirect to home if not admin
  }
  next()
})

export default router