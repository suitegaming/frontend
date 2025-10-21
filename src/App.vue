<template>
  <v-app>
    <v-navigation-drawer v-model="drawer">
      <v-list>
        <v-list-item
          prepend-icon="mdi-gamepad-variant"
          title="SUITEGAMING"
          subtitle="LAN Center"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <!-- Login -->
        <v-list-item v-if="!authStore.isAuthenticated" prepend-icon="mdi-login" title="Login" to="/login"></v-list-item>

        <!-- Authenticated user links -->
        <div v-if="authStore.isAuthenticated">
          <v-list-item prepend-icon="mdi-home" title="Home" to="/"></v-list-item>

          <!-- General User -->
          <v-list-subheader>OPERACIÓN</v-list-subheader>
          <v-list-item prepend-icon="mdi-plus-box" title="Registrar Turno" to="/registrar-turno"></v-list-item>
          <v-list-item prepend-icon="mdi-chart-bar" title="Resumen de Turnos" to="/resumen-turnos"></v-list-item>
          <v-list-item prepend-icon="mdi-history" title="Historial de Productos" to="/product-history"></v-list-item>
          <v-list-item prepend-icon="mdi-cash-register" title="Control de Caja" to="/control-caja"></v-list-item>
          <v-list-item v-if="!authStore.isAdmin" prepend-icon="mdi-check-all" title="Mis Tareas" to="/my-tasks"></v-list-item>

          <!-- Admin -->
          <div v-if="authStore.isAdmin">
            <v-list-subheader>ADMINISTRACIÓN</v-list-subheader>
            <v-list-item prepend-icon="mdi-account-group" title="Gestionar Usuarios" to="/admin"></v-list-item>
            <v-list-item prepend-icon="mdi-package-variant-closed" title="Gestionar Productos" to="/manage-products"></v-list-item>
            <v-list-item prepend-icon="mdi-clipboard-list" title="Gestionar Tareas" to="/admin/tasks"></v-list-item>
          </div>

          <v-divider class="my-4"></v-divider>

          <!-- Logout -->
          <v-list-item @click="handleLogout" prepend-icon="mdi-logout" title="Cerrar Sesión"></v-list-item>
        </div>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>SuiteGaming</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>

    <GlobalSnackbar />
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notification';
import GlobalSnackbar from './components/GlobalSnackbar.vue';

const drawer = ref(true);
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const handleLogout = () => {
  authStore.logout();
  notificationStore.show('Has cerrado sesión.');
};
</script>
