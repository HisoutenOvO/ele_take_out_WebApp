import { reactive } from 'vue'

// 全局共享的购物车数据
export const cartStore = reactive({
    items: [],       // 购物车列表
    total: 0,        // 总价

    // 加载购物车
    async load(shopId) {
        const { GetCartList } = await import('@/api/cart')
        const result = await GetCartList(shopId)
        if (result.code === 200) {
            this.items = result.data
            this.total = this.items.reduce((sum, item) => sum + item.amount * item.number, 0)
        }
    },

    // 获取某个菜品的数量
    getQuantity(dishId) {
        const item = this.items.find(i => i.dishId === dishId)
        return item ? item.number : 0
    }
})