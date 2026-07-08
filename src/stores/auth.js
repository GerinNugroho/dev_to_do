import { defineStore } from "pinia";
import apiClient from "../services/apiCLient";
import { authService } from "../services/authServices";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  }),

  actions: {
    async handleRegister(userData) {
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
      try {
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
