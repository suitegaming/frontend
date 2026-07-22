<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8">
        <v-card class="elevation-12 text-center pa-6 rounded-lg">
          <v-icon icon="mdi-gamepad-variant" size="64" color="primary" class="mb-3"></v-icon>
          <h1 class="text-h4 text-primary font-weight-bold mb-3">
            ¡Hola, {{ authStore.username || 'Usuario' }}! 🎮
          </h1>
          <p class="text-subtitle-1 text-grey-darken-1 mb-6">
            Bienvenido al centro de control de <strong>SuiteGaming</strong>. Gestiona turnos, caja e inventario en tiempo real.
          </p>

          <v-divider class="my-4"></v-divider>

          <v-row justify="center" class="mt-2">
            <v-col cols="12" sm="4">
              <v-btn block color="primary" variant="elevated" prepend-icon="mdi-plus-box" to="/registrar-turno">
                Registrar Turno
              </v-btn>
            </v-col>
            <v-col cols="12" sm="4">
              <v-btn block color="secondary" variant="elevated" prepend-icon="mdi-cash-register" to="/control-caja">
                Control de Caja
              </v-btn>
            </v-col>
            <v-col cols="12" sm="4" v-if="authStore.isAdmin">
              <v-btn block color="info" variant="elevated" prepend-icon="mdi-chart-line" to="/admin/analytics">
                Analíticas
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
</script>
