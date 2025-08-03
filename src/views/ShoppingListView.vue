<template>
  <Card>
    <!-- Left slot: Home button and form to add a new list -->
    <template #left>
      <div class="template-left">
        <router-link to="/" class="home-button">🏠 Home</router-link>
        <ShoppingItem @add-list="addList" />
      </div>
    </template>

    <!-- Right slot: Either a message or the list of created shopping lists -->
    <template #right>
      <div v-if="lists.length === 0">
        <p>No lists yet. Create one on the left.</p>
      </div>

      <!-- Display existing lists if any -->
      <div v-else>
        <ul>
          <!-- Loop through each list and show actions -->
          <li v-for="(list, index) in lists" :key="list.id" class="list-entry">
            <span class="list-name">{{ list.name }}</span>
            <div class="button-group">
              <!-- Toggle visibility of the list's items -->
              <button class="action-btn" @click="selectedList = selectedList === index ? null : index">
                {{ selectedList === index ? "Hide" : "View" }}
              </button>
              <!-- Rename list -->
              <button class="action-btn" @click="renameList(index)">Rename</button>
              <!-- Delete list -->
              <button class="action-btn delete-btn" @click="deleteList(index)">Delete</button>
            </div>
          </li>
        </ul>

        <!-- Display UpdateItem component if a list is selected -->
        <UpdateItem
          v-if="selectedList !== null"
          :list="lists[selectedList]"
          @update-list="updateListItems"
        />
      </div>
    </template>
  </Card>
</template>

<script>
import ShoppingItem from "@/components/ShoppingItem.vue";
import Card from "@/components/Card.vue";
import UpdateItem from "@/views/UpdateItem.vue";

export default {
  components: {
    ShoppingItem,
    Card,
    UpdateItem,
  },
  data() {
    return {
      lists: [], // Array to store all created shopping lists
      selectedList: null, // Tracks which list is currently selected/viewed
    };
  },
  methods: {
    // Adds a new list with a unique ID
    addList(listName) {
      this.lists.push({
        id: Date.now(),
        name: listName,
        items: [],
      });
    },
    // Prompts the user to rename a list
    renameList(index) {
      const newName = prompt("Enter new list name:", this.lists[index].name);
      if (newName) this.lists[index].name = newName;
    },
    // Deletes a list after confirmation
    deleteList(index) {
      if (confirm("Are you sure you want to delete this list?")) {
        this.lists.splice(index, 1);
        // Reset selectedList if the deleted list was being viewed
        if (this.selectedList === index) this.selectedList = null;
      }
    },
    // Replaces items of the selected list with updated items
    updateListItems(updatedItems) {
      if (this.selectedList !== null) {
        this.lists[this.selectedList].items = updatedItems;
      }
    },
  },
};
</script>

<style scoped>
.list-entry {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.list-name {
  font-weight: 600;
  color: var(--text-color);
}

.button-group {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background-color: #34d399; /* teal */
  color: white;
  border: none;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.action-btn:hover {
  opacity: 0.9;
}

.delete-btn {
  background-color: #ef4444 !important; /* red */
}

.home-button {
  width: 100%;
  height: 40px;
  display: inline-block;
  padding: 12px 24px;
  margin-bottom: 10px;
  background-color: #2ecc71; /* green */
  color: white;
  text-decoration: none;
  font-weight: 600;
  border-radius: 4px;
  text-align: center;
  transition: background-color 0.3s ease;
}

.home-button:hover {
  background-color: #27ae60;
}
</style>

