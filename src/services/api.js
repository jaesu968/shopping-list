// Centralized API service for the shopping list application.
// Uses a configured axios instance + response interceptor to normalize errors.
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

// Axios instance with a base URL and timeout for all requests
const http = axios.create({ baseURL: API_BASE_URL, timeout: 10000 })

http.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalize error object for consistent handling in UI
    const resp = error?.response
    const msg = resp?.data?.error || resp?.data?.message || error?.message || 'Request failed'
    error.normalizedMessage = msg
    return Promise.reject(error)
  }
)

// Helper to extract the most meaningful error message for end users
export const apiErrorMessage = (err, fallback = 'Request failed') => {
  const data = err?.response?.data
  const validationMsg = Array.isArray(data?.errors) && data.errors.length ? (data.errors[0]?.msg || data.errors[0]) : null
  return (
    err?.normalizedMessage ||
    data?.error ||
    validationMsg ||
    err?.message ||
    fallback
  )
}

const api = {
  // Shopping Lists
  getAllLists: () => http.get(`/lists`),
  getList: (id) => http.get(`/lists/${id}`),
  createList: (listData) => http.post(`/lists`, listData),
  // Update and delete list
  updateList: (id, listData) => http.put(`/lists/${id}`, listData),
  deleteList: (id) => http.delete(`/lists/${id}`),


  // Items
  getListItems: (listId) => http.get(`/lists/${listId}/items`),
  createItem: (listId, itemData) => http.post(`/lists/${listId}/items`, itemData),
  // Update and delete item
  updateItem: (listId, itemId, itemData) =>
    http.put(`/lists/${listId}/items/${itemId}`, itemData),
  deleteItem: (listId, itemId) =>
    http.delete(`/lists/${listId}/items/${itemId}`)
}

export default api
