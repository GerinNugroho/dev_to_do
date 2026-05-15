import { createRouter, createWebHistory } from "vue-router";

import DashboardLayout from "../pages/master/dashboard.vue";
import Home from "../pages/home.vue";
import Settings from "../pages/settings.vue";
import Analytics from "../pages/analytics.vue";

const routes = [
  {
    path: "/",
    redirect: "/dashboard/home",
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
