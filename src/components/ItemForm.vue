<template>
    <form @submit.prevent="submitForm" class="modal-form">
        <div class="form-row">
            <div class="form-group">
                <label for="itemName">Item Name:</label>
                <input id="itemName" v-model="item.name" required />
            </div>
            <div class="form-group">
                <label for="quantity">Quantity:</label>
                <input id="quantity" v-model.number="item.quantity" required type="number" />
            </div>
        </div>

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

        <div class="form-group full-width">
            <label for="notes">Notes:</label>
            <textarea id="notes" v-model="item.notes"></textarea>
        </div>

        <div class="button-group">
            <button type="submit" class="submit-btn">Add to List</button>
            <button type="button" class="cancel-btn" @click="$emit('cancel')">Cancel</button>
        </div>
    </form>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['submit', 'cancel'])

const item = ref({
    name: '',
    quantity: '',
    brand: '',
    category: '',
    price: '',
    weight: '',
    notes: ''
})

const brands = ref([])
const categories = ref([])

function submitForm() {
    if (item.value.brand && !brands.value.includes(item.value.brand)) {
        brands.value.push(item.value.brand)
    }
    if (item.value.category && !categories.value.includes(item.value.category)) {
        categories.value.push(item.value.category)
    }

    emit('submit', { ...item.value })

    item.value = {
        name: '',
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
.modal-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    width: 100%;
    max-width: 700px;
    margin: 0 auto;
    background-color: #1e1e1e;
    color: #f0f0f0;
    border-radius: 8px;
}

.form-row {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.form-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 150px;
}

.full-width {
    width: 100%;
}

textarea {
    resize: vertical;
    min-height: 60px;
}

input,
textarea {
    padding: 0.5rem;
    border: 1px solid #555;
    border-radius: 4px;
    background-color: #2c2c2c;
    color: white;
}

.button-group {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
}

.submit-btn {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 4px;
}

.cancel-btn {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 4px;
}

button:hover {
    opacity: 0.9;
}
</style>
