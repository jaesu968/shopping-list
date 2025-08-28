<template>
    <!-- novalidate disables native browser messages so we can show custom ones -->
    <form @submit.prevent="submitForm" class="modal-form" novalidate>
        <!-- Row 1: Item Name and Quantity -->
        <div class="form-row">
            <div class="form-group">
                <label for="name">Item Name:</label>
                <input id="name" v-model="item.name" :class="{ invalid: !!errors.name }" required />
                <div v-if="errors.name" class="error-msg">Item name cannot be empty</div>
            </div>
            <div class="form-group">
                <label for="qty">Quantity:</label>
                <!-- min=0 aligns native semantics with our custom validation rule -->
                <input id="qty" v-model.number="item.qty" :class="{ invalid: !!errors.qty }" required type="number" min="0" />
                <div v-if="errors.qty" class="error-msg">Item quantity cannot be less than 0</div>
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

const props = defineProps({
    initialItem: Object
})

const emit = defineEmits(['submit', 'cancel'])

// renamed form fields to match the API expectations
const item = ref({
    name: '',
    qty: 1, // default quantity to 1
    brand: '',
    category: '',
    price: 0,
    weight: 0,
    notes: '',
    checked: false // default to unchecked
})

// Simple validation state for custom messages (name, qty)
const errors = ref({ name: '', qty: '' })

// Watch for initialItem prop changes to populate form fields
watch(() => props.initialItem, (newItem) => {
    if (newItem) {
        item.value = {
            name: newItem.name || '',
            qty: newItem.qty || newItem.quantity || 1, // use qty or quantity
            brand: newItem.brand || '',
            category: newItem.category || '',
            price: newItem.price || 0,
            weight: newItem.weight || 0,
            notes: newItem.notes || '',
            checked: newItem.checked || false // default to unchecked
        } // use DB field names 
    } else {
        // Reset form fields if no initialItem is provided
        item.value = {
            name: '',
            qty: 1,
            brand: '',
            category: '',
            price: 0,
            weight: 0,
            notes: '',
            checked: false
        }
    }
}, { immediate: true })

const brands = ref([])
const categories = ref([])

// Validate required fields and set friendly message flags
function validate() {
    // Reset errors each pass
    errors.value = { name: '', qty: '' }

    // Name required
    if (!item.value.name || String(item.value.name).trim().length === 0) {
        errors.value.name = 'required'
    }

    // Quantity required; 0 is allowed; negatives are not
    if (
        item.value.qty === null ||
        item.value.qty === undefined ||
        Number.isNaN(item.value.qty) ||
        String(item.value.qty).trim?.() === ''
    ) {
        errors.value.qty = 'required'
    } else if (Number(item.value.qty) < 0) {
        errors.value.qty = 'lt0'
    }

    return !errors.value.name && !errors.value.qty
}

// Form submit handler (blocks until validation passes)
function submitForm() {
    // Trigger custom validation and block submit if invalid
    if (!validate()) {
        return
    }
    if (item.value.brand && !brands.value.includes(item.value.brand)) {
        brands.value.push(item.value.brand)
    }
    if (item.value.category && !categories.value.includes(item.value.category)) {
        categories.value.push(item.value.category)
    }

    emit('submit', { ...item.value })

    item.value = {
        // Reset form fields after submission
        name: '',
        qty: 1, // reset to default
        brand: '',
        category: '',
        price: 0,
        weight: 0,
        notes: '',
        checked: false // reset to unchecked after submission
    }
    // Clear errors after successful submit
    errors.value = { name: '', qty: '' }
}

// Clear specific errors as user corrects input (live feedback)
watch(() => item.value.name, (v) => {
    if (v && String(v).trim().length > 0) {
        errors.value.name = ''
    }
})

watch(() => item.value.qty, (v) => {
    if (
        v !== null &&
        v !== undefined &&
        !Number.isNaN(v) &&
        Number(v) >= 0 &&
        String(v).trim?.() !== ''
    ) {
        errors.value.qty = ''
    }
})
</script>

<style scoped>
.modal-form {
    background-color: var(--card-bg);
    color: var(--text-color);
    padding: 2rem;
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.25);
}

/* Labels follow theme colors */
label {
    color: var(--text-color);
    display: block;
    margin-bottom: 0.25rem;
    font-weight: 600;
}

/* Inputs, selects, textarea styled to match theme */
input,
textarea,
select {
    width: 100%;
    padding: 8px;
    margin-bottom: 1rem;
    border-radius: 6px;
    border: 1px solid var(--color-border, #ccc);
    background-color: var(--card-bg);
    color: var(--text-color);
    box-sizing: border-box;
}

/* Validation UI */
.error-msg {
    color: #d9534f;
    font-size: 0.875rem;
    margin-top: -0.5rem;
    margin-bottom: 0.75rem;
}

.invalid {
    border-color: #d9534f !important;
}

textarea {
    resize: vertical;
    min-height: 60px;
}

/* Form row flex for grouping */
.form-row {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

/* Form group for individual inputs */
.form-group {
    flex: 1;
    min-width: 150px;
    display: flex;
    flex-direction: column;
}

/* Full width groups like notes */
.full-width {
    width: 100%;
}

/* Button group aligned right */
.button-group {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
}

/* Submit button */
.submit-btn {
    background-color: var(--btn-bg, #4caf50);
    color: var(--btn-text, white);
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}

/* Cancel button */
.cancel-btn {
    /* Swap: cancel uses the app's blue accent */
    background-color: #3b82f6;
    color: var(--btn-text, white);
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}

.cancel-btn:hover {
    background-color: #2563eb;
}

/* Hover effect for buttons */
button:hover {
    opacity: 0.9;
}
</style>
