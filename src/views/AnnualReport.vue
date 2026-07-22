<template>
  <v-container fluid class="pa-4">
    <div class="d-flex align-center mb-4">
      <v-icon icon="mdi-calendar-multiselect" size="36" color="primary" class="mr-3"></v-icon>
      <div>
        <h2 class="text-h4 font-weight-bold text-primary mb-0">Informe Anual</h2>
        <p class="text-subtitle-2 text-grey-darken-1 mb-0">Resumen consolidado mes por mes de métricas financieras y operativas</p>
      </div>
    </div>

    <!-- Selector de Año -->
    <v-card class="mb-6 elevation-3 rounded-lg">
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" sm="8" md="4">
            <v-select
              v-model="selectedYear"
              :items="years"
              label="Seleccionar Año"
              prepend-inner-icon="mdi-calendar"
              variant="outlined"
              density="compact"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" sm="4" md="3">
            <v-btn @click="generateReport" color="primary" :loading="isLoading" prepend-icon="mdi-chart-areaspline" block size="large">
              Generar Informe
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Loading state -->
    <div v-if="isLoading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4 text-subtitle-1 text-grey-darken-1">Cargando datos del informe anual...</p>
    </div>

    <!-- Contenido del Reporte -->
    <div v-if="!isLoading && report">
      <!-- Tarjetas Resumen de Métricas Clave -->
      <v-row class="mb-2">
        <v-col cols="12" sm="6" md="3">
          <v-card class="rounded-lg elevation-2 border-left-primary pa-3">
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="text-caption text-uppercase text-grey-darken-1 font-weight-medium">DINEROPCS Total</div>
                <div class="text-h5 font-weight-bold text-blue-darken-2">S/ {{ (report.totalDineroPcsAño || 0).toFixed(2) }}</div>
              </div>
              <v-avatar color="blue-lighten-4" size="44">
                <v-icon icon="mdi-laptop" color="blue-darken-3"></v-icon>
              </v-avatar>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card class="rounded-lg elevation-2 border-left-amber pa-3">
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="text-caption text-uppercase text-grey-darken-1 font-weight-medium">DINEROPANCAFE Total</div>
                <div class="text-h5 font-weight-bold text-amber-darken-3">S/ {{ (report.totalDineroPancafeAño || 0).toFixed(2) }}</div>
              </div>
              <v-avatar color="amber-lighten-4" size="44">
                <v-icon icon="mdi-coffee" color="amber-darken-4"></v-icon>
              </v-avatar>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card class="rounded-lg elevation-2 border-left-emerald pa-3">
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="text-caption text-uppercase text-grey-darken-1 font-weight-medium">USANZAPANCAFE Total</div>
                <div class="text-h5 font-weight-bold text-green-darken-2">S/ {{ (report.totalUsanzaPancafeAño || 0).toFixed(2) }}</div>
              </div>
              <v-avatar color="green-lighten-4" size="44">
                <v-icon icon="mdi-chart-line" color="green-darken-3"></v-icon>
              </v-avatar>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card class="rounded-lg elevation-2 border-left-cyan pa-3">
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="text-caption text-uppercase text-grey-darken-1 font-weight-medium">EFECTIVO Total</div>
                <div class="text-h5 font-weight-bold text-cyan-darken-3">S/ {{ (report.totalEfectivoAño || 0).toFixed(2) }}</div>
              </div>
              <v-avatar color="cyan-lighten-4" size="44">
                <v-icon icon="mdi-cash" color="cyan-darken-3"></v-icon>
              </v-avatar>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mb-4">
        <v-col cols="12" sm="6" md="3">
          <v-card class="rounded-lg elevation-2 border-left-purple pa-3">
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="text-caption text-uppercase text-grey-darken-1 font-weight-medium">YAPE Total</div>
                <div class="text-h5 font-weight-bold text-purple-darken-2">S/ {{ (report.totalYapeAño || 0).toFixed(2) }}</div>
              </div>
              <v-avatar color="purple-lighten-4" size="44">
                <v-icon icon="mdi-cellphone-text" color="purple-darken-3"></v-icon>
              </v-avatar>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card class="rounded-lg elevation-2 border-left-orange pa-3">
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="text-caption text-uppercase text-grey-darken-1 font-weight-medium">SNACKS Total</div>
                <div class="text-h5 font-weight-bold text-deep-orange-darken-2">S/ {{ (report.totalSnacksAño || 0).toFixed(2) }}</div>
              </div>
              <v-avatar color="deep-orange-lighten-4" size="44">
                <v-icon icon="mdi-food" color="deep-orange-darken-3"></v-icon>
              </v-avatar>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card class="rounded-lg elevation-2 border-left-indigo pa-3">
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="text-caption text-uppercase text-grey-darken-1 font-weight-medium">Promedio RATIO KW</div>
                <div class="text-h5 font-weight-bold text-indigo-darken-2">{{ (report.promedioRatioKwAño || 0).toFixed(2) }}</div>
              </div>
              <v-avatar color="indigo-lighten-4" size="44">
                <v-icon icon="mdi-lightning-bolt" color="indigo-darken-3"></v-icon>
              </v-avatar>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card class="rounded-lg elevation-2 pa-3" :class="report.balanceAño >= 0 ? 'border-left-teal bg-teal-lighten-5' : 'border-left-red bg-red-lighten-5'">
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="text-caption text-uppercase font-weight-bold" :class="report.balanceAño >= 0 ? 'text-teal-darken-4' : 'text-red-darken-4'">BALANCE ANUAL</div>
                <div class="text-h5 font-weight-bold" :class="report.balanceAño >= 0 ? 'text-teal-darken-3' : 'text-red-darken-3'">S/ {{ (report.balanceAño || 0).toFixed(2) }}</div>
              </div>
              <v-avatar :color="report.balanceAño >= 0 ? 'teal-lighten-4' : 'red-lighten-4'" size="44">
                <v-icon :icon="report.balanceAño >= 0 ? 'mdi-scale-balance' : 'mdi-alert-circle'" :color="report.balanceAño >= 0 ? 'teal-darken-3' : 'red-darken-3'"></v-icon>
              </v-avatar>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Gráficos del Reporte Anual -->
      <v-row class="mb-6">
        <v-col cols="12" md="6">
          <v-card class="elevation-3 rounded-lg pa-4">
            <v-card-title class="text-h6 font-weight-bold text-grey-darken-3 mb-2">
              <v-icon icon="mdi-chart-bar" color="primary" class="mr-2"></v-icon>
              Comparativa Mensual: EFECTIVO + YAPE vs GASTOS
            </v-card-title>
            <div style="height: 320px;">
              <Bar v-if="chartData.labels.length" :data="chartData" :options="chartOptions" />
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card class="elevation-3 rounded-lg pa-4">
            <v-card-title class="text-h6 font-weight-bold text-grey-darken-3 mb-2">
              <v-icon icon="mdi-chart-multiline" color="deep-purple" class="mr-2"></v-icon>
              Pancafe vs. Ratio KW por Mes
            </v-card-title>
            <div style="height: 320px;">
              <Bar v-if="pancafeChartData.labels.length" :data="pancafeChartData" :options="pancafeChartOptions" />
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Tabla Desglosada Mes por Mes -->
      <v-card class="elevation-4 rounded-lg overflow-hidden mb-6">
        <v-card-title class="bg-primary text-white py-3 px-4 font-weight-bold text-h6">
          <v-icon icon="mdi-table" class="mr-2"></v-icon>
          Resumen Consolidado Mes por Mes ({{ report.year }})
        </v-card-title>

        <v-table hover density="comfortable" class="annual-table">
          <thead>
            <tr class="bg-grey-lighten-3 text-uppercase text-caption font-weight-bold">
              <th>Mes</th>
              <th class="text-right">DINEROPCS</th>
              <th class="text-right">DINEROPANCAFE</th>
              <th class="text-right">USANZAPANCAFE</th>
              <th class="text-right">EFECTIVO</th>
              <th class="text-right">YAPE</th>
              <th class="text-right">SNACKS</th>
              <th class="text-right">RETIROS</th>
              <th class="text-right">GASTOS</th>
              <th class="text-right">KW CONSUMIDOS</th>
              <th class="text-right">RATIO KW</th>
              <th class="text-right">BALANCE</th>
            </tr>
          </thead>
          <tbody>
            <!-- Fila Totales del Año -->
            <tr class="font-weight-bold bg-blue-lighten-5 text-blue-darken-4 border-bottom-2">
              <td><strong>TOTALES {{ report.year }}</strong></td>
              <td class="text-right"><strong>S/ {{ (report.totalDineroPcsAño || 0).toFixed(2) }}</strong></td>
              <td class="text-right"><strong>S/ {{ (report.totalDineroPancafeAño || 0).toFixed(2) }}</strong></td>
              <td class="text-right"><strong>S/ {{ (report.totalUsanzaPancafeAño || 0).toFixed(2) }}</strong></td>
              <td class="text-right"><strong>S/ {{ (report.totalEfectivoAño || 0).toFixed(2) }}</strong></td>
              <td class="text-right"><strong>S/ {{ (report.totalYapeAño || 0).toFixed(2) }}</strong></td>
              <td class="text-right"><strong>S/ {{ (report.totalSnacksAño || 0).toFixed(2) }}</strong></td>
              <td class="text-right"><strong>S/ {{ (report.totalRetirosAño || 0).toFixed(2) }}</strong></td>
              <td class="text-right"><strong>S/ {{ (report.totalGastosAño || 0).toFixed(2) }}</strong></td>
              <td class="text-right"><strong>{{ (report.totalKwConsumidosAño || 0).toFixed(2) }}</strong></td>
              <td class="text-right"><strong>{{ (report.promedioRatioKwAño || 0).toFixed(2) }}</strong></td>
              <td class="text-right" :class="report.balanceAño >= 0 ? 'text-teal-darken-3' : 'text-red-darken-3'">
                <strong>S/ {{ (report.balanceAño || 0).toFixed(2) }}</strong>
              </td>
            </tr>

            <!-- Filas Mes a Mes -->
            <tr v-for="m in report.monthlySummaries" :key="m.month">
              <td class="font-weight-medium">{{ m.monthName }}</td>
              <td class="text-right">S/ {{ (m.totalDineroPcs || 0).toFixed(2) }}</td>
              <td class="text-right">S/ {{ (m.totalDineroPancafe || 0).toFixed(2) }}</td>
              <td class="text-right">S/ {{ (m.totalUsanzaPancafe || 0).toFixed(2) }}</td>
              <td class="text-right">S/ {{ (m.totalEfectivo || 0).toFixed(2) }}</td>
              <td class="text-right">S/ {{ (m.totalYape || 0).toFixed(2) }}</td>
              <td class="text-right">S/ {{ (m.totalSnacks || 0).toFixed(2) }}</td>
              <td class="text-right">S/ {{ (m.totalRetiros || 0).toFixed(2) }}</td>
              <td class="text-right text-red-darken-2">S/ {{ (m.totalGastos || 0).toFixed(2) }}</td>
              <td class="text-right">{{ (m.totalKwConsumidos || 0).toFixed(2) }}</td>
              <td class="text-right">{{ (m.promedioRatioKw || 0).toFixed(2) }}</td>
              <td class="text-right font-weight-bold" :class="m.balance >= 0 ? 'text-teal-darken-2' : 'text-red-darken-2'">
                S/ {{ (m.balance || 0).toFixed(2) }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </div>

    <v-alert v-if="!isLoading && !report" type="info" variant="tonal" icon="mdi-information-outline" class="mt-6">
      Seleccione un año y haga clic en "Generar Informe" para consultar los datos acumulados.
    </v-alert>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useReportStore } from '@/stores/report';
import { useNotificationStore } from '@/stores/notification';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, LineController, BarController } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, LineController, BarController);

const reportStore = useReportStore();
const notificationStore = useNotificationStore();

const isLoading = ref(false);
const report = computed(() => reportStore.annualReport);

const currentYear = new Date().getFullYear();
const selectedYear = ref(currentYear);
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

const generateReport = async () => {
  isLoading.value = true;
  reportStore.annualReport = null;
  try {
    await reportStore.fetchAnnualReport(selectedYear.value);
  } catch (error) {
    notificationStore.show(error.message, 'error');
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  generateReport();
});

const chartData = computed(() => {
  const labels = report.value?.monthlySummaries.map(m => m.monthName) || [];
  const ingresos = report.value?.monthlySummaries.map(m => (m.totalEfectivo + m.totalYape)) || [];
  const gastos = report.value?.monthlySummaries.map(m => m.totalGastos) || [];

  return {
    labels,
    datasets: [
      {
        label: 'Ingresos (Efectivo + Yape)',
        backgroundColor: '#4CAF50',
        data: ingresos
      },
      {
        label: 'Gastos',
        backgroundColor: '#F44336',
        data: gastos
      }
    ]
  };
});

const pancafeChartData = computed(() => {
  const labels = report.value?.monthlySummaries.map(m => m.monthName) || [];
  const dineroPancafe = report.value?.monthlySummaries.map(m => m.totalDineroPancafe) || [];
  const usanzaPancafe = report.value?.monthlySummaries.map(m => m.totalUsanzaPancafe) || [];
  const ratioKw = report.value?.monthlySummaries.map(m => m.promedioRatioKw) || [];

  return {
    labels,
    datasets: [
      {
        type: 'bar',
        label: 'Dinero Pancafe (S/)',
        backgroundColor: '#FFA726',
        data: dineroPancafe,
        yAxisID: 'y'
      },
      {
        type: 'bar',
        label: 'Usanza Pancafe (S/)',
        backgroundColor: '#66BB6A',
        data: usanzaPancafe,
        yAxisID: 'y'
      },
      {
        type: 'line',
        label: 'Ratio KW',
        borderColor: '#AB47BC',
        backgroundColor: '#AB47BC',
        data: ratioKw,
        yAxisID: 'y1',
        tension: 0.3,
        pointRadius: 4
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' }
  }
};

const pancafeChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false
  },
  scales: {
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      title: { display: true, text: 'Monto (S/)' }
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      grid: { drawOnChartArea: false },
      title: { display: true, text: 'Ratio KW' }
    }
  }
};
</script>

<style scoped>
.border-left-primary { border-left: 5px solid #1976D2 !important; }
.border-left-amber { border-left: 5px solid #FFB300 !important; }
.border-left-emerald { border-left: 5px solid #2E7D32 !important; }
.border-left-cyan { border-left: 5px solid #00ACC1 !important; }
.border-left-purple { border-left: 5px solid #8E24AA !important; }
.border-left-orange { border-left: 5px solid #F4511E !important; }
.border-left-indigo { border-left: 5px solid #3F51B5 !important; }
.border-left-teal { border-left: 5px solid #009688 !important; }
.border-left-red { border-left: 5px solid #E53935 !important; }
.border-bottom-2 { border-bottom: 2px solid #90A4AE !important; }
</style>
