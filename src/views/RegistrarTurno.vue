<template>
  <v-container>
    <h2 class="text-h4 mb-4">Registrar Turno</h2>

    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Movimientos de Inventario</v-card-title>
          <v-card-text>
            <v-btn color="primary" @click="movementDialog = true" :disabled="isRegistering">Agregar Movimiento</v-btn>
            <v-list lines="two" class="mt-3">
              <v-list-item v-for="movement in sortedMovements" :key="`${movement.productId}-${movement.type}`">
                <v-list-item-title>
                  Producto: <strong>{{ movement.productName }}</strong> - Cantidad: <strong>{{ movement.quantity }}</strong>
                </v-list-item-title>
                <v-list-item-subtitle>
                  Tipo: <v-chip :color="movement.type === 'IN' ? 'success' : 'error'" small><strong>{{ movement.type }}</strong></v-chip>
                </v-list-item-subtitle>
                <template v-slot:append>
                  <v-btn @click="removeMovement(movement)" color="error" icon="mdi-delete" variant="text" :disabled="isRegistering"></v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Detalle de Retiros</v-card-title>
          <v-card-text>
            <v-btn color="primary" @click="retiroDialog = true" :disabled="isRegistering">Agregar Retiro</v-btn>
            <v-list lines="one" class="mt-3">
              <v-list-item v-for="(retiro, index) in retiros" :key="index">
                <v-list-item-title>Descripción: <strong>{{ retiro.description }}</strong></v-list-item-title>
                <v-list-item-subtitle>Monto: <strong>S/ {{ retiro.amount.toFixed(2) }}</strong></v-list-item-subtitle>
                <template v-slot:append>
                  <v-btn @click="removeRetiro(index)" color="error" icon="mdi-delete" variant="text" :disabled="isRegistering"></v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <v-card class="mt-4">
          <v-card-title>Detalle de Yapes</v-card-title>
          <v-card-text>
            <v-btn color="primary" @click="yapeDialog = true" :disabled="isRegistering">Agregar Yape</v-btn>
            <v-list lines="one" class="mt-3">
              <v-list-item v-for="(yape, index) in yapes" :key="index">
                <v-list-item-title>Detalle: <strong>{{ yape.detalle }}</strong></v-list-item-title>
                <v-list-item-subtitle>Monto: <strong>S/ {{ yape.monto.toFixed(2) }}</strong></v-list-item-subtitle>
                <template v-slot:append>
                  <v-btn @click="removeYape(index)" color="error" icon="mdi-delete" variant="text" :disabled="isRegistering"></v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="mt-4">
      <v-card-title>Datos del Turno y Cierre de Caja</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleRegister">
          <v-row>
            <v-col cols="12" md="4"><v-text-field v-model="turno.fecha" label="Fecha" type="date" required :disabled="isRegistering"></v-text-field></v-col>
            <v-col cols="12" md="4"><v-text-field v-model="turno.horaEntrada" label="Hora de Entrada" type="time" required :disabled="isRegistering"></v-text-field></v-col>
            <v-col cols="12" md="4"><v-text-field v-model="turno.horaSalida" label="Hora de Salida" type="time" required :disabled="isRegistering"></v-text-field></v-col>
            <v-col cols="12" md="3"><v-text-field v-model.number="turno.kw" label="KW" type="number" required :disabled="isRegistering"></v-text-field></v-col>
            <v-col cols="12" md="3"><v-text-field v-model.number="turno.usuarios" label="Usuarios" type="number" required :disabled="isRegistering"></v-text-field></v-col>
            <v-col cols="12" md="3"><v-text-field v-model.number="turno.dineroPancafe" label="Dinero Pancafe" type="number" step="0.01" required :disabled="isRegistering"></v-text-field></v-col>
            <v-col cols="12" md="3"><v-text-field v-model.number="turno.usanzaPancafe" label="Usanza Pancafe" type="number" step="0.01" required :disabled="isRegistering"></v-text-field></v-col>
            <v-col cols="12" md="3"><v-text-field v-model.number="turno.efectivo" label="Efectivo" type="number" step="0.01" required :disabled="isRegistering"></v-text-field></v-col>
            <v-col cols="12" md="3"><v-text-field v-model.number="turno.yape" label="Yape (Calculado)" type="number" step="0.01" readonly required :disabled="isRegistering"></v-text-field></v-col>
            <v-col cols="12" md="3"><v-text-field v-model.number="turno.consumo" label="Consumo" type="number" step="0.01" required :disabled="isRegistering"></v-text-field></v-col>
            <v-col cols="12" md="3"><v-text-field v-model.number="turno.snacks" label="Snacks (Calculado)" type="number" step="0.01" readonly required :disabled="isRegistering"></v-text-field></v-col>
            <v-col cols="12" md="3"><v-text-field v-model.number="turno.ingresoInventario" label="Ingreso Inventario (Calculado)" type="number" step="0.01" readonly required :disabled="isRegistering"></v-text-field></v-col>
            <v-col cols="12" md="3"><v-text-field v-model.number="turno.retiros" label="Retiros (Calculado)" type="number" step="0.01" readonly required :disabled="isRegistering"></v-text-field></v-col>
          </v-row>
          <v-alert :color="diferencia >= 0 ? 'error' : 'success'" border="start" elevation="2" class="mt-4">
            <h3 class="text-h5">Diferencia: S/ {{ diferencia }}</h3>
          </v-alert>
          <v-btn type="submit" color="primary" class="mt-4" :loading="isRegistering" :disabled="isRegistering">Registrar Turno</v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Dialog for adding inventory movements -->
    <v-dialog v-model="movementDialog" persistent max-width="600px">
      <v-card>
        <v-card-title><span class="text-h5">Agregar Movimiento</span></v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="newMovement.productId"
            :items="products"
            item-title="name"
            item-value="id"
            label="Buscar Producto"
            placeholder="Escribe para buscar..."
          ></v-autocomplete>
          <v-text-field v-model.number="newMovement.quantity" label="Cantidad" type="number" required></v-text-field>
          <v-select v-model="newMovement.type" :items="['IN', 'OUT']" label="Tipo de Movimiento"></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="movementDialog = false">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="submitNewMovement">Agregar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog for adding Yapes -->
    <v-dialog v-model="yapeDialog" persistent max-width="600px">
      <v-card>
        <v-card-title><span class="text-h5">Agregar Yape</span></v-card-title>
        <v-card-text>
          <v-text-field v-model="newYape.detalle" label="Detalle" required></v-text-field>
          <v-text-field v-model.number="newYape.monto" label="Monto" type="number" step="0.01" required></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="yapeDialog = false">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="submitNewYape">Agregar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog for adding withdrawals -->
    <v-dialog v-model="retiroDialog" persistent max-width="600px">
      <v-card>
        <v-card-title><span class="text-h5">Agregar Retiro</span></v-card-title>
        <v-card-text>
          <v-select
            v-model="newRetiro.description"
            :items="['PROMOCIONES', 'DESCUENTO', 'OTRO']"
            label="Tipo de Retiro"
            required
          ></v-select>
          <v-text-field
            v-if="newRetiro.description === 'OTRO'"
            v-model="newRetiro.customDescription"
            label="Especifique la descripción"
            required
          ></v-text-field>
          <v-text-field v-model.number="newRetiro.amount" label="Monto" type="number" step="0.01" required></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="retiroDialog = false">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="submitNewRetiro">Agregar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch, nextTick } from 'vue';
import { useTurnoStore } from '../stores/turno';
import { useProductStore } from '../stores/product';
import { useNotificationStore } from '../stores/notification';

const TURNO_STORAGE_KEY = 'turno_draft';
const MOVEMENTS_STORAGE_KEY = 'movements_draft';
const RETIROS_STORAGE_KEY = 'retiros_draft';
const YAPES_STORAGE_KEY = 'yapes_draft';

const movementDialog = ref(false);
const retiroDialog = ref(false);
const yapeDialog = ref(false);
const isRegistering = ref(false);
const isPageLoading = ref(true);

const turno = reactive({
  fecha: '', horaEntrada: '', horaSalida: '', efectivo: 0, yape: 0, snacks: 0, ingresoInventario: 0,
  consumo: 0, retiros: 0, dineroPancafe: 0, usanzaPancafe: 0, kw: 0, usuarios: 0,
});

const newMovement = reactive({ productId: null, quantity: 1, type: 'OUT' });
const newRetiro = reactive({ description: null, amount: 0, customDescription: '' });
const newYape = reactive({ detalle: '', monto: 0 });

const movements = ref([]);
const retiros = ref([]);
const yapes = ref([]);
const productStore = useProductStore();
const products = ref([]);

const turnoStore = useTurnoStore();
const notificationStore = useNotificationStore();

const sortedMovements = computed(() => {
  return [...movements.value].sort((a, b) => {
    if (a.type === 'OUT' && b.type === 'IN') return -1;
    if (a.type === 'IN' && b.type === 'OUT') return 1;
    return a.productName.localeCompare(b.productName);
  });
});

const snacksTotal = computed(() =>
  movements.value.reduce((total, movement) => {
    if (movement.type === 'OUT') {
      return total + movement.quantity * movement.sellingPrice;
    }
    return total;
  }, 0)
);

const ingresoInventarioTotal = computed(() =>
  movements.value.reduce((total, movement) => {
    if (movement.type === 'IN') {
      return total + movement.quantity * movement.purchasePrice;
    }
    return total;
  }, 0)
);

const retirosTotal = computed(() => retiros.value.reduce((total, retiro) => total + retiro.amount, 0));
const yapesTotal = computed(() => yapes.value.reduce((total, yape) => total + yape.monto, 0));

watch(snacksTotal, (newTotal) => { turno.snacks = parseFloat(newTotal.toFixed(2)); });
watch(ingresoInventarioTotal, (newTotal) => { turno.ingresoInventario = parseFloat(newTotal.toFixed(2)); });
watch(retirosTotal, (newTotal) => { turno.retiros = parseFloat(newTotal.toFixed(2)); });
watch(yapesTotal, (newTotal) => { turno.yape = parseFloat(newTotal.toFixed(2)); });

watch(turno, (newTurno) => { localStorage.setItem(TURNO_STORAGE_KEY, JSON.stringify(newTurno)); }, { deep: true });
watch(movements, (newMovements) => { localStorage.setItem(MOVEMENTS_STORAGE_KEY, JSON.stringify(newMovements)); }, { deep: true });
watch(retiros, (newRetiros) => { localStorage.setItem(RETIROS_STORAGE_KEY, JSON.stringify(newRetiros)); }, { deep: true });
watch(yapes, (newYapes) => { localStorage.setItem(YAPES_STORAGE_KEY, JSON.stringify(newYapes)); }, { deep: true });

const diferencia = computed(() => {
  const total = (turno.dineroPancafe + turno.snacks) - (turno.retiros + turno.consumo + turno.efectivo + turno.yape);
  return total.toFixed(2);
});

const handleRegister = async () => {
  isRegistering.value = true;
  await nextTick();
  try {
    const movementsToSubmit = movements.value.map(({ productId, quantity, type }) => ({ productId, quantity, type }));
    const retirosToSubmit = retiros.value.map(({ description, amount }) => ({ description, amount }));
    const yapesToSubmit = yapes.value.map(({ detalle, monto }) => ({ detalle, monto }));

    await turnoStore.createTurno({ turno, movements: movementsToSubmit, retiros: retirosToSubmit, yapes: yapesToSubmit });

    notificationStore.show('Turno registrado exitosamente!');
    Object.assign(turno, {
      fecha: '', horaEntrada: '', horaSalida: '', efectivo: 0, yape: 0, snacks: 0,
      consumo: 0, retiros: 0, dineroPancafe: 0, usanzaPancafe: 0, kw: 0, usuarios: 0,
    });
    movements.value = [];
    retiros.value = [];
    yapes.value = [];

    localStorage.removeItem(TURNO_STORAGE_KEY);
    localStorage.removeItem(MOVEMENTS_STORAGE_KEY);
    localStorage.removeItem(RETIROS_STORAGE_KEY);
    localStorage.removeItem(YAPES_STORAGE_KEY);
  } catch (error) {
    notificationStore.show(error.message, 'error');
  } finally {
    isRegistering.value = false;
  }
};

const addMovement = (movement) => {
  const product = products.value.find(p => p.id === movement.productId);
  if (!product) return;

  const existingMovement = movements.value.find(m => m.productId === movement.productId && m.type === movement.type);

  if (existingMovement) {
    existingMovement.quantity += movement.quantity;
  } else {
    movements.value.push({
      ...movement,
      productName: product.name,
      sellingPrice: product.sellingPrice,
      purchasePrice: product.purchasePrice,
    });
  }
};

const submitNewMovement = () => {
  if (newMovement.productId && newMovement.quantity > 0) {
    addMovement({ ...newMovement });
    newMovement.productId = null;
    newMovement.quantity = 1;
    newMovement.type = 'OUT';
    movementDialog.value = false;
  }
};

const removeMovement = (movementToRemove) => {
  const index = movements.value.findIndex(m => m.productId === movementToRemove.productId && m.type === movementToRemove.type);
  if (index !== -1) {
    movements.value.splice(index, 1);
  }
};

const addRetiro = (retiro) => {
  retiros.value.push(retiro);
};

const submitNewRetiro = () => {
  const amount = parseFloat(newRetiro.amount);
  const finalDescription = newRetiro.description === 'OTRO' ? newRetiro.customDescription : newRetiro.description;

  if (finalDescription && !isNaN(amount) && amount !== 0) {
    addRetiro({ description: finalDescription, amount: amount });
    
    // Reset form
    newRetiro.description = null;
    newRetiro.amount = 0;
    newRetiro.customDescription = '';
    retiroDialog.value = false;
  } else {
    notificationStore.show('Por favor, complete todos los campos y asegúrese que el monto no sea cero.', 'error');
  }
};

const removeRetiro = (index) => { retiros.value.splice(index, 1); };

const submitNewYape = () => {
  const monto = parseFloat(newYape.monto);
  if (newYape.detalle && !isNaN(monto) && monto > 0) {
    yapes.value.push({ ...newYape, monto: monto });
    newYape.detalle = '';
    newYape.monto = 0;
    yapeDialog.value = false;
  } else {
    notificationStore.show('Por favor, ingrese un detalle y un monto válido y mayor a cero.', 'error');
  }
};

const removeYape = (index) => { yapes.value.splice(index, 1); };

onMounted(async () => {
  isPageLoading.value = true;
  try {
    await productStore.fetchProducts();
    products.value = productStore.products;

    const savedTurno = localStorage.getItem(TURNO_STORAGE_KEY);
    if (savedTurno) Object.assign(turno, JSON.parse(savedTurno));

    const savedMovements = localStorage.getItem(MOVEMENTS_STORAGE_KEY);
    if (savedMovements) movements.value = JSON.parse(savedMovements);

    const savedRetiros = localStorage.getItem(RETIROS_STORAGE_KEY);
    if (savedRetiros) retiros.value = JSON.parse(savedRetiros);

    const savedYapes = localStorage.getItem(YAPES_STORAGE_KEY);
    if (savedYapes) yapes.value = JSON.parse(savedYapes);
  } catch (error) {
    notificationStore.show('Error al cargar los productos.', 'error');
  } finally {
    isPageLoading.value = false;
  }
});
</script>