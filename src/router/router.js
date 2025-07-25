// The router file is used to define the routes for the application.
// and manage the navigation between the pages or views in a single-page application (SPA).
import ShoppingList from '../views/ShoppingListView.vue';
import { createRouter, createWebHistory } from 'vue-router'; 
import CreateItem from '../views/CreateItem.vue'; 
import UpdateItem from '../views/UpdateItem.vue';
import DetailView from '../views/DetailView.vue';


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
        name: 'DetailView',
        component: DetailView,
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../views/NotFound.vue') // Lazy loading the NotFound component
    }

]; 

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;