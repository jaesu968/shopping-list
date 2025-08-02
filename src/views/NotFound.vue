<template>
  <div class="not-found">
    <h1>404</h1>
    <h2>Page Not Found</h2>
    <p>The page you're looking for doesn't exist.</p>
    <router-link to="/" class="home-link">
      ← Back to Shopping List
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>
