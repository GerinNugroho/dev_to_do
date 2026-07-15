import { defineStore } from "pinia";
import { dashboardServices } from "../services/dashboardServices.js";

const defaultMetrics = {
  completedTasks: 0,
  lateTasks: 0,
  totalTasks: 0,
  focusScore: 0,
  contributionGrid: [],
};

const normalizeAnalyticsPayload = (payload = {}, year = 2026) => {
  const rawContributionGrid = Array.isArray(payload.contributionGrid)
    ? payload.contributionGrid
    : Array.isArray(payload.contribution_grid)
      ? payload.contribution_grid
      : Array.isArray(payload.contributions)
        ? payload.contributions
        : payload.contributionGrid &&
            typeof payload.contributionGrid === "object"
          ? Object.entries(payload.contributionGrid)
          : payload.contribution_grid &&
              typeof payload.contribution_grid === "object"
            ? Object.entries(payload.contribution_grid)
            : [];

  const contributionGrid = rawContributionGrid.map((item) => {
    if (typeof item === "object" && item !== null) {
      const date = item.date || item.day || item.key || item.label || null;
      const count = Number(item.count ?? item.value ?? item.total ?? 0);
      return date ? { date, count } : item;
    }

    if (Array.isArray(item)) {
      const [date, count] = item;
      return { date, count: Number(count ?? 0) };
    }

    return { date: item, count: 0 };
  });

  return {
    completedTasks: Number(
      payload.completedTasks ??
        payload.completed_tasks ??
        payload.completed ??
        0,
    ),
    lateTasks: Number(
      payload.lateTasks ?? payload.late_tasks ?? payload.late ?? 0,
    ),
    totalTasks: Number(
      payload.totalTasks ?? payload.total_tasks ?? payload.total ?? 0,
    ),
    focusScore: Number(
      payload.focusScore ?? payload.focus_score ?? payload.score ?? 0,
    ),
    contributionGrid,
    year,
  };
};

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    branches: [],
    selectedBranch: "main",
    tasksByBranch: {},
    currentTasks: [],
    isGithubConnected: false,
    branchesLoading: false,
    tasksLoading: false,
    branchesRequest: null,
    taskRequestsByBranch: {},
    analyticsMetrics: { ...defaultMetrics },
    analyticsLoading: false,
    analyticsByYear: {},
    analyticsRequestsByYear: {},
    currentYear: 2026,
  }),

  persist: {
    paths: [
      "branches",
      "selectedBranch",
      "tasksByBranch",
      "currentTasks",
      "analyticsByYear",
      "analyticsMetrics",
      "currentYear",
    ],
  },

  actions: {
    async fetchBranches({ force = false } = {}) {
      if (!force && this.branches.length) {
        return this.branches;
      }

      if (!force && this.branchesRequest) {
        return this.branchesRequest;
      }

      this.branchesLoading = true;
      this.branchesRequest = dashboardServices
        .getBranches()
        .then((response) => {
          if (response.data?.status === "success") {
            const nextBranches = response.data.data.branches || [];
            this.branches = nextBranches;
            this.isGithubConnected = response.data.data.isGithubConnected;
            return nextBranches;
          }

          return [];
        })
        .catch((error) => {
          console.error("Gagal mengambil data branch:", error);
          throw error;
        })
        .finally(() => {
          this.branchesRequest = null;
          this.branchesLoading = false;
        });

      return this.branchesRequest;
    },

    async fetchTasks({ branchName = this.selectedBranch, force = false } = {}) {
      const normalizedBranchName = branchName || "main";

      if (!force && this.tasksByBranch[normalizedBranchName]) {
        this.currentTasks = this.tasksByBranch[normalizedBranchName];
        return this.tasksByBranch[normalizedBranchName];
      }

      if (!force && this.taskRequestsByBranch[normalizedBranchName]) {
        return this.taskRequestsByBranch[normalizedBranchName];
      }

      this.tasksLoading = true;
      const request = dashboardServices
        .getTask(normalizedBranchName || undefined)
        .then((response) => {
          if (response.data?.status === "success") {
            const nextTasks = response.data.data.tasks || [];
            this.tasksByBranch[normalizedBranchName] = nextTasks;
            this.currentTasks = nextTasks;
            return nextTasks;
          }

          return [];
        })
        .catch((error) => {
          console.error("failed to fetching datas task:", error);
          throw error;
        })
        .finally(() => {
          delete this.taskRequestsByBranch[normalizedBranchName];
          this.tasksLoading = false;
        });

      this.taskRequestsByBranch[normalizedBranchName] = request;
      return request;
    },

    async selectBranch(branchName) {
      if (!branchName || this.selectedBranch === branchName) {
        return this.selectedBranch;
      }

      this.selectedBranch = branchName;
      await this.fetchTasks({ branchName });
      return this.selectedBranch;
    },

    async refreshBranchData() {
      return this.fetchBranches({ force: true });
    },

    async refreshTasksForCurrentBranch() {
      return this.fetchTasks({ branchName: this.selectedBranch, force: true });
    },

    async removeBranch(branchName) {
      this.branches = this.branches.filter(
        (branch) => branch.name !== branchName,
      );

      if (this.selectedBranch === branchName) {
        this.selectedBranch = this.branches[0]?.name || "main";
      }

      delete this.tasksByBranch[branchName];
      if (this.selectedBranch && this.tasksByBranch[this.selectedBranch]) {
        this.currentTasks = this.tasksByBranch[this.selectedBranch];
      } else {
        this.currentTasks = [];
      }

      await this.fetchAnalytics({ year: this.currentYear, force: true });
    },

    async fetchAnalytics({ year = this.currentYear, force = false } = {}) {
      const targetYear = Number(year || this.currentYear || 2026);

      if (!force && this.analyticsByYear[targetYear]) {
        const cached = normalizeAnalyticsPayload(
          this.analyticsByYear[targetYear],
          targetYear,
        );
        this.analyticsMetrics = cached;
        return cached;
      }

      if (!force && this.analyticsRequestsByYear[targetYear]) {
        return this.analyticsRequestsByYear[targetYear];
      }

      this.currentYear = targetYear;
      this.analyticsLoading = true;

      const request = dashboardServices
        .getAnalyticsData(targetYear)
        .then((response) => {
          if (response.data?.status === "success") {
            const payload = response.data.data;
            const normalizedPayload = normalizeAnalyticsPayload(
              payload,
              targetYear,
            );
            this.analyticsByYear[targetYear] = normalizedPayload;
            this.analyticsMetrics = normalizedPayload;
            return normalizedPayload;
          }

          return this.analyticsMetrics;
        })
        .catch((error) => {
          console.error("Gagal mengonsumsi API analitik:", error);
          throw error;
        })
        .finally(() => {
          delete this.analyticsRequestsByYear[targetYear];
          this.analyticsLoading = false;
        });

      this.analyticsRequestsByYear[targetYear] = request;
      return request;
    },

    async deleteTaskById(id) {
      const response = await dashboardServices.deleteTask(id);
      if (response.status === 200 || response.data?.status === "success") {
        const nextTasks = this.currentTasks.filter((task) => task.id !== id);
        this.currentTasks = nextTasks;
        this.tasksByBranch[this.selectedBranch || "main"] = nextTasks;
        await this.fetchAnalytics({ year: this.currentYear, force: true });
      }
    },

    async completeTaskStatus(id) {
      const response = await dashboardServices.updateTaskStatus(
        id,
        "COMPLETED",
      );
      if (response.status === 200 || response.data?.status === "success") {
        await this.refreshTasksForCurrentBranch();
        await this.fetchAnalytics({ year: this.currentYear, force: true });
      }
    },

    async processNlpInput(val) {
      const response = await dashboardServices.processNlpCommand(
        val,
        this.selectedBranch,
      );
      if (response.status === 201) {
        const result = response.data;
        if (result.type === "CREATE_BRANCH") {
          await this.refreshBranchData();
          await this.selectBranch(result.data.branch_name);
          await this.fetchAnalytics({ year: this.currentYear, force: true });
          return result;
        }

        if (result.type === "CREATE_TASK") {
          await this.refreshTasksForCurrentBranch();
          await this.fetchAnalytics({ year: this.currentYear, force: true });
        }

        return result;
      }

      return null;
    },
  },
});
