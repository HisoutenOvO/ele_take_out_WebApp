import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home.vue')
    },
    {
        path: '/orders',
        name: 'Orders',
        component: () => import('@/views/Orders.vue')
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/Profile.vue')
    },
    {
        path: '/shop/:id',
        name: 'ShopDetail',
        component: () => import('@/views/ShopDetail.vue')
    },
    {
        path: '/dish/:id',
        name: 'DishDetail',
        component: () => import('@/views/DishDetail.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router