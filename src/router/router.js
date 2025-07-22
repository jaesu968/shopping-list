// The router file is used to define the routes for the application.
// and manage the navigation between the pages or views in a single-page application (SPA).
import { createRouter, createWebHistory } from 'vue-router'; 

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/createItem',
        name: 'CreateItem',
        component: () => import('../views/CreateItemView.vue')
    },
    {
        path: '/shoppingList',
        name: 'Contact',
        component: () => import('../views/Contact.vue')
    },
    {
        path: '/detail',
        name: 'Detail',
        component: () => import('../views/Detail.vue')
    },
    {
        path: '/updateItem',
        name: 'UpdateItem',
        component: () => import('../views/UpdateItem.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../views/NotFound.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;