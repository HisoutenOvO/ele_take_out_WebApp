import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
    const items = ref([])

    const totalPrice = computed(() => {
        return items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
    })

    // 将 ID 统一转成字符串
    function addItem(dish) {
        const dishId = String(dish.id)
        const exist = items.value.find(item => String(item.id) === dishId)
        if (exist) {
            exist.quantity++
        } else {
            items.value.push({ ...dish, id: dishId, quantity: 1 })
        }
    }

    function removeItem(id) {
        const dishId = String(id)
        const index = items.value.findIndex(item => String(item.id) === dishId)
        if (index === -1) return
        const item = items.value[index]
        item.quantity--
        if (item.quantity <= 0) {
            items.value.splice(index, 1)
        }
    }

    return { items, totalPrice, addItem, removeItem }
})