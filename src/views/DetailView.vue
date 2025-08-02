<template>
  <div>
    <!--Displays shopping list name, will return 'not found' if missing-->
    <h2>Shopping List: {{ list?.name || 'Not Found' }}</h2>

    <!--If list with items exists, loops through and renders each item inside the card -->
    <div v-if="list && list.items.length">
      <Card
        v-for="item in list.items"
        :key="item.id"
      >
        <!-- Named slot: passed into left section of the Card.vue -->
        <template #left>
          <h3>{{ item.name }}</h3> <!--Display item name-->
        </template>

        <!-- Named slot: passed into right section of the Card.vue -->
        <template #right>
          <p>Quantity: {{ item.quantity }}</p> <!--Display item quantity-->
        </template>
      </Card>
    </div>

    <!--If no item exists, fallback message will be displayed-->
    <div v-else>
      <p>This list is empty or doesn’t exist.</p>
    </div>
  </div>
</template>

<script setup>
//imports Vue's reactive and computed helper components from 'vue'
import { ref, computed } from 'vue'

//Import vue router 
import { useRoute } from 'vue-router'

//import Card component
import Card from '../components/Card.vue'

//gets currunt route object
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