<template>
  <v-container>
    <div v-if="isPageLoading" class="text-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p>Cargando Resumen de Turnos...</p>
    </div>
    <div v-else>
      <h2 class="text-h4 mb-4">Resumen de Turnos y Métricas</h2>

      <!-- Filtros -->
      <v-card class="mb-6 bg-grey-lighten-4">
        <v-card-text>
          <v-row dense align="center">
            <v-col cols="12" md="4">
              <v-select
                v-model="selectedUser"
                :items="availableUsers"
                label="Filtrar por Usuario(s)"
                hide-details
                density="compact"
                variant="outlined"
                bg-color="white"
                multiple
                chips
                closable-chips
              ></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="selectedMonth"
                :items="months"
                item-title="text"
                item-value="value"
                label="Mes"
                hide-details
                density="compact"
                variant="outlined"
                bg-color="white"
              ></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="selectedYear"
                :items="years"
                label="Año"
                hide-details
                density="compact"
                variant="outlined"
                bg-color="white"
              ></v-select>
            </v-col>
            <v-col cols="12" md="2" class="text-right">
              <v-btn color="secondary" variant="text" @click="resetFilters">Limpiar Filtros</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Tarjetas de Resumen (Métricas) -->
      <v-row class="mb-4">
        <!-- Métricas de Trabajo -->
        <v-col cols="12" sm="6" md="2">
          <v-card color="indigo-lighten-1" theme="dark" height="100%">
            <v-card-title class="text-caption">Días Trabajados</v-card-title>
            <v-card-text class="text-h5 font-weight-bold">
              {{ metrics.diasTrabajados }}
            </v-card-text>
          </v-card>
        </v-col>
         <v-col cols="12" sm="6" md="2">
          <v-card color="deep-orange-lighten-1" theme="dark" height="100%">
            <v-card-title class="text-caption">Total Consumos</v-card-title>
            <v-card-text class="text-h5 font-weight-bold">
              S/ {{ metrics.totalConsumo.toFixed(2) }}
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Métricas Financieras -->
        <v-col cols="12" sm="6" md="2">
          <v-card color="green-darken-1" theme="dark" height="100%">
            <v-card-title class="text-caption">Efectivo Total</v-card-title>
            <v-card-text class="text-h5 font-weight-bold">
              S/ {{ metrics.totalEfectivo.toFixed(2) }}
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="2">
          <v-card color="purple-darken-1" theme="dark" height="100%">
            <v-card-title class="text-caption">Yape Total</v-card-title>
            <v-card-text class="text-h5 font-weight-bold">
              S/ {{ metrics.totalYape.toFixed(2) }}
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="2">
          <v-card color="blue-darken-1" theme="dark" height="100%">
            <v-card-title class="text-caption">Total Dinero PCs</v-card-title>
            <v-card-text class="text-h5 font-weight-bold">
              S/ {{ metrics.totalDineroPcs.toFixed(2) }}
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="2">
          <v-card :color="metrics.totalDiferencia >= 0 ? 'red-darken-2' : 'teal-darken-2'" theme="dark" height="100%">
            <v-card-title class="text-caption">Diferencia (Descuadre)</v-card-title>
            <v-card-text class="text-h5 font-weight-bold">
              S/ {{ metrics.totalDiferencia.toFixed(2) }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Tabla de Datos -->
      <v-card>
        <v-card-text>
            <v-table density="compact" hover>
              <thead>
                <tr>
                  <th class="text-left">Registrado por</th>
                  <th class="text-left">Fecha</th>
                  <th class="text-left">Horario</th>
                  <th class="text-left text-green">Efectivo</th>
                  <th class="text-left text-purple">Yape</th>
                  <th class="text-left text-deep-orange">Consumo</th>
                  <th class="text-left">DINEROPCS</th>
                  <th class="text-left">Retiros</th>
                  <th class="text-left">KW Cons.</th>
                  <th class="text-left">Diferencia</th>
                  <th v-if="authStore.isAdmin" class="text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="turno in filteredTurnos" :key="turno.id" @click="showTurnoSummary(turno.id)" style="cursor: pointer">
                  <td class="font-weight-medium">{{ turno.userName }}</td>
                  <td>{{ formatDate(turno.fecha) }}</td>
                  <td class="text-caption">{{ turno.horaEntrada }} - {{ turno.horaSalida }}</td>
                  <td class="text-green-darken-2 font-weight-bold">{{ turno.efectivo.toFixed(2) }}</td>
                  <td class="text-purple-darken-2">{{ turno.yape.toFixed(2) }}</td>
                  <td class="text-deep-orange-darken-2">{{ turno.consumo.toFixed(2) }}</td>
                  <td>{{ (turno.efectivo + turno.yape - turno.snacks).toFixed(2) }}</td>
                  <td>{{ turno.retiros.toFixed(2) }}</td>
                  <td>{{ turno.kwConsumidos }}</td>
                  <td :class="calculateDiferencia(turno) >= 0 ? 'text-red font-weight-bold' : 'text-teal'">
                    {{ calculateDiferencia(turno).toFixed(2) }}
                  </td>
                  <td v-if="authStore.isAdmin">
                    <v-btn icon="mdi-pencil" size="small" variant="text" color="primary" @click.stop="editTurno(turno.id)"></v-btn>
                    <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click.stop="deleteTurno(turno.id)" :loading="deletingTurnoId === turno.id" :disabled="!!deletingTurnoId"></v-btn>
                  </td>
                </tr>
                <tr v-if="filteredTurnos.length === 0">
                  <td colspan="11" class="text-center text-grey pa-4">No se encontraron turnos con los filtros seleccionados.</td>
                </tr>
              </tbody>
            </v-table>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, watch } from 'vue';
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

// --- Filtros ---
const currentYear = new Date().getFullYear();
const selectedYear = ref(currentYear);
const selectedMonth = ref(new Date().getMonth() + 1); // 1-12
const selectedUser = ref(['Todos']);

const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
const months = [
  { text: 'Todos', value: 'all' },
  { text: 'Enero', value: 1 }, { text: 'Febrero', value: 2 }, { text: 'Marzo', value: 3 },
  { text: 'Abril', value: 4 }, { text: 'Mayo', value: 5 }, { text: 'Junio', value: 6 },
  { text: 'Julio', value: 7 }, { text: 'Agosto', value: 8 }, { text: 'Septiembre', value: 9 },
  { text: 'Octubre', value: 10 }, { text: 'Noviembre', value: 11 }, { text: 'Diciembre', value: 12 },
];

// Obtener usuarios únicos de los turnos cargados
const availableUsers = computed(() => {
  const users = new Set(turnos.value.map(t => t.userName));
  return ['Todos', ...Array.from(users)];
});

// Lógica inteligente para selección múltiple de usuarios
watch(selectedUser, (newVal, oldVal) => {
  if (newVal.includes('Todos')) {
    if (newVal.length > 1 && !oldVal.includes('Todos')) {
      // Si el usuario selecciona "Todos" manualmente, limpiamos el resto
      selectedUser.value = ['Todos'];
    } else if (newVal.length > 1 && oldVal.includes('Todos')) {
      // Si "Todos" estaba seleccionado y se selecciona otro usuario, quitamos "Todos"
      selectedUser.value = newVal.filter(u => u !== 'Todos');
    }
  } else if (newVal.length === 0) {
    // Si no queda nada seleccionado, volvemos a "Todos"
    selectedUser.value = ['Todos'];
  }
});

// --- Lógica de Filtrado y Métricas ---

const calculateDiferencia = (turno) => {
  return (turno.dineroPancafe + turno.snacks - turno.retiros - turno.consumo - turno.efectivo - turno.yape);
};

const filteredTurnos = computed(() => {
  return turnos.value.filter(turno => {
    // Ajuste de fecha
    const [year, month] = turno.fecha.split('-').map(Number);
    
    const matchYear = selectedYear.value === 'all' || year === selectedYear.value;
    const matchMonth = selectedMonth.value === 'all' || month === selectedMonth.value;
    
    const matchUser = selectedUser.value.includes('Todos') || selectedUser.value.includes(turno.userName);

    return matchYear && matchMonth && matchUser;
  });
});

const metrics = computed(() => {
  const data = filteredTurnos.value;
  // Usamos un Set para contar días únicos (basado en la fecha)
  const uniqueDays = new Set(data.map(t => t.fecha));

  return data.reduce((acc, turno) => {
    acc.totalEfectivo += turno.efectivo;
    acc.totalYape += turno.yape;
    acc.totalConsumo += turno.consumo; // Nueva métrica
    acc.totalDineroPcs += (turno.efectivo + turno.yape - turno.snacks); 
    acc.totalDiferencia += calculateDiferencia(turno);
    return acc;
  }, { 
    totalEfectivo: 0, 
    totalYape: 0, 
    totalConsumo: 0,
    totalDineroPcs: 0, 
    totalDiferencia: 0,
    diasTrabajados: uniqueDays.size // Nueva métrica
  });
});

const resetFilters = () => {
  selectedYear.value = currentYear;
  selectedMonth.value = new Date().getMonth() + 1;
  selectedUser.value = ['Todos'];
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

// --- Carga de Datos ---

const fetchTurnos = async () => {
  isPageLoading.value = true;
  try {
    const fetchedTurnos = await turnoStore.getTurnos();
    // Ordenar descendente por ID
    const sortedTurnos = fetchedTurnos.sort((a, b) => b.id - a.id);

    // Procesar KW Consumidos
    const processedTurnos = sortedTurnos.map((turno, index) => {
      const previousTurn = sortedTurnos[index + 1];
      let kwConsumidos = 'N/A';
      if (previousTurn) {
        const currentKw = parseFloat(turno.kw);
        const previousKw = parseFloat(previousTurn.kw);
        if (!isNaN(currentKw) && !isNaN(previousKw)) {
          kwConsumidos = (currentKw - previousKw).toFixed(2);
        }
      }
      return { ...turno, kwConsumidos };
    });

    turnos.value = processedTurnos;

  } catch (error) {
    notificationStore.show('Error al cargar los turnos.', 'error');
  } finally {
    isPageLoading.value = false;
  }
};

const editTurno = (id) => {
  router.push({ name: 'EditarTurno', params: { id } });
};

const deleteTurno = async (id) => {
  deletingTurnoId.value = id;
  await nextTick();
  try {
    await turnoStore.deleteTurno(id);
    await fetchTurnos(); 
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