<!-- CreateItem View -->

<template>
    <!-- Main container using Card layout component-->
    <Card>
        <!-- Left panel: List creation form-->
        <template #left>
            <h2>Create New List</h2>
            <!-- ShoppingItem component for handling list creation
             Emits @add event when user creates a new list 
             Event is caught by handleAdditem function below-->
            <ShoppingItem @add="handleAddItem" />
        </template>
        <template #right>
            <!-- Currently unused space for future features-->
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