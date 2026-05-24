<template>
  <div class="cart-bar">
    <div class="cart-left">
      <span class="cart-icon" id="cart-icon-target">📦</span>
    </div>
    <div class="cart-center">
      <div class="cart-price">¥{{ cartStore.totalPrice }}</div>
      <div class="cart-delivery">配送费¥{{ deliveryFee }}</div>
    </div>
    <div class="cart-right">
      <button
          class="cart-btn"
          :class="{ active: cartStore.totalPrice >= minPrice }"
          @click="handleCheckout"
      >
        {{ cartStore.totalPrice >= minPrice ? '去结算' : `¥${minPrice}起送` }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const cartStore = useCartStore()

defineProps({
  deliveryFee: { type: Number, default: 0 },
  minPrice: { type: Number, default: 20 }
})

const handleCheckout = () => {
  if (cartStore.totalPrice >= minPrice) {
    // 跳转到结算页（路由后续自己定义）
    router.push('/checkout')
  }
}
</script>

<style scoped>
.cart-bar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  background: white;
  border-top: 1px solid #eee;
  padding: 12px 16px 50px;
  height: auto;
  gap: 14px;
}

.cart-left { flex-shrink: 0; }
.cart-icon { font-size: 36px; }

.cart-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.cart-price {
  font-size: 20px;
  font-weight: 700;
  color: #222;
}

.cart-delivery {
  font-size: 13px;
  color: #999;
}

.cart-btn {
  background: #ccc;
  color: white;
  border: none;
  border-radius: 22px;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.2s;
}

.cart-btn.active {
  background: #EC6C2D;
}
</style>