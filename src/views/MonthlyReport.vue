<template>
  <v-container>
    <h2 class="text-h4 mb-4">Informe Mensual</h2>

    <!-- Selectors for Year and Month -->
    <v-card class="mb-6">
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="4">
            <v-select
              v-model="selectedYear"
              :items="years"
              label="Año"
              required
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="selectedMonth"
              :items="months"
              item-title="text"
              item-value="value"
              label="Mes"
              required
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-btn @click="generateReport" color="primary" :loading="isLoading" block>
              Generar Informe
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Report Display -->
    <div v-if="isLoading" class="text-center">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4">Generando informe...</p>
    </div>

    <div v-if="!isLoading && report">
      <!-- Averages Summary Cards -->
      <v-row>
        <v-col cols="12" md="4">
          <v-card color="blue-lighten-5">
            <v-card-title>Promedio DINEROPCS / Día</v-card-title>
            <v-card-text class="text-h5">S/ {{ promedioDineroPcs.toFixed(2) }}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card color="green-lighten-5">
            <v-card-title>Promedio Usanza Pancafe / Día</v-card-title>
            <v-card-text class="text-h5">S/ {{ promedioUsanzaPancafe.toFixed(2) }}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card color="orange-lighten-5">
            <v-card-title>Promedio Retiros / Día</v-card-title>
            <v-card-text class="text-h5">S/ {{ promedioRetiros.toFixed(2) }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Charts -->
      <v-row class="mt-6">
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>Ingresos vs. Gastos Diarios</v-card-title>
            <v-card-text>
              <Bar v-if="chartData.labels.length" :data="chartData" :options="chartOptions" />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>Usuarios por Día</v-card-title>
            <v-card-text>
              <Line v-if="userChartData.labels.length" :data="userChartData" :options="chartOptions" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Daily Summary Table -->
      <v-card class="mt-6">
        <v-card-title>Resumen Diario</v-card-title>
        <v-card-text>
          <v-table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>DINEROPCS</th>
                <th>DINEROPANCAFE</th>
                <th>USANZAPANCAFE</th>
                <th>EFECTIVO</th>
                <th>YAPE</th>
                <th>SNACKS</th>
                <th>RETIROS</th>
                <th>KWCONSUMIDOS</th>
                <th>Diferencia (Descuadre)</th>
              </tr>
            </thead>
            <tbody>
              <tr class="font-weight-bold bg-blue-grey-lighten-5">
                <td><strong>Totales</strong></td>
                <td><strong>S/ {{ totalDineroPcs.toFixed(2) }}</strong></td>
                <td><strong>S/ {{ totalDineroPancafe.toFixed(2) }}</strong></td>
                <td><strong>S/ {{ totalUsanzaPancafe.toFixed(2) }}</strong></td>
                <td><strong>S/ {{ totalEfectivo.toFixed(2) }}</strong></td>
                <td><strong>S/ {{ totalYape.toFixed(2) }}</strong></td>
                <td><strong>S/ {{ totalSnacks.toFixed(2) }}</strong></td>
                <td><strong>S/ {{ totalRetiros.toFixed(2) }}</strong></td>
                <td><strong>{{ totalKwConsumidos.toFixed(2) }}</strong></td>
                <td><strong>S/ {{ totalDiferenciaDia.toFixed(2) }}</strong></td>
              </tr>
              <tr v-for="day in report.dailySummaries" :key="day.date">
                <td>{{ day.date }}</td>
                <td>S/ {{ calculateDineroPcs(day).toFixed(2) }}</td>
                <td>S/ {{ day.totalDineroPancafe.toFixed(2) }}</td>
                <td>S/ {{ day.totalUsanzaPancafe.toFixed(2) }}</td>
                <td>S/ {{ day.totalEfectivo.toFixed(2) }}</td>
                <td>S/ {{ day.totalYape.toFixed(2) }}</td>
                <td>S/ {{ day.totalSnacks.toFixed(2) }}</td>
                <td>S/ {{ day.totalRetiros.toFixed(2) }}</td>
                <td>{{ day.kwConsumidos.toFixed(2) }}</td>
                <td>S/ {{ day.diferenciaDia.toFixed(2) }}</td>
              </tr>
            </tbody>

          </v-table>
        </v-card-text>
      </v-card>
    </div>
    <v-alert v-if="!isLoading && !report" type="info" class="mt-6">
      Seleccione un año y mes y presione "Generar Informe" para ver los datos.
    </v-alert>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useReportStore } from '@/stores/report';
import { useNotificationStore } from '@/stores/notification';
import { Bar, Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement);

const reportStore = useReportStore();
const notificationStore = useNotificationStore();

const isLoading = ref(false);
const report = computed(() => reportStore.monthlyReport);

const currentYear = new Date().getFullYear();
const selectedYear = ref(currentYear);
const selectedMonth = ref(new Date().getMonth() + 1);

const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
const months = [
  { text: 'Enero', value: 1 }, { text: 'Febrero', value: 2 }, { text: 'Marzo', value: 3 },
  { text: 'Abril', value: 4 }, { text: 'Mayo', value: 5 }, { text: 'Junio', value: 6 },
  { text: 'Julio', value: 7 }, { text: 'Agosto', value: 8 }, { text: 'Septiembre', value: 9 },
  { text: 'Octubre', value: 10 }, { text: 'Noviembre', value: 11 }, { text: 'Diciembre', value: 12 },
];

const generateReport = async () => {
  isLoading.value = true;
  reportStore.monthlyReport = null; // Clear previous report
  try {
    await reportStore.fetchMonthlyReport(selectedYear.value, selectedMonth.value);
  } catch (error) {
    notificationStore.show(error.message, 'error');
  } finally {
    isLoading.value = false;
  }
};

const chartData = computed(() => {
  const labels = report.value?.dailySummaries.map(d => d.date) || [];
  const incomeData = report.value?.dailySummaries.map(d => d.totalIngresos) || [];
  const expenseData = report.value?.dailySummaries.map(d => d.totalGastos) || [];
  return {
    labels,
    datasets: [
      {
        label: 'Ingresos',
        backgroundColor: '#4CAF50',
        data: incomeData,
      },
      {
        label: 'Gastos',
        backgroundColor: '#F44336',
        data: expenseData,
      },
    ],
  };
});

const userChartData = computed(() => {
  const labels = report.value?.dailySummaries.map(d => d.date) || [];
  const userData = report.value?.dailySummaries.map(d => d.totalUsuarios) || [];
  return {
    labels,
    datasets: [
      {
        label: 'Número de Usuarios',
        backgroundColor: '#2196F3',
        borderColor: '#2196F3',
        data: userData,
        fill: false,
      },
    ],
  };
});

const calculateDineroPcs = (day) => {
  return day.totalEfectivo + day.totalYape - day.totalSnacks;
};

// Totals for the footer
const totalDineroPcs = computed(() => {
  if (!report.value?.dailySummaries) return 0;
  return report.value.dailySummaries.reduce((acc, day) => acc + calculateDineroPcs(day), 0);
});
const totalDineroPancafe = computed(() => {
  if (!report.value?.dailySummaries) return 0;
  return report.value.dailySummaries.reduce((acc, day) => acc + day.totalDineroPancafe, 0);
});
const totalUsanzaPancafe = computed(() => {
  if (!report.value?.dailySummaries) return 0;
  return report.value.dailySummaries.reduce((acc, day) => acc + day.totalUsanzaPancafe, 0);
});
const totalEfectivo = computed(() => {
  if (!report.value?.dailySummaries) return 0;
  return report.value.dailySummaries.reduce((acc, day) => acc + day.totalEfectivo, 0);
});
const totalYape = computed(() => {
  if (!report.value?.dailySummaries) return 0;
  return report.value.dailySummaries.reduce((acc, day) => acc + day.totalYape, 0);
});
const totalSnacks = computed(() => {
  if (!report.value?.dailySummaries) return 0;
  return report.value.dailySummaries.reduce((acc, day) => acc + day.totalSnacks, 0);
});
const totalRetiros = computed(() => {
  if (!report.value?.dailySummaries) return 0;
  return report.value.dailySummaries.reduce((acc, day) => acc + day.totalRetiros, 0);
});
const totalKwConsumidos = computed(() => {
  if (!report.value?.dailySummaries) return 0;
  return report.value.dailySummaries.reduce((acc, day) => acc + day.kwConsumidos, 0);
});
const totalDiferenciaDia = computed(() => {
  if (!report.value?.dailySummaries) return 0;
  return report.value.dailySummaries.reduce((acc, day) => acc + day.diferenciaDia, 0);
});

// Averages for the new summary cards
const numeroDeDias = computed(() => report.value?.dailySummaries?.length || 0);

const promedioDineroPcs = computed(() => {
  if (numeroDeDias.value === 0) return 0;
  return totalDineroPcs.value / numeroDeDias.value;
});

const promedioUsanzaPancafe = computed(() => {
  if (numeroDeDias.value === 0) return 0;
  return totalUsanzaPancafe.value / numeroDeDias.value;
});

const promedioRetiros = computed(() => {
  if (numeroDeDias.value === 0) return 0;
  return totalRetiros.value / numeroDeDias.value;
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>
