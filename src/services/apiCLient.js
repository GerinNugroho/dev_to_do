import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // if (error.response && error.response.status === 401) {
    //   console.log("belum login!");
    // }
    // if (error.response) {
    //   console.log(error.response.data);
    // }
    const customErrorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message;

    return Promise.reject(customErrorMessage);
  },
);

export default apiClient;
