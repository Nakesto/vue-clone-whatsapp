/* eslint-disable no-unused-vars */
import { createRouter, createWebHistory } from "vue-router";
import { useAuthentication } from "../stores/authentication";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const auth = useAuthentication();
  const { isAuthenticate } = auth;

  if (to.meta.requiresAuth && !isAuthenticate) {
    next("/login");
  } else if (!to.meta.requiresAuth && isAuthenticate) {
    next("/");
  } else {
    next();
  }
});

export default router;
