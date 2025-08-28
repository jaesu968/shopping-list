# Shopping List App

[![Vue 3](https://img.shields.io/badge/Vue-3.x-42b883)](#)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF)](#)
[![Node](https://img.shields.io/badge/Node-18%2B-339933)](#)
[![License](https://img.shields.io/badge/License-MIT-informational)](#)

A Vue 3 shopping list management application with a dark/light mode toggle.

This project is part of a two-phase system:

- **Phase 1:** Vue.js frontend with shopping list creation, editing, and deletion  
- **Phase 2:** Express.js backend with persistent storage in MongoDB
- **Project Team:**
- Kyle Jaesu Akuya
- Jazmin Eubanks
- Blake Kachman
- Leticia Yglecias
---

## Table of Contents
- [Features](#features)
- [How to Use](#how-to-use)
- [Architecture Overview](#architecture-overview)
- [Recommended IDE Setup](#recommended-ide-setup)
- [Project Setup](#project-setup)
- [Vue Component Documentation](#vue-component-documentation)
- [Design & Implementation Assumptions](#design--implementation-assumptions)
- [Challenges Faced](#challenges-faced)
- [Requirements Not Implemented](#requirements-not-implemented)
- [Known Bugs](#known-bugs)
- [Project Tracker](#project-tracker)
- [Procedures for Running the Application](#procedures-for-running-the-application)
- [System Versions](#system-versions)
- [Environment Files](#environment-files)
- [Scripts](#scripts)
- [Using HTTP APIs with Postman (Phase 2)](#using-http-apis-with-postman-phase-2)
- [Backend Quickstart (Minimal Express Scaffold)](#backend-quickstart-minimal-express-scaffold)

---

## Features
- Create multiple shopping lists  
- Intuitive interface for adding/modifying/removing items from shopping lists  
- Rename and delete lists
- Track and mark purchases as you shop
- Remove multiple list items at once
- Dark/light mode toggle  
- Responsive design

---

## How to Use

1) Click **“Create New Shopping List”** and enter a name  
   ![enterListName](./src/assets/README%20Assets/listName.png)

2) Click **“View”** on a list to see its items  
   ![listView](./src/assets/README%20Assets/listView.png)

3) Click **“Add Item”** to open the form and add an item  
   ![addItem](./src/assets/README%20Assets/addItem.png)

4) Click **“Update”** on items to edit them  
   ![itemUpdate](./src/assets/README%20Assets/itemUpdate.png)

5) Use **Hide / Rename / Delete** buttons to manage lists  
   ![renameList](./src/assets/README%20Assets/renameList.png)

6) Mark items as **Picked** while you shop  
   ![itemPicked](./src/assets/README%20Assets/itemPicked.png)

7) Delete individual items or select multiple and **Delete** several at a time  
   ![multiDelete](./src/assets/README%20Assets/multiDelete.png)

---

## Architecture Overview

| Layer     | Technology           | Responsibility                                                                 |
|----------|-----------------------|---------------------------------------------------------------------------------|
| Frontend | Vue.js (Phase 1)      | UI for creating, viewing, editing, deleting shopping lists; client-side routing and theme toggling |
| Backend  | Express.js (Phase 2)  | REST API endpoints to support CRUD operations for shopping lists and items     |
| Database | MongoDB (Phase 2)     | Persistent storage for shopping lists and items                                |

**Diagram (simplified):**
```
[ Vue.js Frontend ]  <—>  [ Express.js Backend ]  <—>  [ MongoDB Database ]
       |                               |                                |
  User Interface                 API Endpoints                    Data Persistence
```

---

## Recommended IDE Setup
- VS Code + Volar (disable Vetur)  
- See the Vite Configuration Reference

---

## Project Setup

```bash
# Install dependencies
npm install

# Compile and hot-reload for development
npm run dev

# Compile and minify for production
npm run build
```

---

## Vue Component Documentation

### `App.vue`
- **Role:** Root application shell
- **Responsibilities:**
  - Displays header and global theme toggle
  - Hosts `<router-view />` for child views
- **Key Features:**
  - `toggleMode()` switches between light and dark mode
  - Uses Vue reactivity (`ref`, `onMounted`, `watch`) to apply theme globally

### Additional Components (as described)
#### `ShoppingItem.vue` — Create Shopping Lists
- Shows a **Create New Shopping List** button  
- On click, displays an input for the list name  
- **Create** and **Cancel** actions  
- Emits the new list name to parent  
- Resets the form after creating a list

#### `DetailView.vue` — Selected List Details
- Reads list ID from the URL via Vue Router  
- Finds the matching list from mock data (Phase 1)  
- Renders each item using the `Card.vue` component  
- Shows a fallback message for empty/missing lists  
- Prepared for real data in Phase 2

#### `Card.vue` — Reusable Layout Component
- Two side-by-side sections (left & right) using Flexbox  
- Accepts named slots  
- Theming via CSS variables  
- Used in `DetailView.vue` (and other potential views)

#### `UpdateItem.vue` — Edit Text Component
- Reusable form to edit text (list names, items, etc.)  
- Shows an input with the current value  
- **Save** and **Cancel** actions  
- Customizable titles and button text  
- Used throughout the app for consistency

---

## Design & Implementation Assumptions
- **SPA with Vue Router**  
- **Global theme management** with `document.body.className`  
- **Simplicity & responsiveness** optimized for modern browsers

---

## Challenges Faced
- **Theme persistence:** Mode resets on refresh; needs `localStorage` or backend persistence  
- **Routing setup:** `<router-view />` prepared, minimal routing in Phase 1  
- **State management:** Local component state now; larger scale will require Pinia/Vuex  
- **Validation:** Only non-empty names validated in Phase 1  
- **Frontend/backend alignment:** Ensuring schemas match frontend fields
- **Data type consistency:** Data types match user input via API calls
- **Variable consitency:** Consistent naming of variables between frontend and backend

**Notes from backend work:**
- Deprecated MongoDB driver options (`useNewUrlParser`, `useUnifiedTopology`) removed  
- Fixed console logging for server start message  
- Verified server listening and Mongo connection once fixed

**To start a sample server (as documented):**
```bash
# from src/server1
npm run start
```

---

## Requirements Not Implemented
- Backend CRUD with Express.js + MongoDB  
- Persistence of lists/items beyond the browser session  
- Unit/integration tests  
- Full accessibility refinements (keyboard nav, ARIA)

---

## Known Bugs
- MongoDB may occasionally disconnect and show incorrect preview information in the frontend UI. Page refreshes correct this. Any data entered during this interruption continues to persist.
- Some routing paths untested due to limited router setup (404 page not verified)

---

## Project Tracker
- [📊 Phase 1](./src/assets/README%20Assets/projectTracker_phase1.csv) 
- [📊 Phase 2](./src/assets/README%20Assets/projectTracker_phase2.csv)

> 💡 Tip: If you want to download and open these in Excel, right-click and choose  
> **“Save link as…”** or use the **Download raw file** button in GitHub’s viewer.

---

## Procedures for Running the Application

### Prerequisites
- Node.js 18+  
- npm (or yarn/pnpm)

### Installation
```bash
git clone <your-fork-url>
cd shopping-list
npm install
```

### Running
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## System Versions
- **Phase 1:** Vue.js front-end  
- **Phase 2:** Express.js backend + MongoDB integration

---

## Environment Files

This project uses environment variables stored in `.env` files at the project root (same level as `package.json` and `server/`):

- `.env` — production or when using MongoDB Atlas (cloud)  
- `.env.local` — local development with a local MongoDB

> These files are **not committed** to Git. Each developer maintains their own copy.

**Example `.env` (Atlas):**
```env
# MongoDB Atlas connection string
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/shopping_app

# Port for server
PORT=3000
```

**Example `.env.local` (Local MongoDB):**
```env
# Local MongoDB connection string
MONGO_URI=mongodb://127.0.0.1:27017/shopping_app

# Port for local server
PORT=3000
```

---

## Scripts
- `npm run start` — Runs the server in production mode (inside `src/server1`)  
- `npm run dev` — Runs the server with nodemon (auto-restarts on changes) at the project root  
- `npm run dev:atlas` — Uses `.env` (Atlas connection string)  
- `npm run dev:local` — Uses `.env.local` (local MongoDB connection string)

---

## Using HTTP APIs with Postman (Phase 2)

> The backend runs at `http://localhost:8000/api` (see `src/server1/server.js`).

### Base URL
```
http://localhost:8000/api
```

### Lists
- GET `/lists` — Get all lists
- GET `/lists/:listId` — Get a single list (includes its items)
- POST `/lists` — Create a list
  ```json
  { "name": "Groceries" }
  ```
- PUT `/lists/:listId` — Rename a list
  ```json
  { "name": "Weekend Groceries" }
  ```
- DELETE `/lists/:listId` — Delete a list

### Items (within a list)
- GET `/lists/:listId/items` — Get items for a list
- POST `/lists/:listId/items` — Add an item to a list
  ```json
  {
    "name": "Milk",
    "qty": 1,
    "checked": false,
    "notes": "",
    "brand": "",
    "category": "Dairy",
    "price": 2.99,
    "weight": 1.0
  }
  ```
- PUT `/lists/:listId/items/:itemId` — Update an item (send only fields you want to change)
  ```json
  { "name": "Almond Milk", "qty": 2, "checked": true }
  ```
- DELETE `/lists/:listId/items/:itemId` — Delete an item

> Notes:
> - The API also accepts `quantity` and `picked` for compatibility; the server normalizes them to `qty` and `checked`.
> - `qty` must be an integer ≥ 0; `name` is required.

### Multi‑delete (no single bulk endpoint)
The UI performs multi‑delete by sending multiple DELETE requests. Here are two ways to do the same with cURL/Postman:

1) cURL (delete multiple `itemId`s for a given `listId`)
```bash
LIST_ID="<listId>"
for ITEM_ID in <itemId1> <itemId2> <itemId3>; do
  curl -s -X DELETE "http://localhost:8000/api/lists/$LIST_ID/items/$ITEM_ID"
done
```

2) Postman Runner (CSV/JSON data file)
- Create a `DELETE /lists/{{listId}}/items/{{itemId}}` request in a collection.
- Use the Runner with a data file containing rows of `listId,itemId` to execute deletes for each row.

### Example cURL usage
```bash
# Create a list
curl -X POST http://localhost:8000/api/lists \
  -H "Content-Type: application/json" \
  -d '{"name":"Groceries"}'

# Get all lists
curl http://localhost:8000/api/lists

# Update a list
curl -X PUT http://localhost:8000/api/lists/<listId> \
  -H "Content-Type: application/json" \
  -d '{"name":"Weekend Groceries"}'

# Delete a list
curl -X DELETE http://localhost:8000/api/lists/<listId>

# Add an item (canonical fields)
curl -X POST http://localhost:8000/api/lists/<listId>/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Milk","qty":1,"checked":false}'

# Add an item (compatibility alias fields)
curl -X POST http://localhost:8000/api/lists/<listId>/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Milk","quantity":1,"picked":false}'

# Update an item
curl -X PUT http://localhost:8000/api/lists/<listId>/items/<itemId> \
  -H "Content-Type: application/json" \
  -d '{"qty":2,"checked":true}'

# Delete multiple items (loop)
LIST_ID="<listId>" ; for ID in <itemId1> <itemId2>; do \
  curl -s -X DELETE "http://localhost:8000/api/lists/$LIST_ID/items/$ID" ; done
```

---

## Backend Quickstart (Minimal Express Scaffold)

A minimal Express backend is provided to demo the API endpoints described above.  
It uses in-memory storage (data clears on restart).

### Setup
```bash
unzip minimal-express-backend.zip
cd minimal-express-backend
npm install
cp .env.example .env   # optional, defaults to PORT=3000
npm run dev            # or: npm start
# Server will be at http://localhost:3000
```

### Endpoints implemented
- GET /api/lists
- POST /api/lists
- GET /api/lists/:listId
- PUT /api/lists/:listId
- DELETE /api/lists/:listId
- GET /api/lists/:listId/items
- POST /api/lists/:listId/items
- GET /api/lists/:listId/items/:itemId
- PUT /api/lists/:listId/items/:itemId
- DELETE /api/lists/:listId/items/:itemId
- DELETE /api/lists/:listId/items?picked=true (bulk delete picked items)

## Notes for using mongosh (MongoDB Shell)
- The collections are named lists and items 
- Example query commands: db.items.find({}) , db.lists.find({}); to find all items or find all lists

---