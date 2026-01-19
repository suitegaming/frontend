import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const useTurnoStore = defineStore('turno', {
  actions: {
    async createTurno(turnoData) {
      try {
        const response = await axios.post(`${API_URL}/api/turnos`, turnoData);
        return response.data;
      } catch (error) {
        // Extrae el mensaje de error específico de la respuesta del backend.
        const errorMessage = error.response?.data?.message || error.response?.data;
        throw new Error(errorMessage || 'Failed to create turno');
      }
    },
    async getTurnos() {
      try {
        const response = await axios.get(`${API_URL}/api/turnos`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data || 'Failed to fetch turnos');
      }
    },
    async getTurnoSummary(id) {
      try {
        const response = await axios.get(`${API_URL}/api/turnos/${id}/summary`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data || 'Failed to fetch turno summary');
      }
    },
    async updateTurno(id, turnoData) {
      try {
        const response = await axios.put(`${API_URL}/api/turnos/${id}`, turnoData);
        return response.data;
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.response?.data;
        throw new Error(errorMessage || 'Failed to update turno');
      }
    },
    async deleteTurno(id) {
      try {
        await axios.delete(`${API_URL}/api/turnos/${id}`);
      } catch (error) {
        throw new Error(error.response?.data || 'Failed to delete turno');
      }
    },
  },
});
