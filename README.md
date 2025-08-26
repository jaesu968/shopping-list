# Shopping List App

A Vue 3 shopping list management application with dark/light mode toggle.

## Features
- Create multiple shopping lists
- Add/remove items from lists
- Rename and delete lists
- Dark/light mode toggle
- Responsive design

## How to Use
1. Click "Create New Shopping List" and enter a name

<img src="./src/assets/README%20Assets/listName.png" alt="enterListName" width="750">  

3. Click "View" on a list to see its items

<img src="./src/assets/README%20Assets/listView.png" alt="listView" width="750">

4. Select the "Add Item" button to start adding items to the list.
   A pop-out form will open to allow you to enter information about your
   item.

<img src="./src/assets/README%20Assets/addItem.png" alt="listView" width="750">

5. Click "Update" on items to edit them

<img src="./src/assets/README%20Assets/itemList.png" alt="itemList" width="750">

<img src="./src/assets/README%20Assets/itemUpdate.png" alt="itemUpdate" width="750">

6. Use the "Hide," "Rename," and "Delete" buttons to manage lists

<img src="./src/assets/README%20Assets/renameList.png" alt="renameList" width="750">

<img src="./src/assets/README%20Assets/deleteList.png" alt="deleteList" width="750">

7. Set list items as picked up as you collect your shopping items
    
<img src="./src/assets/README%20Assets/itemPicked.png" alt="itemPicked" width="750">

8. Delete individual items or select multiple items and delete
   Several at a time

<img src="./src/assets/README%20Assets/multiDelete.png" alt="multiDelete" width="750">


## Project Structure
Frontend Components

ShoppingListView.vue – Main app view displaying all lists.

ShoppingItem.vue – Component for creating new lists.

ItemForm.vue – Form for adding items to lists.

UpdateItem.vue – Reusable component for updating existing items.

Card.vue – Layout/styling component for list items or cards.

Backend

server1/Server.js – Sets up the Express server, connects to MongoDB, and defines CRUD routes for lists and items.

Services

services/api.js – API service that uses Axios to communicate with the backend server for performing CRUD operations.

## Development

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Components

- ShoppingItem.vue - Create Shopping Lists
    - Shows a "Create New Shopping List" button
    - When clicked, displays an input field for the list name
    - Has Create and Cancel buttons
    - Sends the new list name to the main view
    - Resets the form after creating a list

- DetailView.vue - Displays the details of a selected shopping list.

    - Reads the list ID from the URL using `vue-router`
    - Finds the matching list using mock data
    - Renders each item using the `Card.vue` component
    - Includes conditional logic to show a fallback message for empty or missing lists
    - Prepares for integration with real data in Phase 2

- Card.vue - Reusable layout component that accepts named slots.
    - Displays content in two side-by-side sections (`left` and `right`)
    - Built using Flexbox
    - Supports theming via CSS variables
    - Designed to work in `DetailView.vue`, and potentially other views

- UpdateItem.vue - Edit Text Component 
    - Reusable form for editing any text (list names, items, etc.)
    - Shows an input field with the current value
    - Has Save and Cancel buttons
    - Can be customized with different titles and button text
    - Used throughout the app for consistent editing experience
This is a Vue App to create, update, modify and delete Shopping Lists.

The views hold the UI parts and the Components hold specifc functionality.
Example: ShoppingListView holds the main view for the app and when wanting to add items or change a list you can see the logic is in the ShoppingItem.vue file. 

Setting Up The BackEnd 
- Came across the following when using 'node server.js' the first time: 
(node:40080) [MONGODB DRIVER] Warning: useNewUrlParser is a deprecated option: useNewUrlParser has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version
(Use `node --trace-warnings ...` to show where the warning was created)
(node:40080) [MONGODB DRIVER] Warning: useUnifiedTopology is a deprecated option: useUnifiedTopology has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version
Server is listening on port', 8000
Connected to MongoDB
 - AI assistant advised to: 
  - 1) remove deprecated MongoDB Options
   - 2) Fix Console.log Syntax Error for listening to port console logging 
After doing so receving the following in the terminal: 
Server is listening on port 8000
Connected to MongoDB

## Server 
Challenges: 
- Making sure views and components line with backend was difficult. 
- However, we overcame this by making sure fields in the schema match what is happening in the front-end vue app fields. 

## Environment files

Our project uses environment variables stored in .env files. These files (.env and .env.local) must be placed in the root of the project (the same level as package.json and server/)and contain connection strings and other settings that should not be hard-coded.

Files
-	.env for production or when using MongoDB Atlas (cloud database)       
-	.env.local → for local development with MongoDB installed on your computer

These files are not committed to GitHub. Each developer creates their own copy.
-	If using Atlas, update .env with the provided cluster URI.
-	If running MongoDB locally, use .env.local.
-	When you run the server with

Example .env
    # MongoDB Atlas connection string
    MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/shopping_app

    # Port for server
    PORT=3000

Example .env.local
    # Local MongoDB connection string
    MONGO_URI=mongodb://127.0.0.1:27017/shopping_app

    # Port for local server
    PORT=3000

## Scripts
- `npm run start` Runs the server in production mode  (use this when inside the server1 folder on the terminal)
- `npm run dev` Runs the server with Nodemon (auto-restarts on changes)  - use this at the base level of the project folder
- `npm run dev:atlas` Uses `.env` (Atlas connection string)  
- `npm run dev:local` Uses `.env.local` (local MongoDB connection string)  