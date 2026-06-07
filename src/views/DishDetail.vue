<template>
  <div class="page">
    <!-- 返回按钮 -->
    <div
        class="back-btn-fixed"
        :style="{ color: backBtnColor }"
        @click="$router.back()"
    >
      <i class="fas fa-chevron-left"></i>
    </div>

    <!-- 可滚动区域 -->
    <div
        class="scroll-area"
        ref="scrollAreaRef"
        @scroll="handleScroll"
    >
      <!-- 顶部菜品大图 430×430 -->
      <div class="dish-hero">
        <img :src="dishInfo.image" class="hero-img" alt="菜品图" />
      </div>

      <!-- 菜名容器 -->
      <div class="dish-info-card">
        <!-- 第一行：价格区域（渐变背景） -->
        <div class="price-row">
          <div class="price-wrapper">
            <span class="price-symbol">￥</span>
            <span class="price-number">{{ dishInfo.price }}</span>
          </div>
        </div>

        <!-- 第二行：标题 -->
        <div class="title-row">
          <span class="dish-title">{{ dishInfo.name }}</span>
        </div>

        <!-- 第三行：月售 + 加购按钮 / 加减组件 -->
        <div class="action-row">
          <span class="monthly-sales">月售{{ dishInfo.monthlySales }}</span>

          <button
              v-if="quantity === 0"
              class="add-cart-btn"
              @click="handleAddToCart"
          >
            ＋加入购物车
          </button>

          <div v-else class="cart-controls">
            <div class="minus-btn" @click="handleMinus">
              <i class="fas fa-minus"></i>
            </div>
            <span class="quantity-text">{{ quantity }}</span>
            <div class="add-btn" @click="handleAddToCart">
              <i class="fas fa-plus"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- 第一部分：详情/评价标签栏 -->
      <div class="tab-bar-dish">
        <span class="tab-item active">详情</span>
        <span class="tab-item">评价</span>
      </div>

      <!-- 第二部分：详情容器 -->
      <div class="detail-container">
        <!-- 商品详情标题 -->
        <div class="detail-title">商品详情</div>

        <!-- 具体信息容器 -->
        <div class="detail-content">
          <!-- 第一行：商品描述（可能两行） -->
          <div class="detail-row multi-line">
            <span class="detail-label">商品描述</span>
            <span class="detail-value">{{ dishInfo.description }}</span>
          </div>

          <!-- 第二行：原料 -->
          <div class="detail-row single-line">
            <span class="detail-label">原料</span>
            <span class="detail-value">{{ dishInfo.ingredients }}</span>
          </div>

          <!-- 第三行：份量 -->
          <div class="detail-row single-line">
            <span class="detail-label">份量</span>
            <span class="detail-value">{{ dishInfo.serving }}</span>
          </div>

          <!-- 第四行：价格说明（只有左侧） -->
          <div class="detail-row single-line no-value">
            <span class="detail-label">价格说明</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部购物车栏 -->
    <CartBar
        :deliveryFee="shopInfo.deliveryFee"
        :minPrice="shopInfo.minPrice"
    />
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import CartBar from '@/components/CartBar.vue'
import { GetDishById } from '@/api/dish'
import { GetShopDetail } from '@/api/shop'
import {ElMessage} from "element-plus";// 引入 cartStore
import { cartStore } from '@/stores/cartStore'
import {AddCart, DeleteCart} from "@/api/cart.js";

// 数量直接从 Store 中获取
const quantity = computed(() => cartStore.getQuantity(dishInfo.value.id))

// 加购操作，操作后刷新 Store
const handleAddToCart = async () => {
  await AddCart({ dishId: dishInfo.value.id, shopId: dishInfo.value.shopId || shopId.value })
  await cartStore.load(dishInfo.value.shopId || shopId.value)
}

// 减购操作，操作后刷新 Store
// 减购操作
const handleMinus = async () => {
  await DeleteCart({ dishId: dishInfo.value.id, shopId: dishInfo.value.shopId || shopId.value })
  await cartStore.load(dishInfo.value.shopId || shopId.value)
}

const route = useRoute()
const dishId = route.params.id
const shopId = ref(1)
const dishInfo = ref({})


const search = async() => {
  const result = await GetDishById(dishId)
  if(result.code === 200){
    dishInfo.value = result.data
    shopId.value = result.data.shopId
  }else{
    ElMessage.error(result.msg)
  }
}

const GetShopInfo = async() => {
  const result = await GetShopDetail(shopId.value)
  if(result.code === 200){
    shopInfo.value.deliveryFee = result.data.deliveryFee
    shopInfo.value.minPrice = result.data.minPrice
  }
}

const shopInfo = ref({
  deliveryFee: 5,
  minPrice: 88
})



// 返回按钮动画
const scrollAreaRef = ref(null)
const scrollTop = ref(0)
const transitionEnd = 150

const progress = computed(() => Math.min(scrollTop.value / transitionEnd, 1))

const backBtnColor = computed(() => {
  const r = 255, g = 255, b = 255
  const finalR = 0, finalG = 0, finalB = 0
  const p = progress.value
  return `rgb(${Math.round(r + (finalR - r) * p)}, ${Math.round(g + (finalG - g) * p)}, ${Math.round(b + (finalB - b) * p)})`
})

const handleScroll = () => {
  if (scrollAreaRef.value) {
    scrollTop.value = scrollAreaRef.value.scrollTop
  }
}

onMounted(async()=>{
  await search();
  await GetShopInfo();
})
</script>

<style scoped>
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.back-btn-fixed {
  position: fixed;
  top: 0;
  left: 16px;
  height: 76px;
  display: flex;
  align-items: center;
  z-index: 110;
  font-size: 22px;
  cursor: pointer;
  padding: 8px;
}

.scroll-area {
  flex: 1;
  overflow-y: auto;
}

/* 顶部大图 */
.dish-hero {
  width: 100%;
  max-width: 430px;
  height: 430px;
  overflow: hidden;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 菜名容器 */
.dish-info-card {
  width: 402.5px;
  margin: 9.173px 13.76px 0;
  padding: 0 13.76px 13.76px;
  background: #fff;
  border-radius: 8px;
  box-sizing: border-box;
}

.price-row {
  background: linear-gradient(to bottom, #ffe4cc, #fff);
  margin-left: -13.76px;
  margin-right: -13.76px;
  padding: 10.32px 13.76px;
  margin-bottom: 2.17px;
}

.price-wrapper {
  display: flex;
  align-items: baseline;
}

.price-symbol {
  font-size: 17.2px;
  font-family: AlibabaSans102, sans-serif;
  color: #111920;
  margin: 0 0 2.17px 0;
}

.price-number {
  font-size: 29.8px;
  font-weight: 700;
  font-family: AlibabaSans102, sans-serif;
  color: #111920;
  margin-left: 3.44px;
}

.title-row {
  margin: 13.76px 0 5.733px;
}

.dish-title {
  font-size: 22.933px;
  font-weight: 700;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #111920;
  line-height: 1.3;
  word-break: break-all;
}

.action-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 38.98px;
}

.monthly-sales {
  font-size: 13.76px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #7c889c;
  margin-top: 6.88px;
}

.add-cart-btn {
  width: 149px;
  height: 45px;
  background: #ff6200;
  border: none;
  border-radius: 22px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.cart-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.minus-btn {
  width: 30px;
  height: 30px;
  border: 1px solid #ff6200;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff6200;
  font-size: 14px;
  cursor: pointer;
}

.quantity-text {
  font-size: 16px;
  font-weight: 600;
  color: #111920;
}

.add-btn {
  width: 30px;
  height: 30px;
  background: #ff6200;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

/* ===== 第一部分：详情/评价标签栏 ===== */
.tab-bar-dish {
  width: 430px;
  height: 49.03px;
  background: #f2f2f2;
  display: flex;
  align-items: center;
  padding: 18.3467px 0 8.02668px 13.76px;
  box-sizing: border-box;
  gap: 50px;
  margin-top: 9.173px;
}

.tab-bar-dish .tab-item {
  font-size: 17.2px;
  color: #111920;
  position: relative;
  cursor: default;
  height: 22.67px;
  line-height: 22.67px;
}

.tab-bar-dish .tab-item.active {
  font-weight: bold;
}

.tab-bar-dish .tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 18px;
  height: 3px;
  background: #111920;
  border-radius: 2px;
}

/* ===== 第二部分：详情容器 ===== */
.detail-container {
  width: 402.5px;
  margin: 9.17332px 13.76px 0;
  padding: 18.3467px 13.76px;
  background: #fff;
  border-radius: 8px;
  box-sizing: border-box;
}

.detail-title {
  font-size: 18.3467px;
  font-weight: 700;
  color: #111920;
  height: 26.67px;
  line-height: 26.67px;
}

.detail-content {
  width: 375px;
  margin-top: 15.48px;
}

.detail-row {
  display: flex;
  align-items: flex-start;
}

.detail-label {
  width: 65.16px;
  font-size: 14.906px;
  color: #999;
  flex-shrink: 0;
  white-space: nowrap;      /* 新增：永远单行 */
  /* letter-spacing: 2.84px;  删掉这行 */
}

.detail-value {
  flex: 1;
  margin-left: 13.76px;
  font-size: 14.9067px;
  color: #191919;
  line-height: 1.4;
}

/* 第一行（可能多行文本） */
.detail-row.multi-line {
  margin-bottom: 13.76px;
}

/* 第二行和第三行：单行，有底margin 13.76px */
.detail-row.single-line {
  height: 21.79px;
  align-items: center;
  margin-bottom: 13.76px;
}

.detail-row.single-line .detail-label {
  height: 21.79px;
  line-height: 21.79px;
}

.detail-row.single-line .detail-value {
  height: 21.79px;
  line-height: 21.79px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* 第四行：只有左侧，无margin */
.detail-row.no-value {
  margin-bottom: 0;
}
</style>