import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
    const items = ref([])

    const totalPrice = computed(() => {
        return items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
    })

    const addItem = (dish) => {
        const exist = items.value.find(item => item.id === dish.id)
        if (exist) {
            exist.quantity++
        } else {
            items.value.push({ ...dish, quantity: 1 })
        }
    }

    const removeItem = (id) => {
        const exist = items.value.find(item => item.id === id)
        if (exist) {
            exist.quantity--
            if (exist.quantity <= 0) {
                items.value = items.value.filter(item => item.id !== id)
            }
        }
    }

    return { items, totalPrice, addItem, removeItem }
})