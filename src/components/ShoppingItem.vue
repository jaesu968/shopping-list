<template>
  <div> <!-- Container for new list creation form -->
    <div v-if="!showNameInput"> <!-- Show create button when input is hidden -->
      <button @click="showNameInput = true" class="shared-button">Create New Shopping List</button><br>
    </div>
    <div v-else> <!-- Show input form when creating a new list -->
      <!-- Pressing Enter confirms creation for faster UX -->
      <input v-model="newListName" placeholder="List name..." @keyup.enter="confirmAdd" /><br>
      <button @click="confirmAdd" class="primary-button">Create</button>
      <button @click="cancelAdd" class="cancel-button">Cancel</button>
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

<style scoped></style>
