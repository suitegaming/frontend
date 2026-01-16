<template>
  <v-container>
    <h2 class="text-h4 mb-4">Control de Caja</h2>

    <v-row>
      <v-col cols="12" md="6">
        <v-card class="mb-6">
          <v-card-title class="text-h5">Balance Actual</v-card-title>
          <v-card-text>
            <p class="text-h3" :class="balance >= 0 ? 'text-success' : 'text-error'">S/ {{ balance.toFixed(2) }}</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="mb-6">
          <v-card-title class="text-h5">Total Gastos (sin depósitos)</v-card-title>
          <v-card-text>
            <p class="text-h3 text-error">S/ {{ totalGastosFiltrados.toFixed(2) }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="mb-6">
      <v-card-title>Registrar Movimiento</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleRegisterMovement">
          <v-text-field
            v-model="newMovement.description"
            label="Descripción del Movimiento"
            required
            :disabled="isRegistering"
          ></v-text-field>
          <v-text-field
            v-model.number="newMovement.amount"
            label="Monto (negativo para ingresos)"
            type="number"
            step="0.01"
            required
            :disabled="isRegistering"
          ></v-text-field>
          <v-btn type="submit" color="primary" :loading="isRegistering" :disabled="isRegistering">Registrar Movimiento</v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title>Historial de Movimientos</v-card-title>
      <v-card-text>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">Fecha</th>
              <th class="text-left">Tipo</th>
              <th class="text-left">Descripción</th>
              <th class="text-left">Monto</th>
              <th class="text-left">Registrado por</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="movement in gastos" :key="movement.id">
              <td>{{ new Date(movement.timestamp).toLocaleString() }}</td>
              <td>
                <v-chip :color="movement.amount < 0 ? 'success' : 'error'" small>
                  {{ movement.amount < 0 ? 'INGRESO' : 'GASTO' }}
                </v-chip>
              </td>
              <td>{{ movement.description }}</td>
              <td>S/ {{ Math.abs(movement.amount).toFixed(2) }}</td>
              <td>{{ movement.userName }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import { useCajaStore } from '../stores/caja';
import { useNotificationStore } from '../stores/notification';

const cajaStore = useCajaStore();
const notificationStore = useNotificationStore();
const newMovement = ref({ description: '', amount: null });
const isRegistering = ref(false);
const isPageLoading = ref(true);

const balance = computed(() => cajaStore.balance);
const gastos = computed(() => cajaStore.gastos);

const totalGastosFiltrados = computed(() => {
  return gastos.value
    .filter(gasto => gasto.amount > 0 && !gasto.description.toLowerCase().startsWith('deposito'))
    .reduce((total, gasto) => total + gasto.amount, 0);
});

const handleRegisterMovement = async () => {
  // Permitir montos negativos, pero no cero.
  if (!newMovement.value.description || !newMovement.value.amount) {
    notificationStore.show('Por favor, complete todos los campos y asegúrese que el monto no sea cero.', 'error');
    return;
  }
  isRegistering.value = true;
  await nextTick();
  try {
    // El backend ya espera un monto que se restará del balance.
    // Si el usuario ingresa -50 (ingreso), el backend hará balance - (-50) = balance + 50.
    // Si el usuario ingresa 50 (gasto), el backend hará balance - 50.
    await cajaStore.registrarGasto(newMovement.value);
    newMovement.value = { description: '', amount: null };
    notificationStore.show('Movimiento registrado exitosamente!');
  } catch (error) {
    notificationStore.show(error, 'error');
  } finally {
    isRegistering.value = false;
  }
};

onMounted(async () => {
  isPageLoading.value = true;
  try {
    await Promise.all([
      cajaStore.fetchBalance(),
      cajaStore.fetchGastos()
    ]);
  } catch (error) {
    notificationStore.show('Error al cargar los datos de la caja.', 'error');
  } finally {
    isPageLoading.value = false;
  }
});
</script>