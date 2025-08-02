<template>
  <div :class="`app-container ${isDark ? 'dark' : 'light'}`">
    <div class="app-wrapper">
      <header class="app-header">
        <h1>Shopping List App</h1>
        <button class="btn btn-secondary" @click="toggleMode">
          {{ isDark ? '☀️ Light Mode' : '🌙 Dark Mode' }}
        </button>
      </header>
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const isDark = ref(true)

const toggleMode = () => {
  isDark.value = !isDark.value
}

onMounted(() => {
  document.body.className = isDark.value ? 'dark' : 'light'
})

watch(isDark, (newVal) => {
  document.body.className = newVal ? 'dark' : 'light'
})
</script>
