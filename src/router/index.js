import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Quiz from '@/views/Quiz.vue'
import QuestionList from '@/views/QuestionList.vue'
import About from '@/views/About.vue'
import AdminLogin from '@/views/AdminLogin.vue'
import AdminAnalytics from '@/views/AdminAnalytics.vue'
import { useAnalyticsStore } from '@/stores/analytics'
import { useAdminStore } from '@/stores/admin'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/quiz/:id',
      name: 'quiz',
      component: Quiz,
    },
    {
      path: '/questions/:classId',
      name: 'question-list',
      component: QuestionList,
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: AdminLogin,
    },
    {
      path: '/admin/analytics',
      name: 'admin-analytics',
      component: AdminAnalytics,
      meta: { requiresAuth: true },
    },
  ],
})

// Route guard for admin routes
router.beforeEach((to, _from, next) => {
  const adminStore = useAdminStore()

  if (to.meta.requiresAuth) {
    // Wait for auth state to be initialized
    if (adminStore.isLoading) {
      // Wait a bit for Firebase to initialize
      const unwatch = adminStore.$subscribe(() => {
        if (!adminStore.isLoading) {
          unwatch()
          if (adminStore.isAuthenticated) {
            next()
          } else {
            next('/admin/login')
          }
        }
      })
    } else if (adminStore.isAuthenticated) {
      next()
    } else {
      next('/admin/login')
    }
  } else {
    next()
  }
})

// Track page views (exclude admin pages)
router.afterEach((to) => {
  if (!to.path.startsWith('/admin')) {
    const analyticsStore = useAnalyticsStore()
    analyticsStore.trackPageView(to.name || to.path)
  }
})

export default router
