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
2. Click "View" on a list to see its items
3. Add items using the form that appears
4. Click "Update" on items to edit them
5. Use "Rename" and "Delete" buttons to manage lists

## Project Structure
- `ShoppingListView.vue` - Main app view
- `ShoppingItem.vue` - Create new lists component
- `ItemForm.vue` - Add items to lists
- `UpdateForm.vue` - Reusable update component for items
- `Card.vue` - Layout component

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

- UpdateForm.vue - Edit Text Component 
    - Reusable form for editing any text (list names, items, etc.)
    - Shows an input field with the current value
    - Has Save and Cancel buttons
    - Can be customized with different titles and button text
    - Used throughout the app for consistent editing experience
This is a Vue App to create, update, modify and delete Shopping Lists.

The views hold the UI parts and the Components hold specifc functionality.
Example: ShoppingListView holds the main view for the app and when wanting to add items or change a list you can see the logic is in the ShoppingItem.vue file. 
