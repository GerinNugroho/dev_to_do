import { defineStore } from "pinia";
import apiClient from "../services/apiCLient";
import { authService } from "../services/authServices";
import { useDashboardStore } from "./dashboardStore";
import { useConfigStore } from "./configStore";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  }),

  actions: {
    async handleRegister(userData) {
      const dashboardStore = useDashboardStore();
      const configStore = useConfigStore();
      dashboardStore.resetCache();
      configStore.resetCache();

      this.isLoading = true;
      try {
        const result = await authService.register(userData);
        if (result.status === "success") {
          this.user = result.data.user;
          this.isAuthenticated = true;
        }
        return result;
      } finally {
        this.isLoading = false;
      }
    },

    async handleLogin(credentials) {
      const dashboardStore = useDashboardStore();
      const configStore = useConfigStore();
      dashboardStore.resetCache();
      configStore.resetCache();

      this.isLoading = true;
      try {
        const result = await authService.login(credentials);
        console.log(result);
        if (result.status === "success") {
          this.user = result.data.user;
          this.isAuthenticated = true;
        }
        return result;
      } finally {
        this.isLoading = false;
      }
    },

    async handleLogout() {
      const dashboardStore = useDashboardStore();
      const configStore = useConfigStore();
      try {
        dashboardStore.resetCache();
        configStore.resetCache();
        await authService.logout();
      } finally {
        this.user = null;
        this.isAuthenticated = false;
      }
    },

    async checkCurrentSession() {
      try {
        const response = await apiClient.get("/auth/me");
        this.user = response.data.data.user;
        this.isAuthenticated = true;
      } catch (error) {
        this.user = null;
        this.isAuthenticated = false;
      }
    },
  },
});
