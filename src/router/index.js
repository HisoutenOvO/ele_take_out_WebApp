import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

import Home from '@/views/Home.vue'
import Orders from '@/views/Orders.vue'
import Profile from '@/views/Profile.vue'
import ShopDetail from '@/views/ShopDetail.vue'
import DishDetail from '@/views/DishDetail.vue'
import Checkout from '@/views/Checkout.vue'
import Payment from '@/views/Payment.vue'
import PaySuccess from '@/views/PaySuccess.vue'
import OrderResult from '@/views/OrderResult.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'

const routes = [
    {
        path: '/',
        redirect: '/index'
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { noAuth: true }
    },
    {
        path: '/index',
        name: 'Home',
        component: Home
    },
    {
        path: '/orders',
        name: 'Orders',
        component: Orders
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile
    },
    {
        path: '/shop/:id',
        name: 'ShopDetail',
        component: ShopDetail
    },
    {
        path: '/dish/:id',
        name: 'DishDetail',
        component: DishDetail
    },
    {
        path: '/checkout',
        name: 'Checkout',
        component: Checkout
    },
    {
        path: '/payment/:orderId',
        name: 'Payment',
        component: Payment
    },
    {
        path: '/pay-success',
        name: 'PaySuccess',
        component: PaySuccess
    },
    {
        path: '/order-result/:id',
        name: 'OrderResult',
        component: OrderResult
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: { noAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 全局前置守卫
router.beforeEach((to, from) => {
    if (to.meta.noAuth) return true
    const token = localStorage.getItem('token')
    if (token) return true
    ElMessage.warning('登录已超时，请重新登录')
    return '/login'
})

export default router