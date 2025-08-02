<template>
    <div> <!-- Container for new list creation form -->
      <div v-if="!showNameInput"> <!-- Show create button when input is hidden -->
        <button @click="showNameInput = true">Create New Shopping List</button>
      </div>
      <div v-else> <!-- Show input form when creating a new list -->
        <input v-model="newListName" placeholder="List name..." />
        <button @click="confirmAdd">Create</button>
        <button @click="cancelAdd">Cancel</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  const emit = defineEmits(['add-list']) // Emit event to parent component
  const showNameInput = ref(false) // Toggle visibility of input form
  const newListName = ref('') // Store new list name input
  
  const confirmAdd = () => { // Handle list creation confirmation
    if (!newListName.value.trim()) return // Verify input isn't empty
    emit('add-list', newListName.value.trim()) // Send list name to parent
    newListName.value = ''
    showNameInput.value = false
  }
  
  const cancelAdd = () => { // Handle creation cancellation
    newListName.value = ''
    showNameInput.value = false
  }
  </script>
  
  <style scoped>
button {
  width: 100%;          /* full container width */
  min-height: 40px;     /* consistent height */
  padding: 10px 16px;   /* enough padding */
  font-size: 16px;      /* readable */
  border-radius: 6px;   /* smooth corners */
  background-color: var(--btn-bg, #42b883); /* theme-friendly */
  color: white;
  cursor: pointer;
  box-sizing: border-box;
}

button:hover {
  background-color: var(--btn-hover-bg, #369870);
}

  
  input {
    width: 100%;
    height: 40px;
    padding: 8px 16px;
    border: 1px solid var(--color-border, #ddd);
    border-radius: 4px;
    margin-bottom: 10px;
    box-sizing: border-box;
    background-color: var(--color-background-soft, #f8f8f8);
    color: var(--text-color);
  }
  
  input::placeholder {
    color: var(--color-text-muted, #888);
  }
  
  /* Use inherited text color for container */
  div {
    color: var(--text-color);
  }
  </style>
  