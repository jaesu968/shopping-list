<!-- View for Updating a Shopping List Name -->
<template>
  <!-- Main container for the update list form -->
  <div class="update-list">
    <!-- Page heading -->
    <h1>Update List Name</h1>
    
    <!-- Form to handle list name updates -->
    <form @submit.prevent="updateListName" class="update-form">
      <!-- Input field for new list name -->
      <input 
        v-model="listName" 
        placeholder="Enter new list name..." 
        required 
        class="name-input"
        ref="nameInput"
      >
      
      <!-- Action buttons -->
      <div class="button-group">
        <!-- Submit button to save changes -->
        <button type="submit" class="save-btn">Update List</button>
        
        <!-- Cancel button to go back without saving -->
        <router-link to="/" class="cancel-btn">Cancel</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
// Import Vue composition API functions
import { ref, onMounted } from 'vue'
// Import Vue router functions for navigation and route params
import { useRoute, useRouter } from 'vue-router'

// Get current route information (contains list ID)
const route = useRoute()
// Get router instance for programmatic navigation
const router = useRouter()

// Reactive data for the list name input
const listName = ref('')
// Reference to the input element for focus
const nameInput = ref(null)

// Function to handle form submission and update list name
const updateListName = () => {
  // Validate input is not empty
  if (!listName.value.trim()) {
    alert('Please enter a list name')
    return
  }
  
  // Here you would typically update the list in your data store
  // For now, we'll just navigate back to home
  // TODO: Implement actual list name update logic
  console.log('Updating list ID:', route.params.id, 'to name:', listName.value.trim())
  
  // Navigate back to home page after successful update
  router.push('/')
}

// Run when component is mounted
onMounted(() => {
  // Focus the input field for better UX
  if (nameInput.value) {
    nameInput.value.focus()
  }
  
  // TODO: Load existing list name from data store
  // listName.value = getListById(route.params.id).name
})
</script>

<style scoped>
/* Main container styling */
.update-list {
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  text-align: center;
}

/* Form container */
.update-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 30px;
}

/* Input field styling */
.name-input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

/* Focus state for input */
.name-input:focus {
  outline: none;
  border-color: #42b883;
}

/* Button group container */
.button-group {
  display: flex;
  gap: 10px;
  justify-content: center;
}

/* Save button styling */
.save-btn {
  padding: 12px 24px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

/* Save button hover effect */
.save-btn:hover {
  background: #369870;
}

/* Cancel button styling */
.cancel-btn {
  padding: 12px 24px;
  background: #ccc;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
  display: inline-block;
  font-size: 16px;
}

/* Cancel button hover effect */
.cancel-btn:hover {
  background: #bbb;
}
</style>
