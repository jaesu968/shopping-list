<template>
  <Card>
    <template #left>
      <ShoppingItem @add-list="addList" />
    </template>

    <template #right>
      <div v-if="lists.length === 0">
        <p>No lists yet. Create one on the left.</p>
      </div>
      <div v-else>
        <ul>
          <li v-for="(list, index) in lists" :key="list.id">
            <strong>{{ list.name }}</strong>
            <button @click="selectedList = index">View</button>
            <button @click="renameList(index)">Rename</button>
            <button @click="deleteList(index)">Delete</button>
          </li>
        </ul>

        <div v-if="selectedList !== null" class="item-pane">
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
</template>

<script setup>
import { ref } from 'vue'
import Card from '../components/Card.vue'
import ShoppingItem from '../components/ShoppingItem.vue'
import ItemForm from '../components/ItemForm.vue'

const lists = ref([])
const selectedList = ref(null)

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

const removeItemFromList = (itemIndex) => {
  lists.value[selectedList.value].items.splice(itemIndex, 1)
}
</script>

<style scoped>
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

button {
  margin-left: 0.5rem;
}

.item-pane {
  margin-top: 1rem;
  padding: 1rem;
  background: #f0f0f0;
  border-radius: 8px;
}
</style>