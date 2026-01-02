import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/reports`;

export const useReportStore = defineStore('report', {
  state: () => ({
    monthlyReport: null,
  }),
  actions: {
    async fetchMonthlyReport(year, month) {
      try {
        const response = await axios.get(`${API_URL}/monthly`, {
          params: { year, month }
        });
        this.monthlyReport = response.data;
        return response.data;
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.response?.data;
        throw new Error(errorMessage || 'Failed to fetch monthly report');
      }
    },
  },
});
