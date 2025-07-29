<template>
    <div>
        <div v-if="!showNameInput">
            <button @click="showNameInput = true">+ New Shopping List</button>
        </div>
        <div v-else>
            <input v-model="newListName" placeholder="List name..." />
            <button @click="confirmAdd">Create</button>
            <button @click="cancelAdd">Cancel</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['add-list'])
const showNameInput = ref(false)
const newListName = ref('')
const confirmAdd = () => {
    if (!newListName.value.trim()) return
    emit('add-list', newListName.value.trim())
    newListName.value = ''
    showNameInput.value = false
}
const cancelAdd = () => {
    newListName.value = ''
    showNameInput.value = false
}
</script>

<style scoped>
div {
    color: #000;
}
</style>