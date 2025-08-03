<!-- 
 NotFound.vue - 404 Error Page 
 Shows when users visit invalid URLs
 Provides navigation back to main app
-->
<template>
  <!-- 404 error page for invalid routes -->
  <div class="not-found">
    <!-- Error code-->
    <h1>404</h1>
    <!-- Error message -->
    <h2>Page Not Found</h2>
    <p>The page you're looking for doesn't exist.</p>
    <!-- link back to home page -->
    <router-link to="/" class="home-link">
      ← Back to Shopping List
    </router-link>
  </div>
</template>

<script>
// Simple 404 error page component 
export default {
  name: 'NotFound' // Component name for debugging 
}
</script>
