<template>
    <div class="card-container">
      <div class="card-left">
        <slot name="left" />
      </div>
      <div class="card-right">
        <slot name="right" />
      </div>
    </div>
  </template>
  
  <style scoped>
  .card-container {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    gap: 2rem;
    padding: 1rem;
    border-radius: 1rem;
    background-color: var(--card-bg);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    min-height: 400px;
  }
  
  .card-left,
  .card-right {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  </style>
  