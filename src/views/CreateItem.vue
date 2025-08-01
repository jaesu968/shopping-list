<template>
    <Card>
        <template #left>
            <h2>Create New List</h2>
            <ShoppingItem @add="handleAddItem" />
        </template>
        <template #right>
            <p>Form preview or additional details can go here.</p>
        </template>
    </Card>
</template>

<script setup>
import Card from '../components/Card.vue'
import ShoppingItem from '../components/ShoppingItem.vue'

function handleAddItem(item) {
    console.log('Item added:', item)
}
</script>