<!-- Details of a specic list item-->
 <template>
  <div>
    <h1>Item Detail</h1>
    <p>Item ID: {{ $route.params.id }}</p>
  </div>
</template>

<script>
export default {
  name: 'DetailView'
}
</script>