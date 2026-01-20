<template>
  <v-container>
    <h2 class="text-h4 mb-4">Gestionar Productos</h2>

    <v-card>
      <v-card-title>
        Lista de Productos
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openCreateDialog">Nuevo Producto</v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="products"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:item.purchasePrice="{ value }">
            S/ {{ value.toFixed(2) }}
          </template>
          <template v-slot:item.sellingPrice="{ value }">
            S/ {{ value.toFixed(2) }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn icon="mdi-pencil" variant="text" color="primary" @click="openEditDialog(item)"></v-btn>
            <v-btn icon="mdi-delete" variant="text" color="error" @click="openDeleteDialog(item)"></v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ isEditing ? 'Editar Producto' : 'Nuevo Producto' }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="editableProduct.name" label="Nombre del Producto" required></v-text-field>
            <v-text-field v-model="editableProduct.description" label="Descripción"></v-text-field>
            <v-text-field v-model.number="editableProduct.stock" label="Stock" type="number" required></v-text-field>
            <v-text-field v-model.number="editableProduct.purchasePrice" label="Precio de Compra" type="number" step="0.01" required></v-text-field>
            <v-text-field v-model.number="editableProduct.sellingPrice" label="Precio de Venta" type="number" step="0.01" required></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="saveProduct" :loading="isSaving">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="text-h5">¿Estás seguro?</v-card-title>
        <v-card-text>¿Realmente quieres eliminar este producto? Este proceso no se puede deshacer.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDeleteDialog">Cancelar</v-btn>
          <v-btn color="red darken-1" text @click="confirmDelete" :loading="isDeleting">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import { useProductStore } from '../stores/product';
import { useNotificationStore } from '../stores/notification';

const productStore = useProductStore();
const notificationStore = useNotificationStore();

const products = computed(() => productStore.products);

const headers = [
  { title: 'Nombre', key: 'name' },
  { title: 'Descripción', key: 'description' },
  { title: 'Stock', key: 'stock' },
  { title: 'Precio de Compra', key: 'purchasePrice' },
  { title: 'Precio de Venta', key: 'sellingPrice' },
  { title: 'Acciones', key: 'actions', sortable: false },
];

const dialog = ref(false);
const deleteDialog = ref(false);
const isEditing = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const isPageLoading = ref(true);

const editableProduct = ref({});
const productToDelete = ref(null);

const openCreateDialog = () => {
  isEditing.value = false;
  editableProduct.value = { name: '', description: '', stock: 0, purchasePrice: 0, sellingPrice: 0 };
  dialog.value = true;
};

const openEditDialog = (product) => {
  isEditing.value = true;
  editableProduct.value = { ...product };
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
};

const saveProduct = async () => {
  isSaving.value = true;
  await nextTick();
  try {
    if (isEditing.value) {
      await productStore.updateProduct(editableProduct.value);
      notificationStore.show('Producto actualizado exitosamente!');
    } else {
      await productStore.createProduct(editableProduct.value);
      notificationStore.show('Producto creado exitosamente!');
    }
    await productStore.fetchProducts();
    closeDialog();
  } catch (error) {
    notificationStore.show(error.message, 'error');
  } finally {
    isSaving.value = false;
  }
};

const openDeleteDialog = (product) => {
  productToDelete.value = product;
  deleteDialog.value = true;
};

const closeDeleteDialog = () => {
  deleteDialog.value = false;
  productToDelete.value = null;
};

const confirmDelete = async () => {
  isDeleting.value = true;
  await nextTick();
  try {
    await productStore.deleteProduct(productToDelete.value.id);
    notificationStore.show('Producto eliminado exitosamente!');
    await productStore.fetchProducts();
    closeDeleteDialog();
  } catch (error) {
    notificationStore.show(error.message, 'error');
  } finally {
    isDeleting.value = false;
  }
};

onMounted(async () => {
  isPageLoading.value = true;
  try {
    await productStore.fetchProducts();
  } catch (error) {
    notificationStore.show('Error al cargar los productos.', 'error');
  } finally {
    isPageLoading.value = false;
  }
});
</script>