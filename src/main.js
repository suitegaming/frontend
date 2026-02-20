import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import vuetify from './plugins/vuetify' // Importa Vuetify

import App from './App.vue'
import router from './router'

// Configuración global de Axios al cargar la app
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(vuetify) // Usa Vuetify

// Setup Axios Interceptor for 401 handling
import { useAuthStore } from '@/stores/auth'

// We need to use the store after Pinia is installed
const authStore = useAuthStore()

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (authStore.token) {
        authStore.logout();
      }
    }
    return Promise.reject(error);
  }
);

app.mount('#app')
