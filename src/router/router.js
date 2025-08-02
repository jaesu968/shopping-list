import { createRouter, createWebHistory } from 'vue-router';
import ShoppingList from '../views/ShoppingListView.vue';
import CreateItem from '../views/CreateItem.vue';       // <-- updated to use your view
import UpdateItem from '../views/UpdateItem.vue';
import DetailView from '../views/DetailView.vue';

const routes = [
  {
    path: '/',
    name: 'ShoppingList',
    component: ShoppingList,
  },
  {
    path: '/create',
    name: 'CreateItem',
    component: CreateItem,  // Use the view here, not the form component
  },
  {
    path: '/update/:id',
    name: 'UpdateItem',
    component: UpdateItem,
  },
  {
    path: '/detail/:id',
    name: 'DetailView',
    component: DetailView,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
