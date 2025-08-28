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

  <!-- Styled modals mounted inline for this view -->
  <div v-if="showDeleteConfirm" class="modal-overlay">
    <div class="modal">
      <h3 class="modal-title">Confirm Deletion</h3>
      <p class="modal-message">
        Are you sure you would like to delete the list "{{ lists[pendingDeleteIndex]?.name }}"?
      </p>
      <div class="button-row">
        <button class="cancel-button" @click="onDeleteCancel">Cancel</button>
        <button class="delete-btn" @click="onDeleteConfirm">Delete</button>
      </div>
    </div>
  </div>

  <!-- Inline styled prompt for rename (saves on Enter as well) -->
  <div v-if="showRenamePrompt" class="modal-overlay">
    <div class="modal">
      <h3 class="modal-title">Rename List</h3>
      <label class="label" for="rename-input">New name</label>
      <input id="rename-input" v-model="renameDraft" placeholder="Enter new list name" @keyup.enter="onRenameConfirm(renameDraft)" />
      <div class="button-row">
        <button class="cancel-button" @click="onRenameCancel">Cancel</button>
        <button class="primary-button" :disabled="!renameDraft || !renameDraft.trim().length" @click="onRenameConfirm(renameDraft)">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
// Import required components
import ShoppingItem from "@/components/ShoppingItem.vue";
import Card from "@/components/Card.vue";
import UpdateItem from "@/views/UpdateItem.vue";
// import the API service for backend communication
import api, { apiErrorMessage } from "@/services/api.js";

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
      // Modal state
      showDeleteConfirm: false,
      pendingDeleteIndex: null,
      showRenamePrompt: false,
      pendingRenameIndex: null,
      renameDraft: '',
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
        alert(`Failed to create list: ${apiErrorMessage(error, 'Create failed')}`);
      }
    },

    // Renames the list at the given index using a styled modal prompt
    async renameList(index) {
      // Open styled prompt modal
      const current = this.lists[index];
      this.pendingRenameIndex = index;
      this.renameDraft = current.name;
      this.showRenamePrompt = true;
    },

    async onRenameConfirm(newName) {
      const index = this.pendingRenameIndex;
      if (index === null) return;
      const current = this.lists[index];
      try {
        const response = await api.updateList(current._id, { name: newName.trim() });
        if (response.data.success) {
          this.lists[index] = response.data.data;
        }
      } catch (err) {
        console.error('Error renaming list:', err);
        // alert('Rename failed.');
        alert(`Rename failed: ${apiErrorMessage(err, 'Rename failed')}`);
      } finally {
        this.showRenamePrompt = false;
        this.pendingRenameIndex = null;
        this.renameDraft = '';
      }
    },

    onRenameCancel() {
      this.showRenamePrompt = false;
      this.pendingRenameIndex = null;
      this.renameDraft = '';
    },

    // Deletes the list at the given index (opens styled confirm first)
    async deleteList(index) {
      this.pendingDeleteIndex = index;
      this.showDeleteConfirm = true;
      return;
    },

    async onDeleteConfirm() {
      const index = this.pendingDeleteIndex;
      if (index === null) return;
      const current = this.lists[index];
      try {
        await api.deleteList(current._id);
        this.lists.splice(index, 1);
        if (this.selectedList === index) this.selectedList = null;
        if (this.selectedList !== null && index < this.selectedList) {
          this.selectedList -= 1;
        }
      } catch (err) {
        console.error('Error deleting list:', err);
        // alert('Delete failed.');
        alert(`Delete failed: ${apiErrorMessage(err, 'Delete failed')}`);
      } finally {
        this.showDeleteConfirm = false;
        this.pendingDeleteIndex = null;
      }
    },

    onDeleteCancel() {
      this.showDeleteConfirm = false;
      this.pendingDeleteIndex = null;
    },
    // Toast helpers (duplicate block commented out below to avoid duplication)
    // showToast(text, type = 'error', duration = 3500) {
    //   const id = ++this.toastCounter;
    //   this.toasts.push({ id, text, type });
    //   setTimeout(() => this.removeToast(id), duration);
    // },
    // notifyError(text) {
    //   this.showToast(text, 'error');
    // },
    // removeToast(id) {
    //   this.toasts = this.toasts.filter(t => t.id !== id);
    // },

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
        alert(`Failed to fetch lists: ${apiErrorMessage(error, 'Fetch failed')}`);
      }
    },
    // Toast helpers removed
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
        try {
          const response = await api.getListItems(listId);
          if (this.lists[this.selectedList] && response.data.success) {
            this.lists[this.selectedList].items = response.data.data; // Update the items of the selected list
          }
        } catch (e) {
          console.error('Error fetching items: ', e);
          alert(`Failed to fetch items: ${apiErrorMessage(e, 'Fetch items failed')}`);
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

<style scoped>
/* Inline modal styles (matching theme variables) */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 1.5rem;
  border-radius: 12px;
  min-width: 320px;
  max-width: 90%;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
  background-color: var(--card-bg);
  color: var(--text-color);
}

.modal-title { margin: 0 0 0.75rem 0; }
.modal-message { margin-bottom: 1rem; }
.label { display: block; margin-bottom: 0.25rem; }
input#rename-input {
  width: 100%;
  padding: 8px;
  margin-bottom: 1rem;
  border-radius: 6px;
  border: 1px solid var(--color-border, #ccc);
  background-color: var(--card-bg);
  color: var(--text-color);
  box-sizing: border-box;
}
.button-row { display: flex; justify-content: flex-end; gap: 0.75rem; }
/* .submit-btn and .cancel-btn replaced by project-wide .primary-button and .cancel-button */
/* .submit-btn { ... } */
/* .cancel-btn { ... } */
button:disabled { opacity: 0.6; cursor: not-allowed; }

/* Removed toast styles */
</style>
