<template>
  <Card>
    <template #left>
      <div class="template-left">
        <router-link to="/" class="home-button">🏠 Home</router-link>
        <ShoppingItem @add-list="addList" />
      </div>
    </template>

    <template #right>
      <div v-if="lists.length === 0">
        <p>No lists yet. Create one on the left.</p>
      </div>
      <div v-else>
        <ul>
          <li v-for="(list, index) in lists" :key="list.id" class="list-entry">
            <span class="list-name">{{ list.name }}</span>
            <div class="button-group">
              <button class="action-btn" @click="selectedList = selectedList === index ? null : index">
                {{ selectedList === index ? "Hide" : "View" }}
              </button>
              <button class="action-btn" @click="renameList(index)">Rename</button>
              <button class="action-btn delete-btn" @click="deleteList(index)">Delete</button>
            </div>
          </li>
        </ul>

        <div v-if="selectedList !== null" class="item-pane">
          <h3>
            Items in <strong>{{ lists[selectedList].name?.trim() || 'Unnamed List' }}</strong>
          </h3>

          <div v-if="showItemForm" class="modal-overlay">
            <div class="modal">
              <ItemForm :key="formKey"
                :initialItem="updatingItem !== null ? lists[selectedList].items[updatingItem] : null"
                @submit="handleItemSubmit" @cancel="closeModal" />
            </div>
          </div>

          <button class="add-item-btn" @click="openModal">➕ Add Item</button>

          <table class="items-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" :checked="areAllSelected" @change="toggleSelectAll" />
                </th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Picked</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, itemIndex) in lists[selectedList].items" :key="itemIndex"
                :class="{ picked: item.picked }">
                <td>
                  <input type="checkbox" :value="itemIndex" v-model="selectedItems" />
                </td>
                <td>{{ item.itemName || 'Unnamed' }}</td>
                <td>{{ item.quantity }}</td>
                <td>
                  <input type="checkbox" v-model="item.picked"
                    @change="updateItemStatus(selectedList, itemIndex, item.picked)" />
                </td>
                <td>
                  <button @click="editItem(itemIndex)">View</button>
                  <button @click="deleteItem(itemIndex)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="selectedItems.length > 0" class="bulk-actions">
            <button @click="deleteSelectedItems">🗑 Delete Selected</button>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script>
import ShoppingItem from "@/components/ShoppingItem.vue";
import ItemForm from "@/components/ItemForm.vue";
import Card from "@/components/Card.vue";

export default {
  components: {
    ShoppingItem,
    ItemForm,
    Card,
  },
  data() {
    return {
      lists: [],
      selectedList: null,
      showItemForm: false,
      updatingItem: null,
      selectedItems: [],
      formKey: 0,
    };
  },
  computed: {
    areAllSelected() {
      const items = this.lists[this.selectedList]?.items || [];
      return items.length > 0 && this.selectedItems.length === items.length;
    },
    isDarkMode() {
      return document.body.classList.contains('dark');
    },
  },
  methods: {
    addList(listName) {
      this.lists.push({
        id: Date.now(),
        name: listName,
        items: [],
      });
    },
    renameList(index) {
      const newName = prompt("Enter new list name:", this.lists[index].name);
      if (newName) this.lists[index].name = newName;
    },
    deleteList(index) {
      if (confirm("Are you sure you want to delete this list?")) {
        this.lists.splice(index, 1);
        if (this.selectedList === index) this.selectedList = null;
      }
    },
    openModal() {
      this.updatingItem = null;
      this.showItemForm = true;
    },
    closeModal() {
      this.showItemForm = false;
      this.updatingItem = null;
    },
    handleItemSubmit(item) {
      if (this.updatingItem !== null) {
        this.lists[this.selectedList].items.splice(this.updatingItem, 1, item);
      } else {
        this.lists[this.selectedList].items.push(item);
      }
      this.closeModal();
    },
    editItem(index) {
      this.updatingItem = index;
      this.showItemForm = true;
    },
    deleteItem(index) {
      this.lists[this.selectedList].items.splice(index, 1);
    },
    updateItemStatus(listIndex, itemIndex, status) {
      this.lists[listIndex].items[itemIndex].picked = status;
    },
    deleteSelectedItems() {
      this.lists[this.selectedList].items = this.lists[this.selectedList].items.filter(
        (item, index) => !this.selectedItems.includes(index)
      );
      this.selectedItems = [];
    },
    toggleSelectAll() {
      const items = this.lists[this.selectedList]?.items || [];
      if (this.selectedItems.length === items.length) {
        this.selectedItems = [];
      } else {
        this.selectedItems = items.map((_, index) => index);
      }
    },
  },
};
</script>

<style scoped>
.list-entry {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.list-name {
  font-weight: 600;
  color: var(--text-color);
}

.button-group {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background-color: #34d399;
  color: white;
  border: none;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.action-btn:hover {
  opacity: 0.9;
}

.delete-btn {
  background-color: #ef4444 !important;
}

.item-pane {
  margin-top: 1rem;
  background: var(--card-bg);
  padding: 1rem;
  border-radius: 10px;
  color: var(--text-color);
}

.item-pane h3 {
  margin-bottom: 1.25rem;
  color: var(--text-color);
}

.item-pane h3 strong {
  font-weight: 700;
  color: var(--text-color);
}

.add-item-btn {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  margin-bottom: 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.add-item-btn:hover {
  opacity: 0.9;
}

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

.items-table tbody tr:nth-child(odd) {
  background-color: var(--row-alt-bg);
}

.items-table tbody tr:hover {
  background-color: var(--row-hover-bg);
}

.items-table td button {
  padding: 0.35rem 0.75rem;
  font-size: 0.85rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 6px;
  transition: background-color 0.2s ease;
}

.items-table td button:first-of-type {
  background-color: #6366f1;
  color: #fff;
}

.items-table td button:first-of-type:hover {
  background-color: #4f46e5;
}

.items-table td button:last-of-type {
  background-color: #ef4444;
  color: #fff;
}

.items-table td button:last-of-type:hover {
  background-color: #dc2626;
}

.bulk-actions {
  margin-top: 1rem;
}

.bulk-actions button {
  background-color: #ef4444;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.bulk-actions button:hover {
  background-color: #dc2626;
}

.picked td {
  text-decoration: line-through;
  color: #6b7280;
}

.home-button {
  width: 100%;
  height: 40px;
  display: inline-block;
  padding: 12px 24px;
  margin: 0 0 10px 0;
  background-color: #2ecc71;
  color: white;
  text-decoration: none;
  font-weight: 600;
  border-radius: 4px;
  text-align: center;
  transition: background-color 0.3s ease;
}

.home-button:hover {
  background-color: #27ae60;
}
</style>