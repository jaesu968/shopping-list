<!-- CreateItem View -->

<template>
    <!-- Main container using Card layout component-->
    <Card>
        <!-- Left panel: List creation form-->
        <template #left>
            <h2>Add New Item</h2>
            <!-- ShoppingItem component for handling list creation
             Emits @add event when user creates a new item  
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
// Import required components
import Card from '../components/Card.vue' // Layout wrapper component
import ShoppingItem from '../components/ShoppingItem.vue' // List creation form
// import the API service for backend communication
import api from "@/services/api.js";

// props for list data
const props = defineProps({
    listId: {
        type: String,
        required: true
    }
});

const emit = defineEmits(['item-added']); // Emit event when an item is created

// handleAddItem function will be called when a new item is added
async function handleAddItem(item){
    try {
        // Call the API to create a new item in the list
        const response = await api.createItem(props.listId, item);
        // log the item creation
        console.log('Item created:', response.data);
        // Emit an event to notify parent component that an item has been created
        emit('item-added', response.data);
    } catch (error) {
        console.error('Error creating item: ', error); // Log any errors that occur during the API call
    }
}
</script>