<!-- This is the Shopping List View-->
<template>
  <Card>
    <template #left>
      <div class="template-left">
        <router-link to="/" class="home-btn">
          🏠 Home
        </router-link>
        <ShoppingItem @add-list="addList" />
      </div>
    </template>

    <template #right>
      <div v-if="lists.length === 0">
        <p>No lists yet. Create one on the left.</p>
      </div>
      <div v-else>
        <ul>
          <li v-for="(list, index) in lists" :key="list.id">
            <strong>{{ list.name }}</strong>
            <button @click="selectedList = selectedList === index ? null : index">
              {{ selectedList === index ? 'Hide' : 'View' }}
            </button>
            <button @click="renameList(index)">Rename</button>
            <button @click="deleteList(index)">Delete</button>
          </li>
        </ul>

        <div v-if="selectedList !== null" class="item-pane">
          <h3>Items in {{ lists[selectedList].name }}</h3>

          <Modal v-if="showItemForm" @close="closeModal">
            <template #default>
              <ItemForm :listName="lists[selectedList].name"
                :initialItem="updatingItem !== null ? lists[selectedList].items[updatingItem] : null"
                @submit="handleItemSubmit" @cancel="closeModal" />
            </template>
          </Modal>


          <button class="add-item-btn" @click="showItemForm = true">➕ Add Item</button>

          <div v-if="showItemForm" class="modal-overlay">
            <div class="modal">
              <ItemForm :listName="lists[selectedList].name" @submit="handleItemSubmit"
                @cancel="showItemForm = false" />
            </div>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th class="item-header">Item Name</th>
                <th class="actions-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in lists[selectedList].items" :key="i" class="item-row">
                <td class="item-cell">{{ item.name }} (Qty: {{ item.quantity }})</td>

                <td class="actions-cell">
                  <button @click="startUpdate(i)" class="update-btn">Update</button>
                  <button @click="removeItemFromList(i)" class="remove-btn">Remove</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </Card>
  <footer class="page-footer">&copy; 2025 Shopping List App - CIS 385</footer>
</template>

<script setup>
import { ref } from 'vue'
import Card from '../components/Card.vue'
import ShoppingItem from '../components/ShoppingItem.vue'
import ItemForm from '../components/ItemForm.vue'
import UpdateForm from '../components/UpdateForm.vue'

const lists = ref([])
const selectedList = ref(null)
const updatingItem = ref(null)
const showItemForm = ref(false)

const addList = (name) => {
  lists.value.push({
    id: Date.now(),
    name,
    items: []
  })
}

const deleteList = (index) => {
  if (confirm('Delete this list?')) {
    if (selectedList.value === index) selectedList.value = null
    lists.value.splice(index, 1)
  }
}

const renameList = (index) => {
  const newName = prompt('New list name:', lists.value[index].name)
  if (newName?.trim()) {
    lists.value[index].name = newName.trim()
  }
}

const addItemToList = (item) => {
  lists.value[selectedList.value].items.push(item)
}

const handleItemSubmit = (item) => {
  addItemToList(item)
  showItemForm.value = false
}

const startUpdate = (itemIndex) => {
  updatingItem.value = itemIndex
}

const saveUpdate = (itemIndex, newValue) => {
  lists.value[selectedList.value].items[itemIndex] = newValue
  updatingItem.value = null
}

const cancelUpdate = () => {
  updatingItem.value = null
}

const removeItemFromList = (itemIndex) => {
  lists.value[selectedList.value].items.splice(itemIndex, 1)
}
</script>

<style scoped>
.template-left {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item-pane {
  margin-top: 1rem;
  padding: 1rem;
  background: #f0f0f0;
  border-radius: 8px;
}

.page-footer {
  text-align: center;
  padding: 20px;
  margin-top: auto;
  font-size: 14px;
  color: #666;
  border-top: 1px solid #eee;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background: #fff;
  color: #000;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
}

.template-left button,
.template-left .home-btn,
.template-left a {
  width: 100%;
  height: 40px;
  padding: 8px 16px;
  margin: 0 0 10px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.home-btn {
  background: #42b883;
  color: white;
}

.home-btn:hover {
  background: #369870;
}

button {
  margin-left: 0.5rem;
}

.item-pane h3 {
  color: #000 !important;
  font-weight: bold;
}

.item-row {
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 8px;
}

.item-text {
  font-size: 14px;
  color: #333;
}

.update-btn,
.remove-btn {
  min-width: 80px;
  padding: 2px 6px;
  font-size: 10px;
  border-radius: 5px;
  text-align: center;
}

.update-btn {
  background-color: #4CAF50;
  color: white;
}

.remove-btn {
  background-color: #f44336;
  color: white;
}

.add-item-btn {
  margin-top: 1rem;
  background: #3498db;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 800px;
  width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-header {
  margin-bottom: 1rem;
  grid-column: span 2;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: auto;
}

.cancel-btn {
  background-color: #ccc;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: #bbb;
}

.two-column-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  flex-grow: 1;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  background: white;
}

.items-table th {
  background-color: #f5f5f5;
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid #ddd;
  font-weight: bold;
  color: #333;
}

.items-table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.item-cell {
  font-size: 14px;
  color: #333;
}

.actions-cell {
  white-space: nowrap;
  text-align: right;
}

.items-table tr:hover {
  background-color: #f9f9f9;
}

.items-table tr:nth-child(even) {
  background-color: #fdfdfd;
}

.form-full label {
  margin-bottom: 0.25rem;
}
</style>