import { reactive } from 'vue'
import { GetCartList } from '@/api/cart'

export const cartStore = reactive({
    items: [],
    total: 0,

    async load(shopId) {
        const result = await GetCartList(shopId)
        if (result.code === 200) {
            this.items = result.data
            this.total = this.items.reduce((sum, item) => sum + item.amount * item.number, 0)
        }
    },

    getQuantity(dishId) {
        const item = this.items.find(i => i.dishId === dishId)
        return item ? item.number : 0
    },

    // 👇 关键：清空购物车数据，用于退出登录时调用
    clear() {
        this.items = []
        this.total = 0
    }
})