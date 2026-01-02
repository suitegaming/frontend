<template>
  <v-container>
    <div v-if="isPageLoading" class="text-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p>Cargando Resumen de Turnos...</p>
    </div>
    <div v-else>
      <h2 class="text-h4 mb-4">Resumen de Turnos</h2>
      <v-card>
        <v-card-text>
          <v-responsive>
            <v-table>
              <thead>
                <tr>
                  <th class="text-left">Registrado por</th>
                  <th class="text-left">Fecha</th>
                  <th class="text-left">Hora Entrada</th>
                  <th class="text-left">Hora Salida</th>
                  <th class="text-left">Efectivo</th>
                  <th class="text-left">Yape</th>
                  <th class="text-left">Snacks</th>
                  <th class="text-left">Ingreso Inventario</th>
                  <th class="text-left">Consumo</th>
                  <th class="text-left">Retiros</th>
                  <th class="text-left">Dinero Pancafe</th>
                  <th class="text-left">Usanza Pancafe</th>
                  <th class="text-left">KW</th>
                  <th class="text-left">Usuarios</th>
                  <th class="text-left">Diferencia</th>
                  <th v-if="authStore.isAdmin" class="text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="turno in turnos" :key="turno.id" @click="showTurnoSummary(turno.id)">
                  <td>{{ turno.userName }}</td>
                  <td>{{ turno.fecha }}</td>
                  <td>{{ turno.horaEntrada }}</td>
                  <td>{{ turno.horaSalida }}</td>
                  <td>{{ turno.efectivo }}</td>
                  <td>{{ turno.yape }}</td>
                  <td>{{ turno.snacks }}</td>
                  <td>{{ turno.ingresoInventario }}</td>
                  <td>{{ turno.consumo }}</td>
                  <td>{{ turno.retiros }}</td>
                  <td>{{ turno.dineroPancafe }}</td>
                  <td>{{ turno.usanzaPancafe }}</td>
                  <td>{{ turno.kw }}</td>
                  <td>{{ turno.usuarios }}</td>
                  <td>{{ (turno.dineroPancafe + turno.snacks - turno.retiros - turno.consumo - turno.efectivo - turno.yape).toFixed(2) }}</td>
                  <td v-if="authStore.isAdmin">
                    <v-btn @click.stop="deleteTurno(turno.id)" color="error" :loading="deletingTurnoId === turno.id" :disabled="!!deletingTurnoId">Eliminar</v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-responsive>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useTurnoStore } from '../stores/turno';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { useNotificationStore } from '../stores/notification';

const turnos = ref([]);
const turnoStore = useTurnoStore();
const authStore = useAuthStore();
const router = useRouter();
const notificationStore = useNotificationStore();
const deletingTurnoId = ref(null);
const isPageLoading = ref(true);

const fetchTurnos = async () => {
  isPageLoading.value = true;
  try {
    const fetchedTurnos = await turnoStore.getTurnos();
    // Sort by ID in descending order to show the latest first
    turnos.value = fetchedTurnos.sort((a, b) => b.id - a.id);
  } catch (error) {
    notificationStore.show('Error al cargar los turnos.', 'error');
  } finally {
    isPageLoading.value = false;
  }
};

const deleteTurno = async (id) => {
  deletingTurnoId.value = id;
  await nextTick();
  try {
    await turnoStore.deleteTurno(id);
    await fetchTurnos(); // Recargar la lista después de eliminar
    notificationStore.show('Turno eliminado correctamente.');
  } catch (error) {
    notificationStore.show(error.message, 'error');
  } finally {
    deletingTurnoId.value = null;
  }
};

const showTurnoSummary = (id) => {
  router.push({ name: 'TurnoSummary', params: { id } });
};

onMounted(() => {
  fetchTurnos();
});
</script>
