/* eslint-disable no-unused-vars */
import { storeToRefs } from "pinia";
import { nextTick } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { useAuthentication } from "../stores/authentication";
import LoginView from "../views/LoginView.vue";

const Kosong = {
  template: `
    <div>
      Kosong
    </div>
  `,
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/RegisterView.vue"),
    },
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const auth = useAuthentication();
  const { isAuthenticate } = storeToRefs(auth);

  console.log(to.path);
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticate.value) {
      next({
        path: "/login",
      });
    } else {
      next();
    }
  } else {
    if (to.path === "/login" && isAuthenticate.value) {
      next({ path: "/", replace: true });
    } else if (to.path === "/register" && isAuthenticate.value) {
      next({ path: "/", replace: true });
    } else {
      next();
    }
  }
});

export default router;
