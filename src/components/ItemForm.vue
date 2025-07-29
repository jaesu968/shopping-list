<template>
    <div class="list-view">
        <h3>Add Item to: {{ listName }}</h3>
        <input v-model="item.name" placeholder="Item name" />
        <input v-model="item.quantity" type="number" placeholder="Quantity" />
        <input v-model="item.description" placeholder="Description" />
        <input v-model="item.brand" placeholder="Brand" />
        <input v-model="item.weight" placeholder="Weight" />
        <input v-model="item.unitPrice" type="number" placeholder="Unit price" />
        <input v-model="item.category" placeholder="Category" />
        <input v-model="item.expirationDate" type="date" />
        <textarea v-model="item.notes" placeholder="Notes"></textarea>
        <button @click="submit">Add to List</button>
        <button @click="$emit('cancel')">Cancel</button>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
const props = defineProps(['listName'])
const emit = defineEmits(['submit', 'cancel'])
const item = reactive({
    name: '', quantity: '', description: '', brand: '', weight: '',
    unitPrice: '', category: '', expirationDate: '', notes: ''
})
const submit = () => {
    emit('submit', { ...item })
    for (const key in item) item[key] = ''
}
</script>

<style scoped>
.list-view {
    background: #fff;
    color: #000;
    margin-top: 2rem;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    max-width: 700px;
}
</style>