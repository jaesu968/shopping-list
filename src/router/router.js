// The router file is used to define the routes for the application.
// and manage the navigation between the pages or views in a single-page application (SPA).
import ShoppingList from '../views/ShoppingList.vue';
import { createRouter, createWebHistory } from 'vue-router'; 
import CreateItem from '../views/CreateItem.vue'; 
import UpdateItem from '../views/UpdateItem.vue';
import Detail from '../views/DetailView.vue';


const routes = [
    {
        path: '/',
        name: 'ShoppingList',
        component: ShoppingList
    },
    {
        path: '/create',
        name: 'CreateItem',
        component: CreateItem 
    },
    {
        path: '/update/:id',
        name: 'UpdateItem',
        component: UpdateItem
    },
    {
        path: '/detail/:id',
        name: 'Detail',
        component: DetailView,
    },
]; 

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;