import { createRouter, createWebHistory } from "vue-router";
import DashboardLayout from "../pages/master/dashboard.vue";
import MasterLayout from "../pages/master/master.vue";
import Landing from "../pages/landing.vue";
import Login from "../pages/login.vue";
import Register from "../pages/register.vue";
import Home from "../pages/home.vue";
import Settings from "../pages/settings.vue";
import Analytics from "../pages/analytics.vue";
import { useAuthStore } from "../stores/auth.js";

const routes = [
  {
    path: "/",
    component: MasterLayout,
    children: [
      { path: "", name: "Landing", component: Landing },
      { path: "login", name: "Login", component: Login },
      { path: "register", name: "Register", component: Register },
    ],
  },
  {
    path: "/dashboard",
    component: DashboardLayout,
    redirect: "/dashboard/home",
    meta: { requiresAuth: true },
    children: [
      { path: "home", name: "Home", component: Home },
      { path: "analytics", name: "Analytics", component: Analytics },
      { path: "settings", name: "Settings", component: Settings },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated && authStore.user === null) {
    await authStore.checkCurrentSession();
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: "Login" });
    return;
  }

  if (to.meta.isPublic && authStore.isAuthenticated && to.name !== "Landing") {
    next({ name: "Home" });
    return;
  }

  next();
});

export default router;
