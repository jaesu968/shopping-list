<template>
  <div :class="`app-container ${isDark ? 'dark' : 'light'}`">
    <div class="app-wrapper">
      <header>
        <h1>Shopping List App</h1>
        <button @click="toggleMode">
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

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: var(--outer-bg);
  padding: 2rem;
}

.app-wrapper {
  width: 100%;
  max-width: 1000px;
  background-color: var(--card-bg);
  color: var(--text-color);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.15);
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

button {
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

/* Theme Variables */
.dark {
  --outer-bg: #121212;
  --card-bg: #1e1e1e;
  --text-color: #ffffff;
}

.light {
  --outer-bg: #eeeeee;
  --card-bg: #ffffff;
  --text-color: #222222;
}
</style>