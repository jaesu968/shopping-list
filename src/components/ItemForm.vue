<template>
    <form @submit.prevent="submitForm" class="modal-form">
        <!-- Row 1: Item Name and Quantity -->
        <div class="form-row">
            <div class="form-group">
                <label for="itemName">Item Name:</label>
                <input id="itemName" v-model="item.itemName" required />
            </div>
            <div class="form-group">
                <label for="quantity">Quantity:</label>
                <input id="quantity" v-model.number="item.quantity" required type="number" />
            </div>
        </div>

        <!-- Row 2: Brand and Category with remembered values -->
        <div class="form-row">
            <div class="form-group">
                <label for="brand">Brand:</label>
                <input id="brand" list="brandList" v-model="item.brand" />
                <datalist id="brandList">
                    <option v-for="b in brands" :key="b" :value="b" />
                </datalist>
            </div>

            <div class="form-group">
                <label for="category">Category:</label>
                <input id="category" list="categoryList" v-model="item.category" />
                <datalist id="categoryList">
                    <option v-for="c in categories" :key="c" :value="c" />
                </datalist>
            </div>
        </div>

        <!-- Row 3: Price and Weight -->
        <div class="form-row">
            <div class="form-group">
                <label for="price">Price:</label>
                <input id="price" v-model.number="item.price" type="number" step="0.01" />
            </div>
            <div class="form-group">
                <label for="weight">Weight:</label>
                <input id="weight" v-model.number="item.weight" type="number" step="0.01" />
            </div>
        </div>

        <!-- Notes Textarea -->
        <div class="form-group full-width">
            <label for="notes">Notes:</label>
            <textarea id="notes" v-model="item.notes"></textarea>
        </div>

        <!-- Submit and Cancel buttons -->
        <div class="button-group">
            <button type="submit" class="submit-btn">
                {{ props.initialItem ? 'Update Item' : 'Add to List' }}
            </button>
            <button type="button" class="cancel-btn" @click="$emit('cancel')">Cancel</button>
        </div>
    </form>
</template>

<script setup>
import { ref, watch } from 'vue'

// Props: receives an item if editing, otherwise form starts blank
const props = defineProps({
    initialItem: Object
})

// Emits submit (with form data) or cancel (to close modal)
const emit = defineEmits(['submit', 'cancel'])

// Local item object holds the form state
const item = ref({
    itemName: '',
    quantity: '',
    brand: '',
    category: '',
    price: '',
    weight: '',
    notes: ''
})

// Watch for initialItem prop (for editing), and prefill form if available
watch(() => props.initialItem, (newItem) => {
    if (newItem) {
        item.value = { ...newItem }
    }
}, { immediate: true })

// These store user-entered brands/categories for use in <datalist>
const brands = ref([])
const categories = ref([])

// Called when form is submitted
function submitForm() {
    // Remember brand/category for autocompletion
    if (item.value.brand && !brands.value.includes(item.value.brand)) {
        brands.value.push(item.value.brand)
    }
    if (item.value.category && !categories.value.includes(item.value.category)) {
        categories.value.push(item.value.category)
    }

    // Emit the item object back to parent
    emit('submit', { ...item.value })

    // Clear form (in case it's reopened as new item)
    item.value = {
        itemName: '',
        quantity: '',
        brand: '',
        category: '',
        price: '',
        weight: '',
        notes: ''
    }
}
</script>

<style scoped>
/* Modal backdrop */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    /* dimmed background */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
}

/* Modal box styling */
.modal {
    background-color: var(--card-bg);
    /* theme-based background */
    color: var(--text-color);
    /* theme-based text */
    padding: 2rem;
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.25);
}

/* Ensure label text follows theme */
.modal label {
    color: var(--text-color);
}

/* Input fields styled to match theme */
.modal input,
.modal textarea,
.modal select {
    width: 100%;
    padding: 8px;
    margin-bottom: 1rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    background-color: var(--card-bg);
    /* match modal background */
    color: var(--text-color);
    /* match text */
}

/* Buttons inside the modal */
.modal button {
    margin-right: 10px;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    border: none;
    cursor: pointer;
}

/* Confirm (submit) button */
.modal .confirm {
    background-color: #4caf50;
    color: white;
}

/* Cancel button styling */
.modal .cancel {
    background-color: #f44336;
    color: white;
}

/* Group rows horizontally, wrap on smaller screens */
.form-row {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

/* Individual form fields */
.form-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 150px;
}

/* Full-width form section (like notes) */
.full-width {
    width: 100%;
}

/* Textarea behavior */
textarea {
    resize: vertical;
    min-height: 60px;
}

/* Base input and textarea styles (fallback for any outside modal) */
input,
textarea {
    padding: 0.5rem;
    border: 1px solid #555;
    border-radius: 4px;
    background-color: #2c2c2c;
    color: white;
}

/* Grouped buttons at bottom right */
.button-group {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
}

/* Submit button */
.submit-btn {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 4px;
}

/* Cancel button */
.cancel-btn {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 4px;
}

/* Hover effect for all buttons */
button:hover {
    opacity: 0.9;
}
</style>