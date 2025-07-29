<!-- This part describes what the page will look like-->
<!-- NotFound.vue -->
<!-- 404 Error page displayed when user visits invalid routes -->
<template>
  <div class="not-found"> <!-- Main container for 404 error page -->
    <h1>404</h1> <!-- Large 404 error number -->
    <h2>Page Not Found</h2>
    <p>The page you're looking for doesn't exist.</p>
    <router-link to="/" class="home-link"> <!-- Navigation link back to home page -->
      ← Back to Shopping List
    </router-link>
  </div>
</template>

<!-- This part describes the script for the page -->
<script> // Basic Vue component definition
export default {
  name: 'NotFound' // Component name for debugging or devtools
}
</script>

<!-- This part describes the style for the page -->
<style scoped> /* Styling*/
.not-found { /* Center the error page content */
  text-align: center;
  padding: 50px 20px;
  max-width: 500px;
  margin: 0 auto;
}

.not-found h1 { /* Large, prominent 404 number in Vue green */
  font-size: 72px;
  color: #42b883;
  margin: 0;
}

.not-found h2 { /* Subdued gray text for secondary heading */
  color: #666;
  margin: 10px 0;
}

.not-found p { /* Lighter gray for explanation text */
  color: #888;
  margin: 20px 0;
}

.home-link { /* Button styling for home link */
  display: inline-block;
  padding: 10px 20px;
  background: #42b883;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin-top: 20px;
}

.home-link:hover { /* Darker green on hover for better UX */
  background: #369870;
}
</style>