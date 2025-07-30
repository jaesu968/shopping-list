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

    <template #right> <!-- Empty state when no lists exist -->
      <div v-if="lists.length === 0">
        <p>No lists yet. Create one on the left.</p>
      </div>
      <div v-else> <!-- Display all shopping lists-->
        <ul>
          <li v-for="(list, index) in lists" :key="list.id">
            <strong>{{ list.name }}</strong>
            <!-- click and toggle logic to display a list and hide it-->
            <!-- If a list is currently selected Hide will show -->
            <!-- If the list is not currently selected View will show-->
            <button @click="selectedList = selectedList === index ? null : index">
              {{  selectedList === index ? "Hide" : 'View' }}
            </button>
            <!-- Renaming and deleting lists-->
            <button @click="renameList(index)">Rename</button>
            <button @click="deleteList(index)">Delete</button>
          </li>
        </ul>

        <div v-if="selectedList !== null" class="item-pane"> <!-- Selected list detail view-->
          <h3>Items in {{ lists[selectedList].name }}</h3>
          
          <!-- Show UpdateForm when editing an item -->
          <UpdateForm 
            v-if="updatingItem !== null"
            title="Update Item"
            placeholder="Enter new item text..."
            submit-text="Save Item"
            :initial-value="lists[selectedList].items[updatingItem]"
            @update="(newValue) => saveUpdate(updatingItem, newValue)"
            @cancel="cancelUpdate"
          />
          
          <!-- Show Add Item form when not editing -->
          <ItemForm 
            v-else
            :listName="lists[selectedList].name" 
            @submit="addItemToList" 
            @cancel="selectedList = null" 
          />
          <!-- replacing this section with a table format 
          <ul>
            <li v-for="(item, i) in lists[selectedList].items" :key="i" class="item-row">
              <div class="item-content">
                <span class="item-text">{{ item }}</span>
              </div>
              <div class="item-actions">
                <button @click="startUpdate(i)" class="update-btn">Update</button>
                <button @click="removeItemFromList(i)" class="remove-btn">Remove</button>
              </div>
            </li>
          </ul>
         --> 
          <table class="items-table"> 
            <thead> 
              <tr> 
                <th class="item-header">Item Name</th>
                <th class="actions-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in lists[selectedList].items" :key="i" class="item-row">
                <td class="item-cell">{{ item }}</td>
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

const lists = ref([]) // Reactive data: array of shopping lists
const selectedList = ref(null) // Currently selected list index (null if none selected)

const addList = (name) => { // Add new shopping list with unique ID 
  lists.value.push({
    id: Date.now(),
    name,
    items: []
  })
}

const deleteList = (index) => { // Delete a shopping list with unique ID (index)
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

const addItemToList = (item) => { // Add item to the currently selected list
  lists.value[selectedList.value].items.push(item)
}

// updating an item 
const updatingItem = ref(null) // tracks which item is being edited

// function to start updating an item 
const startUpdate = (itemIndex) => {
  updatingItem.value = itemIndex
}

// saving an edit or update to an item (called by UpdateForm)
const saveUpdate = (itemIndex, newValue) => {
  lists.value[selectedList.value].items[itemIndex] = newValue
  updatingItem.value = null
}

// canceling update to an item (called by UpdateForm)
const cancelUpdate = () => {
  updatingItem.value = null
}

const removeItemFromList = (itemIndex) => {
  lists.value[selectedList.value].items.splice(itemIndex, 1)
}
</script>

<style scoped>
/* LAYOUT CONTAINERS */
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
/* center footer */ 
.page-footer {
  text-align: center; 
  padding: 20px; 
  margin-top: auto; 
  font-size: 14px; 
  color: #666; 
  border-top: 1px solid #eee; /* visible top border to show footer area */
}

/* LIST STYLING */
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

/* BUTTONS  */
/* Unified button styling for left panel */
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

/* Home button colors */
.home-btn {
  background: #42b883;
  color: white;
}

.home-btn:hover {
  background: #369870;
}

/* Other buttons */
button {
  margin-left: 0.5rem;
}

/* Make "Items in List" heading visible in dark mode */ 
.item-pane h3 {
  color: #000 !important; /* !important overrides any inherited dark mode colors 
   from the parent app, making the text black and visible*/
  font-weight: bold; 
}

/*Item display styling */ 
.item-row {
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 8px;
}

/* .item-content {
  flex: 1;
}
  */

.item-text {
  font-size: 14px;
  color: #333;
}

/* .item-actions {
  margin-left: 10px;
} */ 

.remove-btn {
  background: #ff4757;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 12px;
  cursor: pointer;
}

.remove-btn:hover {
  background: #ff3742;
}



.update-btn {
  background: #42b883; 
  color: white; 
  margin-right: 5px; 
}

/* Table styling */
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

</style>