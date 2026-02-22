import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import LoginPage from '../views/LoginPage.vue'

// 1. Import authService มาเพื่อเช็คสถานะการ Login
import { authService } from '@/auth/auth-service';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/tab1'
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue'),
        meta: { requiresAuth: true } // ระบุว่าหน้านี้ต้อง Login
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/login',
    component: LoginPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 2. เพิ่ม Navigation Guard (Auth Guard)
router.beforeEach(async (to) => {
  const user = await authService.getCurrentUser();

  // กรณี 1: ถ้าจะเข้าหน้าที่มี meta: requiresAuth แต่ยังไม่ได้ Login -> ส่งไปหน้า Login
  if (to.matched.some(record => record.meta.requiresAuth) && !user) {
    return '/login';
  }

  // กรณี 2: ถ้า Login แล้ว แต่ดันจะเข้าหน้า /login -> ส่งไปหน้า Tab 1 เลย
  if (to.path === '/login' && user) {
    return '/tabs/tab1';
  }

  return true; // อนุญาตให้ผ่านไปได้
});

export default router