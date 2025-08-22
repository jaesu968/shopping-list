/* this file provides an API service for the shopping list application
it uses axios to make HTTP requests to the backend server
// the API endpoints are defined for managing shopping lists and items
// the base URL is set to the backend server's address
// this allows the frontend to interact with the backend easily
the API service can be imported and used in Vue components or other services
*/
// src/services/api.js
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

const api = {
  // Shopping Lists
  getAllLists: () => axios.get(`${API_BASE_URL}/lists`),
  createList: (listData) => axios.post(`${API_BASE_URL}/lists`, listData),
  
  // Items
  getListItems: (listId) => axios.get(`${API_BASE_URL}/lists/${listId}/items`),
  createItem: (listId, itemData) => axios.post(`${API_BASE_URL}/lists/${listId}/items`, itemData)

}

export default api
