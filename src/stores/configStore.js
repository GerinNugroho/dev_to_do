import { defineStore } from "pinia";
import { configServices } from "../services/configServices.js";
import { useAuthStore } from "./auth.js";
export const useConfigStore = defineStore("config", {
  state: () => ({
    config: null,
    profile: null,
    isLoading: false,
  }),

  persist: {
    pick: ["config", "profile"],
  },

  actions: {
    async fetchAllSettings() {
      this.isLoading = true;
      try {
        const [configRes, profileRes] = await Promise.all([
          configServices.getUserConfig(),
          configServices.getUserProfile(),
        ]);

        this.config = configRes.data.config;
        this.profile = profileRes.data.user;
      } catch (error) {
        console.error("Gagal memuat pengaturan:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async saveConfiguration(updatedData) {
      this.isLoading = true;
      try {
        const payload = {
          personal_access_token: updatedData.pat,
          repo_url: updatedData.repo,
          nlp_enabled: updatedData.nlp,
        };

        const result = await configServices.updateUserConfig(payload);
        if (result.status === "success") {
          this.config = result.data.config;
        }
        return result;
      } finally {
        this.isLoading = false;
      }
    },
    async updateProfile(updatedProfileData) {
      this.isLoading = true;
      try {
        const result =
          await configServices.updateUserProfile(updatedProfileData);

        if (result.status === "success") {
          this.profile = result.data.user;

          const authStore = useAuthStore();
          if (authStore.user) {
            authStore.user.fullname = result.data.user.fullname;
            authStore.user.username = result.data.user.username;
            authStore.user.email = result.data.user.email;
          }
        }
        return result;
      } catch (error) {
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
