import apiClient from "./apiCLient.js";

export const dashboardServices = {
  getBranches: () => apiClient.get("/branch/list"),
  getTask: (branchName) =>
    apiClient.get("/task/list", {
      params: { branch: branchName },
    }),
  processNlpCommand: (instruction, activeBranchName) =>
    apiClient.post("/nlp/create", {
      instruction,
      active_branch_name: activeBranchName,
    }),
  updateTaskStatus: (taskId, status) =>
    apiClient.patch(`/task/update/${taskId}`, { status }),
  deleteTask: (taskId) => apiClient.delete(`/task/delete/${taskId}`),
  getAnalyticsData: (year) =>
    apiClient.get("/analytic/dashboard", {
      params: { year },
    }),
};
