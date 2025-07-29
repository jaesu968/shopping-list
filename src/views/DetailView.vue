<template>
  <Card>
    <template #left>
      <h2>List Detail</h2>
      <p>This would display list metadata or a summary.</p>
    </template>
    <template #right>
      <p>This is where individual list items would be shown.</p>
    </template>
  </Card>
</template>

<script setup>
import Card from '../components/Card.vue'
</script>