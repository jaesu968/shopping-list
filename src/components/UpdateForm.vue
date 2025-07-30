<!-- Reusable Component for updating lists and items-->
<!-- don't have to use this , just something we could use-->
<template>
  <div class="update-form-container">
    <h2>{{ title }}</h2>
    
    <!-- Form with prevent default to handle submission via Vue -->
    <form @submit.prevent="handleSubmit" class="update-form">
      <!-- Input field with two-way binding and template ref for focus -->
      <input 
        v-model="inputValue" 
        :placeholder="placeholder" 
        required 
        class="update-input"
        ref="updateInput"
      >
      
      <!-- Action buttons -->
      <div class="button-group">
        <button type="submit" class="save-btn">{{ submitText }}</button>
        <button type="button" @click="handleCancel" class="cancel-btn">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script setup>
// Import Vue composition API functions
import { ref, onMounted } from 'vue'

// Define component props with types and defaults
const props = defineProps({
  title: {
    type: String,
    default: 'Update'
  },
  placeholder: {
    type: String,
    default: 'Enter value...'
  },
  submitText: {
    type: String,
    default: 'Update'
  },
  initialValue: {
    type: String,
    default: ''
  }
})

// Define events this component can emit to parent
const emit = defineEmits(['update', 'cancel'])

// Reactive data: input value and template ref for focus
const inputValue = ref(props.initialValue)
const updateInput = ref(null)

// Handle form submission
const handleSubmit = () => {
  // Validate input is not empty
  if (!inputValue.value.trim()) {
    alert(`Please enter a ${props.title.toLowerCase()}`)
    return
  }
  
  // Emit update event with trimmed value to parent component
  emit('update', inputValue.value.trim())
}

// Handle cancel button click
const handleCancel = () => {
  emit('cancel')
}

// Focus input field when component mounts for better UX
onMounted(() => {
  if (updateInput.value) {
    updateInput.value.focus()
  }
})
</script>

<style scoped>
/* Main container with card-like appearance */
.update-form-container {
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.update-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}

.update-input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.update-input:focus {
  outline: none;
  border-color: #42b883;
}

.button-group {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.save-btn {
  padding: 12px 24px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.save-btn:hover {
  background: #369870;
}

.cancel-btn {
  padding: 12px 24px;
  background: #ccc;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.cancel-btn:hover {
  background: #bbb;
}
</style>
