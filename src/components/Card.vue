<template>
  <!-- Reusable card layout with left/right sections -->
  <div class="card-container">
    <div class="card-left">
      <slot name="left"></slot>
    </div>
    <div class="card-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card'
}
</script>

<style scoped>
.card-container {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 2rem;
  padding: 1rem;
  border-radius: 8px;
  background-color: var(--card-bg);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  min-height: 120px;
}

.card-left,
.card-right {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.dark .card-container {
  --card-bg: #f1f1f1;
}

.light .card-container {
  --card-bg: #ffffff;
}
</style>