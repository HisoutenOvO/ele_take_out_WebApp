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
          <div class="add-btn" @click.stop="handleAddClick">
            <i class="fas fa-plus"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { AddCart, DeleteCart } from '@/api/cart'

const router = useRouter()

const props = defineProps({
  dish: { type: Object, required: true },
  shopId: { type: Number, required: true },
  quantity: { type: Number, default: 0 }
})

const emit = defineEmits(['cart-changed'])

const handleAddClick = async () => {
  await AddCart({ dishId: props.dish.id, shopId: props.shopId })
  emit('cart-changed')
}

const handleMinus = async () => {
  await DeleteCart({
    shopId: Number(props.shopId),
    dishId: props.dish.id})
  console.log('减号点击，dishId:', props.dish.id)
  emit('cart-changed')
}

const goToDishDetail = () => router.push(`/dish/${props.dish.id}`)
</script>

<style scoped>
.dish-card { display: flex; align-items: center; gap: 13px; padding: 12px 10px; width: 100%; background: #fff; box-sizing: border-box; }
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