# Shopping List App

A Vue 3 shopping list management application with dark/light mode toggle.

## Features
- Create multiple shopping lists
- Add/remove items from lists
- Rename and delete lists
- Dark/light mode toggle
- Responsive design

## How to Use
1. Click "Create New Shopping List" to create a list
2. Click "View" to see items in a list
3. Add items using the form
4. Use rename/delete buttons to manage lists

## Project Structure
- `ShoppingListView.vue` - Main app view
- `ShoppingItem.vue` - Create new lists component
- `ItemForm.vue` - Add items to lists
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

This is a Vue App to create, update, modify and delete Shopping Lists.

The views hold the UI parts and the Components hold specifc functionality.
Example: ShoppingListView holds the main view for the app and when wanting to add items or change a list you can see the logic is in the ShoppingItem.vue file. 
