<!-- This part describes what the page will look like-->
<!-- NotFound.vue -->
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

<!-- This part describes the script for the page -->
<script>
export default {
  name: 'NotFound'
}
</script>

<!-- This part describes the style for the page -->
<style scoped>
.not-found {
  text-align: center;
  padding: 50px 20px;
  max-width: 500px;
  margin: 0 auto;
}

.not-found h1 {
  font-size: 72px;
  color: #42b883;
  margin: 0;
}

.not-found h2 {
  color: #666;
  margin: 10px 0;
}

.not-found p {
  color: #888;
  margin: 20px 0;
}

.home-link {
  display: inline-block;
  padding: 10px 20px;
  background: #42b883;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin-top: 20px;
}

.home-link:hover {
  background: #369870;
}
</style>