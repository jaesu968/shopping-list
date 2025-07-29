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
            <button @click="selectedList = index">View</button>
            <button @click="renameList(index)">Rename</button>
            <button @click="deleteList(index)">Delete</button>
          </li>
        </ul>

        <div v-if="selectedList !== null" class="item-pane"> <!-- Selected list detail view-->
          <h3>Items in {{ lists[selectedList].name }}</h3>
          <ItemForm :listName="lists[selectedList].name" @submit="addItemToList" @cancel="selectedList = null" />
          <ul>
            <li v-for="(item, i) in lists[selectedList].items" :key="i">
              {{ item }}
              <button @click="removeItemFromList(i)">Remove</button>
            </li>
          </ul>
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
</style>