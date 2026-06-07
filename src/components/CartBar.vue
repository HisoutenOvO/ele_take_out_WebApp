<template>
  <div class="cart-bar">
    <div class="cart-left">
      <span class="cart-icon" id="cart-icon-target">📦</span>
    </div>
    <div class="cart-center">
      <div class="cart-price">¥{{ totalPrice }}</div>
      <div class="cart-delivery">配送费¥{{ deliveryFee }}</div>
    </div>
    <div class="cart-right">
      <button
          class="cart-btn"
          :class="{ active: totalPrice >= minPrice }"
          @click="handleCheckout"
      >
        {{ totalPrice >= minPrice ? '去结算' : `¥${minPrice}起送` }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { GetCartList } from '@/api/cart'
import { cartStore } from '@/stores/cartStore'

// 直接使用 cartStore 里的总价和购物车列表
const totalPrice = computed(() => cartStore.total)
const cartItems = computed(() => cartStore.items)

// 加载购物车
onMounted(() => cartStore.load(props.shopId))
const props = defineProps({
  shopId: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  minPrice: { type: Number, default: 0 }
})

const router = useRouter()

const loadCart = async () => {
  // 直接打印，确认函数被调用
  console.log('CartBar loadCart 被调用了，shopId:', props.shopId)
  const result = await GetCartList(props.shopId)
  console.log('CartBar 获取到的 result:', result)
  if (result.code === 200) {
    cartItems.value = result.data
    console.log('CartBar cartItems 赋值后:', cartItems.value)
  }
}

const handleCheckout = () => {
  if (totalPrice.value >= props.minPrice) {
    console.log('CartBar 收到的 shopId:', props.shopId)
    localStorage.setItem('currentShopId', props.shopId) // 存储 shopId
    router.push('/checkout')
  }
}

onMounted(() => {
  console.log('CartBar onMounted 执行了')
  loadCart()
})
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
.cart-center { flex: 1; display: flex; flex-direction: column; gap: 3px; }
.cart-price { font-size: 20px; font-weight: 700; color: #222; }
.cart-delivery { font-size: 13px; color: #999; }
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
.cart-btn.active { background: #EC6C2D; }
</style>