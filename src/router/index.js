/* eslint-disable no-unused-vars */
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthentication } from '../stores/authentication'
import LoginView from '../views/LoginView.vue'

const Kosong = {
  template: `
    <div>
      Kosong
    </div>
  `,
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: {
        requiresAuth: true
      }
    },
  ]
})

router.beforeEach((to, from, next) => {
  const auth = useAuthentication()
  const { isAuthenticate } = auth

  if (to.meta.requiresAuth && !isAuthenticate) {
    next('/login')
  } else if (!to.meta.requiresAuth && isAuthenticate) {
    next('/')
  } else {
    next()
  }

})

export default router
