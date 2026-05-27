<template>
  <div class="dish-card" @click="goToDishDetail">
    <div class="dish-img-area">
      <img :src="dish.image" class="dish-img" alt="菜品图" />
    </div>
    <div class="dish-info">
      <div class="dish-name">{{ dish.name }}</div>
      <div class="dish-desc">{{ dish.description }}</div>
      <div class="dish-sales">月售{{ dish.monthlySales }}</div>
      <div class="dish-price-row">
        <span class="dish-price">¥{{ dish.price }}</span>
        <div class="action-group">
          <div class="minus-btn" v-if="quantity > 0" @click.stop="handleMinus">
            <i class="fas fa-minus"></i>
          </div>
          <span class="quantity" v-if="quantity > 0">{{ quantity }}</span>
          <div class="add-btn" ref="addBtnRef" @click.stop="handleAddClick">
            <i class="fas fa-plus"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'

// 在 props 定义之后添加
const router = useRouter()

const goToDishDetail = () => {
  router.push(`/dish/${props.dish.id}`)
}
const props = defineProps({
  dish: { type: Object, required: true }
})

const cartStore = useCartStore()
const addBtnRef = ref(null)

const quantity = computed(() => {
  const item = cartStore.items.find(i => String(i.id) === String(props.dish.id))
  return item ? item.quantity : 0
})

// 获取购物车图标中心位置
const getCartIconPos = () => {
  const target = document.getElementById('cart-icon-target')
  if (!target) {
    return { x: window.innerWidth / 2, y: window.innerHeight - 40 }
  }
  const rect = target.getBoundingClientRect()
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  }
}

const handleAddClick = () => {
  const btn = addBtnRef.value
  if (!btn) {
    cartStore.addItem(props.dish)
    return
  }

  // 创建飞行动画元素
  const flyEl = document.createElement('div')
  // 设置基本样式
  flyEl.style.cssText = `
    position: fixed;
    z-index: 9999;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ff6200;
    color: #fff;
    border-radius: 50%;
    font-size: 14px;
    pointer-events: none;
    left: 0;
    top: 0;
    transition: none;
  `
  flyEl.innerHTML = '<i class="fas fa-plus"></i>'
  document.body.appendChild(flyEl)

  const btnRect = btn.getBoundingClientRect()
  const startX = btnRect.left + btnRect.width / 2 - 12
  const startY = btnRect.top + btnRect.height / 2 - 12

  const endPos = getCartIconPos()
  const endX = endPos.x - 12
  const endY = endPos.y - 12

  // 抛物线中间点：向左上方偏移
  const midX = startX - 60
  const midY = startY - 40

  // 使用 Web Animations API 创建平滑抛物线
  const keyframes = [
    { left: startX + 'px', top: startY + 'px', transform: 'scale(1)', opacity: 1 },
    { left: midX + 'px', top: midY + 'px', transform: 'scale(0.8)', opacity: 1 },
    { left: endX + 'px', top: endY + 'px', transform: 'scale(0.3)', opacity: 0.5 }
  ]

  const animation = flyEl.animate(keyframes, {
    duration: 600,
    easing: 'ease-out',
    fill: 'forwards'
  })

  animation.onfinish = () => {
    flyEl.remove()
    cartStore.addItem(props.dish)
  }
}

const handleMinus = () => cartStore.removeItem(props.dish.id)
</script>

<style scoped>
.dish-card {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 12px 10px;
  width: 100%;
  background: #fff;
  box-sizing: border-box;
}
.dish-img-area { width: 110px; height: 110px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.dish-img { width: 100%; height: 100%; object-fit: cover; border-radius: 10px; }
.dish-info { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.dish-name { font-size: 16px; font-weight: 600; color: #111920; line-height: 1.3; max-width: 100%; word-break: break-word; margin-bottom: 4px; }
.dish-desc { font-size: 12px; color: #999; line-height: 1.4; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; margin-bottom: 4px; }
.dish-sales { font-size: 11px; color: #7c889c; margin-bottom: 4px; }
.dish-price-row { display: flex; align-items: center; justify-content: space-between; margin-top: auto; }
.dish-price { font-size: 18px; font-weight: 600; color: #111920; }
.action-group { display: flex; align-items: center; gap: 6px; }
.minus-btn { width: 26px; height: 26px; border: 1px solid #ff6200; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #ff6200; font-size: 12px; cursor: pointer; }
.quantity { font-size: 14px; font-weight: 600; color: #111920; min-width: 16px; text-align: center; }
.add-btn { width: 26px; height: 26px; background: #ff6200; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px; cursor: pointer; }
</style>