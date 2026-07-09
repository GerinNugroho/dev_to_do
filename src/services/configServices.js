import apiClient from "./apiCLient.js";

export const configServices = {
  getUserConfig: async () => {
    const response = await apiClient.get("/user/configuration");
    return response.data;
  },

  updateUserConfig: async (configData) => {
    const response = await apiClient.patch("/user/configuration", configData);
    return response.data;
  },

  getUserProfile: async () => {
    const response = await apiClient.get("/user/profile");
    return response.data;
  },

  updateUserProfile: async (profileData) => {
    const response = await apiClient.patch("/user/profile", profileData);
    return response.data;
  },
};
