<template>
  <Card>
    <!-- Left slot contains the Home button and the form to add a new shopping list -->
    <template #left>
      <div class="template-left">
        <!-- Clicking this button will reset the view back to the main screen -->
        <button class="shared-button" @click="goHome">🏠 Home</button>
        <!-- Component to create a new shopping list -->
        <ShoppingItem @add-list="addList" />
      </div>
    </template>

    <!-- Right slot shows either a message or the list of shopping lists -->
    <template #right>
      <!-- Message displayed if no lists have been created yet -->
      <div v-if="lists.length === 0">
        <p>No lists have been created. Use the controls on the left to create a list.</p>
      </div>

      <!-- Display list of created shopping lists -->
      <div v-else>
        <ul>
          <!-- Render each shopping list with actions -->
          <li v-for="(list, index) in lists" :key="list.id" class="list-entry">
            <div class="list-row">
              <!-- Display the list name -->
              <span class="list-name">{{ list.name }}</span>

              <!-- Buttons for list actions -->
              <div class="button-group">
                <!-- Toggles the visibility of the list's items -->
                <button class="action-btn" @click="selectedList = selectedList === index ? null : index">
                  {{ selectedList === index ? "Hide" : "View" }}
                </button>

                <!-- Renames the selected list -->
                <button class="action-btn" @click="renameList(index)">Rename</button>

                <!-- Deletes the selected list -->
                <button class="action-btn delete-btn" @click="deleteList(index)">Delete</button>
              </div>
            </div>
          </li>
        </ul>

        <!-- Shows the UpdateItem view if a list is currently selected -->
        <UpdateItem v-if="selectedList !== null" :list="lists[selectedList]" @update-list="updateListItems" />
      </div>
    </template>
  </Card>
</template>

<script>
// Import required components
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
      lists: [], // Stores all created shopping lists
      selectedList: null, // Index of the currently selected list
    };
  },
  methods: {
    // Adds a new shopping list with a unique ID and empty items array
    addList(listName) {
      this.lists.push({
        id: Date.now(),
        name: listName,
        items: [],
      });
    },

    // Renames the list at the given index using user input
    renameList(index) {
      const newName = prompt("Enter new list name:", this.lists[index].name);
      if (newName) this.lists[index].name = newName;
    },

    // Deletes the list at the given index after user confirmation
    deleteList(index) {
      if (confirm("Are you sure you want to delete this list?")) {
        this.lists.splice(index, 1);

        // Deselect the list if the deleted one was currently selected
        if (this.selectedList === index) {
          this.selectedList = null;
        }
      }
    },

    // Updates the items of the currently selected list
    updateListItems(updatedItems) {
      if (this.selectedList !== null) {
        this.lists[this.selectedList].items = updatedItems;
      }
    },

    // Clears the selected list to return to the main app view
    goHome() {
      this.selectedList = null;
    },
  },
};
</script>

<style scoped>
/* Layout for button group on each list row */
.button-group {
  display: flex;
  gap: 0.5rem;
}

/* Base styles for all list action buttons */
.action-btn {
  background-color: #34d399;
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

/* Specific style for the delete button */
.delete-btn {
  background-color: #ef4444 !important;
}
</style>