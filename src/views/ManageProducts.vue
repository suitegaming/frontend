<template>
  <v-container>
    <h2 class="text-h4 mb-4">Manage Products</h2>

    <v-card>
      <v-card-title>
        Product List
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openCreateDialog">New Product</v-btn>
      </v-card-title>
      <v-card-text>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left">Description</th>
              <th class="text-left">Stock</th>
              <th class="text-left">Purchase Price</th>
              <th class="text-left">Selling Price</th>
              <th class="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td>{{ product.name }}</td>
              <td>{{ product.description }}</td>
              <td>{{ product.stock }}</td>
              <td>S/ {{ product.purchasePrice.toFixed(2) }}</td>
              <td>S/ {{ product.sellingPrice.toFixed(2) }}</td>
              <td>
                <v-btn icon="mdi-pencil" variant="text" color="primary" @click="openEditDialog(product)"></v-btn>
                <v-btn icon="mdi-delete" variant="text" color="error" @click="openDeleteDialog(product)"></v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ isEditing ? 'Edit Product' : 'New Product' }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="editableProduct.name" label="Product Name" required></v-text-field>
            <v-text-field v-model="editableProduct.description" label="Description"></v-text-field>
            <v-text-field v-model.number="editableProduct.stock" label="Stock" type="number" required></v-text-field>
            <v-text-field v-model.number="editableProduct.purchasePrice" label="Purchase Price" type="number" step="0.01" required></v-text-field>
            <v-text-field v-model.number="editableProduct.sellingPrice" label="Selling Price" type="number" step="0.01" required></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="saveProduct" :loading="isSaving">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Are you sure?</v-card-title>
        <v-card-text>Do you really want to delete this product? This process cannot be undone.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDeleteDialog">Cancel</v-btn>
          <v-btn color="red darken-1" text @click="confirmDelete" :loading="isDeleting">Delete</v-btn>
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
      notificationStore.show('Product updated successfully!');
    } else {
      await productStore.createProduct(editableProduct.value);
      notificationStore.show('Product created successfully!');
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
    notificationStore.show('Product deleted successfully!');
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