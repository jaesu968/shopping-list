<template>
    <div> <!-- Container for new list creation form-->
        <div v-if="!showNameInput"> <!-- Show create button when input is hidden -->
            <button @click="showNameInput = true">Create New Shopping List</button>
        </div>
        <div v-else> <!-- Show input form when creating a new list-->
            <input v-model="newListName" placeholder="List name..." />
            <button @click="confirmAdd">Create</button>
            <button @click="cancelAdd">Cancel</button>
        </div>
    </div>
</template>

<script setup> // Import Vue composition API
import { ref } from 'vue'
const emit = defineEmits(['add-list']) // Emit event to parent component
const showNameInput = ref(false) // Toggle visibility of input form
const newListName = ref('') // Store new list name input
const confirmAdd = () => { // Handle list creation confirmation
    if (!newListName.value.trim()) return // Verify that the input isn't empty
    emit('add-list', newListName.value.trim()) // Send list name to parent component
    newListName.value = ''
    showNameInput.value = false
}
const cancelAdd = () => { // Handle creation cancellation
    newListName.value = ''
    showNameInput.value = false
}
</script>

<style scoped> 
/* Match the home button styling */ 
button {
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

button:hover {
    background: #369870; 
}

/* Input field styling to match */ 
input {
  width: 100%;
  height: 40px;
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  box-sizing: border-box; 
}

/* Ensure text is visible with black color */
div {
    color: #000;
}
</style>