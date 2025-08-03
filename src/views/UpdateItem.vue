<template>
  <div class="item-pane">
    <!-- Header displaying the name of the current list -->
    <h3>
      Items in <strong>{{ list.name?.trim() || 'Unnamed List' }}</strong>
    </h3>

    <!-- Modal form for adding or updating an item -->
    <div v-if="showItemForm" class="modal-overlay">
      <div class="modal">
        <ItemForm :key="formKey" :initialItem="updatingItem !== null ? list.items[updatingItem] : null"
          @submit="handleItemSubmit" @cancel="closeModal" />
      </div>
    </div>

    <!-- Button to trigger the item creation modal -->
    <button class="add-item-btn" @click="openModal">➕ Add Item</button>

    <!-- Table of items in the list -->
    <table class="items-table">
      <thead>
        <tr>
          <th><input type="checkbox" :checked="areAllSelected" @change="toggleSelectAll" class="item-checkbox" /></th>
          <th>Name</th>
          <th>Quantity</th>
          <th>Picked</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <!-- Iterate through list items -->
        <tr v-for="(item, itemIndex) in list.items" :key="itemIndex" :class="{ picked: item.picked }">
          <td><input type="checkbox" :value="itemIndex" v-model="selectedItems" class="item-checkbox" /></td>
          <td>{{ item.itemName || 'Unnamed' }}</td>
          <td>{{ item.quantity }}</td>
          <td>
            <!-- Checkbox to mark item as picked -->
            <input type="checkbox" v-model="item.picked" @change="updateItemStatus(itemIndex, item.picked)"
              class="item-checkbox" />
          </td>
          <td>
            <!-- View/edit and delete buttons -->
            <button @click="editItem(itemIndex)" class="view-btn">View</button>
            <button @click="deleteItem(itemIndex)" class="delete-btn">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Bulk delete action if items are selected -->
    <div v-if="selectedItems.length > 0" class="bulk-actions">
      <button @click="deleteSelectedItems" class="delete-btn">🗑 Delete Selected</button>
    </div>
  </div>
</template>

<script>
import ItemForm from "@/components/ItemForm.vue";

export default {
  components: { ItemForm },
  props: {
    list: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showItemForm: false, // Controls display of the modal
      updatingItem: null, // Tracks index of item being edited
      selectedItems: [], // Tracks selected checkboxes
      formKey: 0, // Used to force re-render of the ItemForm
    };
  },
  computed: {
    // Determines if all items are selected
    areAllSelected() {
      return (
        this.list.items.length > 0 &&
        this.selectedItems.length === this.list.items.length
      );
    },
  },
  methods: {
    // Opens the item creation modal
    openModal() {
      this.updatingItem = null;
      this.showItemForm = true;
    },
    // Closes the modal
    closeModal() {
      this.showItemForm = false;
      this.updatingItem = null;
    },
    // Handles adding or updating an item
    handleItemSubmit(item) {
      if (this.updatingItem !== null) {
        this.list.items.splice(this.updatingItem, 1, item); // update existing item
      } else {
        this.list.items.push(item); // add new item
      }
      this.closeModal();
      this.emitUpdate();
    },
    // Sets modal to edit mode for an item
    editItem(index) {
      this.updatingItem = index;
      this.showItemForm = true;
    },
    // Deletes an individual item
    deleteItem(index) {
      this.list.items.splice(index, 1);
      this.emitUpdate();
    },
    // Updates picked status of an item
    updateItemStatus(itemIndex, status) {
      this.list.items[itemIndex].picked = status;
      this.emitUpdate();
    },
    // Deletes all selected items
    deleteSelectedItems() {
      this.list.items = this.list.items.filter(
        (item, index) => !this.selectedItems.includes(index)
      );
      this.selectedItems = [];
      this.emitUpdate();
    },
    // Selects or deselects all items
    toggleSelectAll() {
      if (this.selectedItems.length === this.list.items.length) {
        this.selectedItems = [];
      } else {
        this.selectedItems = this.list.items.map((_, index) => index);
      }
    },
    // Emits event to notify parent of list changes
    emitUpdate() {
      this.$emit("update-list", this.list.items);
    },
  },
};
</script>

<style scoped>
/* Container styling */
.item-pane {
  margin-top: 1rem;
  background: var(--card-bg);
  padding: 1rem;
  border-radius: 10px;
  color: var(--text-color);
}

/* Header styles */
.item-pane h3 {
  margin-bottom: 1.25rem;
  color: var(--text-color);
}

.item-pane h3 strong {
  font-weight: 700;
  color: var(--text-color);
}

/* Add item button */
.add-item-btn {
  background-color: #3b82f6;
  /* blue */
  color: white;
  padding: 0.5rem 1rem;
  margin-bottom: 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-item-btn:hover {
  background-color: #2563eb;
}

/* Modal overlay and styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 1.5rem;
  border-radius: 12px;
  min-width: 400px;
  max-width: 90%;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
  background-color: var(--card-bg);
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Form field styling */
.modal input,
.modal select,
.modal textarea {
  background-color: var(--outer-bg);
  color: var(--text-color);
  border: 1px solid rgba(100, 100, 100, 0.4);
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.25rem;
  margin-bottom: 1rem;
  border-radius: 6px;
}

.modal input:focus,
.modal select:focus,
.modal textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

/* Item table styles */
.items-table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--card-bg);
  color: var(--text-color);
}

.items-table th,
.items-table td {
  padding: 0.5rem;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  text-align: left;
}

.items-table th:first-child,
.items-table td:first-child {
  width: 40px;
  text-align: center;
}

/* Alternate row and hover styling */
.items-table tbody tr:nth-child(odd) {
  background-color: var(--row-alt-bg);
}

.items-table tbody tr:hover {
  background-color: var(--row-hover-bg);
}

/* Button styling within table */
.items-table td button {
  padding: 0.35rem 0.75rem;
  font-size: 0.85rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 6px;
  transition: background-color 0.2s ease;
}

.items-table td button.view-btn {
  background-color: #6366f1;
  /* indigo */
  color: #fff;
}

.items-table td button.view-btn:hover {
  background-color: #4f46e5;
}

.items-table td button.delete-btn {
  background-color: #ef4444;
  color: #fff;
}

.items-table td button.delete-btn:hover {
  background-color: #dc2626;
}

/* Bulk action button */
.bulk-actions {
  margin-top: 1rem;
}

.bulk-actions button.delete-btn {
  background-color: #ef4444;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.bulk-actions button.delete-btn:hover {
  background-color: #dc2626;
}

/* Styling for picked (completed) items */
.picked td {
  text-decoration: line-through;
  color: #6b7280;
  /* muted gray */
}

/* Ensure vertical alignment for all table cell contents */
.items-table td,
.items-table th {
  vertical-align: middle;
}

/* Inline alignment for checkbox and buttons */
.items-table td input[type="checkbox"].item-checkbox {
  margin: 8px;
  display: inline-block;
  vertical-align: middle;
  transform: none;
  /* override previous translateY */
}

/* Adjust padding for first column (checkboxes) and last (buttons) */
.items-table td:first-child {
  text-align: center;
  padding: 0.4rem 0.25rem;
}

/* Optional: align buttons better with checkbox */
.items-table td:last-child {
  white-space: nowrap;
  padding: 0.25rem 0.5rem;
}

.items-table th input[type="checkbox"].item-checkbox {
  margin: 0;
  display: inline-block;
  vertical-align: middle;
  transform: none;
}

/* Make header cells vertically centered for good measure */
.items-table th {
  vertical-align: middle;
}
</style>