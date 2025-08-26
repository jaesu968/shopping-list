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
          <li v-for="(list, index) in lists" :key="list._id" class="list-entry">
            <div class="list-row">
              <!-- Display the list name -->
              <span class="list-name">{{ list.name }}</span>

              <!-- Buttons for list actions -->
              <div class="button-group">
                <!-- Toggles the visibility of the list's items -->
                <button class="action-btn" @click="selectList(index)">
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
// import the API service for backend communication
import api from "@/services/api.js";

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
    async addList(listName) {
      try {
        const response = await api.createList({ name: listName }); // Call the API to create a new list
        if (response.data.success) {
          this.lists.push(response.data.data); // Add the newly created list to the local lists array
        }
      } catch (error) {
        console.error('Error creating list: ', error); // Log any errors that occur during the API call
      }
    },

    // Renames the list at the given index using user input
    async renameList(index) {
    // get the current list from local state
    const current = this.lists[index];
    // ask user for new name
    const newName = prompt('Enter new list name:', current.name);

    // if user cancels or enters the same name, do nothing
      if (!newName || newName.trim() === current.name) return;
      try {
      // call backend API to update list in DB
       const response = await api.updateList(current._id, { name: newName.trim() });
       if (response.data.success) {
         this.lists[index] = response.data.data;
       }
    } catch (err) {
        console.error('Error renaming list:', err);
        alert('Rename failed.');
    }
    },

    // Deletes the list at the given index after user confirmation
    async deleteList(index) {
  // get the current list from local state
  const current = this.lists[index];

  // confirm with user before deleting
  if (!confirm(`Delete "${current.name}"?`)) return;

  try {
    // call backend API to delete from DB
    await api.deleteList(current._id);

    // remove from local state so UI updates
    this.lists.splice(index, 1);

    // reset selectedList if deleted one was selected
    if (this.selectedList === index) this.selectedList = null;

    // if you deleted an earlier index, adjust selection index
    if (this.selectedList !== null && index < this.selectedList) {
      this.selectedList -= 1;
    }

  } catch (err) {
    console.error('Error deleting list:', err);
    alert('Delete failed.');
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

    // fetch existing lists from the backend API 
    async fetchLists() {
      try { // Call the API to get all lists
        const response = await api.getAllLists(); // Assuming response.data contains the array of lists
        if (response.data.success) {
          this.lists = response.data.data; // Update the local lists with data from the backend
        }
      } catch (error) { // Log any errors that occur during the API call
        console.error('Error fetching lists: ', error); 
      }
    },
    // select a list to view its items 
    async selectList(index) {
      this.selectedList = this.selectedList === index ? null : index;
      // if a list is selected, fetch its items from the backend
      if (this.selectedList !== null) {
        // Fetch items for the selected list
        const listId = this.lists[this.selectedList]._id;
        // if list has no ID 
        if (!listId) {
          console.error('Selected list does not have a valid ID:', this.lists[this.selectedList]);
          return;
        }
        const response = await api.getListItems(listId);
        if (this.lists[this.selectedList] && response.data.success) {
          this.lists[this.selectedList].items = response.data.data; // Update the items of the selected list
        }
      }
    }
  },
    // Lifecycle hook to fetch existing lists from the backend when the component is created
  async mounted() {
    await this.fetchLists(); 
  }
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