<template>
  <!-- Reusable card layout with left/right sections -->
  <div class="card-container">
  <!--Left section of the card-->
    <div class="card-left">
      <slot name="left"></slot> <!--Placeholder for left content-->
    </div>
    <!--Right section of the card-->
    <div class="card-right">
      <slot name="right"></slot> <!--Placeholder for right content-->
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card' //naming component for reuse
}
</script>

<style scoped>
.card-container {
  display: flex; /*Flexbox to layout right and left sections*/
  justify-content: space-between;
  align-items: stretch; /* ensures box heights are equal */
  gap: 2rem; /*adds space between columns*/
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
  flex-direction: column; /* stacks content vertically*/
}

.dark .card-container {
    --card-bg: #1e1e1e;
}

.light .card-container {
    --card-bg: #ffffff;
}
</style>