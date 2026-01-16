<template>
  <v-container>
    <h2 class="text-h4 mb-4">Análisis de Ventas</h2>

    <!-- Date Range Selector -->
    <v-card class="mb-6">
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="startDate"
              label="Fecha de Inicio"
              type="date"
              required
              :disabled="isLoading"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="endDate"
              label="Fecha de Fin"
              type="date"
              required
              :disabled="isLoading"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-btn @click="generateReport" color="primary" block :loading="isLoading" :disabled="isLoading">
              Generar Análisis
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <div v-if="isLoading" class="text-center mt-10">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4">Generando análisis...</p>
    </div>

    <div v-else-if="!hasGeneratedReport" class="text-center mt-10">
        <v-alert type="info" variant="tonal">
            Seleccione un rango de fechas y genere un análisis para ver los resultados.
        </v-alert>
    </div>

    <div v-else>
      <!-- Snack Profit Section -->
      <v-card class="mb-6">
        <v-card-title>Balance de Venta de Productos ({{ snackProfit.startDate }} a {{ snackProfit.endDate }})</v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="12" md="4">
                    <v-card color="green-lighten-5" class="text-center">
                        <v-card-title>Ingresos Totales</v-card-title>
                        <v-card-text class="text-h5 font-weight-bold">S/ {{ snackProfit.totalRevenue.toFixed(2) }}</v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" md="4">
                    <v-card color="orange-lighten-5" class="text-center">
                        <v-card-title>Costo Total</v-card-title>
                        <v-card-text class="text-h5 font-weight-bold">S/ {{ snackProfit.totalCost.toFixed(2) }}</v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" md="4">
                    <v-card color="blue-lighten-5" class="text-center">
                        <v-card-title>Ganancia Bruta</v-card-title>
                        <v-card-text class="text-h5 font-weight-bold">S/ {{ snackProfit.totalProfit.toFixed(2) }}</v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-card-text>
      </v-card>

      <!-- Best Sellers Section -->
      <v-card>
        <v-card-title>Productos Más Vendidos</v-card-title>
        <v-row>
            <v-col cols="12" md="6">
                <v-card-text>
                    <v-table>
                        <thead>
                            <tr>
                                <th class="text-left">Producto</th>
                                <th class="text-left">Unidades Vendidas</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in bestSellers" :key="item.productId">
                                <td>{{ item.productName }}</td>
                                <td>{{ item.totalQuantitySold }}</td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-card-text>
            </v-col>
            <v-col cols="12" md="6">
                 <v-card-text>
                    <Bar v-if="chartData.labels.length" :data="chartData" :options="chartOptions" />
                 </v-card-text>
            </v-col>
        </v-row>
      </v-card>
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useReportStore } from '@/stores/report';
import { useNotificationStore } from '@/stores/notification';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const reportStore = useReportStore();
const notificationStore = useNotificationStore();

const isLoading = ref(false);
const hasGeneratedReport = ref(false);

const today = new Date();
const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().substr(0, 10);
const todayStr = today.toISOString().substr(0, 10);

const startDate = ref(firstDayOfMonth);
const endDate = ref(todayStr);

const bestSellers = computed(() => reportStore.bestSellers);
const snackProfit = computed(() => reportStore.snackProfit);

const generateReport = async () => {
  if (!startDate.value || !endDate.value) {
    notificationStore.show('Por favor, seleccione ambas fechas.', 'error');
    return;
  }
  isLoading.value = true;
  hasGeneratedReport.value = false;
  try {
    await Promise.all([
      reportStore.fetchBestSellers(startDate.value, endDate.value),
      reportStore.fetchSnackProfit(startDate.value, endDate.value)
    ]);
    hasGeneratedReport.value = true;
  } catch (error) {
    notificationStore.show(error.message, 'error');
  } finally {
    isLoading.value = false;
  }
};

const chartData = computed(() => {
    const topSellers = bestSellers.value.slice(0, 10); // Top 10 products
    return {
        labels: topSellers.map(p => p.productName),
        datasets: [
            {
                label: 'Unidades Vendidas',
                backgroundColor: '#42A5F5',
                data: topSellers.map(p => p.totalQuantitySold),
            },
        ],
    };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

</script>
