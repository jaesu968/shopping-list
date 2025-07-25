<!-- The main Shopping List View-->
 <template>
  <div class="shopping-list">
    <h1>Shopping List</h1>
    <router-link to="/create" class="create-item-link">Create New Item</router-link>
    <ul>
      <li v-for="item in items" :key="item.id">
        <router-link :to="{ name: 'DetailView', params: { id: item.id } }">
          {{ item.name }}
        </router-link>
      </li>
    </ul>
  </div>
 </template>

 <!-- The script for the Shopping List View -->
  <script> 
  export default {
    name: 'ShoppingListView',
    data() {
      return {
        items: [
          { id: 1, name: 'Apples' },
          { id: 2, name: 'Bananas' },
          { id: 3, name: 'Oranges' }
        ]
      };
    }
  };
  </script>

    <!-- The style for the Shopping List View -->
     <style> 
.shopping-list {
    padding: 20px;
    max-width: 600px;
    margin: auto;
}
     </style>