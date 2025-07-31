<template>
  <div>
    <h2>Shopping List: {{ list?.name || 'Not Found' }}</h2>

    <div v-if="list && list.items.length">
      <Card
        v-for="item in list.items"
        :key="item.id"
      >
        <!-- Named slot: left section of the card -->
        <template #left>
          <h3>{{ item.name }}</h3>
        </template>

        <!-- Named slot: right section of the card -->
        <template #right>
          <p>Quantity: {{ item.quantity }}</p>
        </template>
      </Card>
    </div>

    <div v-else>
      <p>This list is empty or doesn’t exist.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Card from '../components/Card.vue'

const route = useRoute()

// mock list data - replace with real data from form input or backend
const shoppingLists = ref([
  {
    id: '1',
    name: 'Grocery Run',
    items: [
      { id: 1, name: 'Milk', quantity: '2 gallons' },
      { id: 2, name: 'Eggs', quantity: '1 dozen' }
    ]
  },
  {
    id: '2',
    name: 'Target Run',
    items: [
      { id: 1, name: 'Shampoo', quantity: '1 bottle' },
      { id: 2, name: 'Toothpaste', quantity: '2 tubes' }
    ]
  }
])

// Finds the list that matches the dynamic route
const list = computed(() => {
  return shoppingLists.value.find(
    l => l.id === route.params.id
  )
})
</script>