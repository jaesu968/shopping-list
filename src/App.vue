<template>
  <div>
    <header class="app-header">
      <div class="header-bar">
        <h1 class="app-title">Shopping List App</h1>
        <button class="btn btn-secondary theme-toggle" @click="toggleMode">
          {{ isDark ? '☀️ Light Mode' : '🌙 Dark Mode' }}
        </button>
      </div>
    </header>

    <div :class="`app-container ${isDark ? 'dark' : 'light'}`">
      <div class="app-wrapper">
        <router-view />
      </div>
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
