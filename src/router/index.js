import { createRouter, createWebHistory } from "vue-router";

import DashboardLayout from "../pages/master/dashboard.vue";
import AuthLayout from "../pages/master/auth.vue";
import Login from "../pages/login.vue";
import Register from "../pages/register.vue";
import Home from "../pages/home.vue";
import Settings from "../pages/settings.vue";
import Analytics from "../pages/analytics.vue";

const routes = [
  {
    path: "/",
    component: AuthLayout,
    redirect: "/login",
    children: [
      { path: "login", name: "Login", component: Login },
      { path: "register", name: "Register", component: Register },
    ],
  },
  {
    path: "/dashboard",
    component: DashboardLayout,
    redirect: "/dashboard/home",
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

export default router;
