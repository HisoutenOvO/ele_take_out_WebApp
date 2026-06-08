<template>
  <div class="page">
    <!-- 可滚动内容区域 -->
    <div class="scroll-area">
      <!-- 第一块：剩余支付时间 -->
      <div class="countdown-section">
        <div class="countdown-row">
          <span class="countdown-label">剩余支付时间</span>
          <span class="countdown-time">{{ formattedTime }}</span>
        </div>
      </div>

      <!-- 第二块：总金额 -->
      <div class="amount-section">
        <div class="amount-row">
          <span class="amount-symbol">￥</span>
          <span class="amount-number">{{ totalAmount }}</span>
        </div>
        <div class="shop-name-row">
          <span class="shop-name">{{ shopName }}</span>
        </div>
      </div>

      <!-- 第三块：支付方式 -->
      <div class="payment-methods">
        <!-- 支付宝 -->
        <div class="payment-row" :class="{ active: payMethod === 1 }" @click="payMethod = 1">
          <img src="/img/alipay.png" class="payment-icon" alt="支付宝" />
          <span class="payment-text">支付宝</span>
          <div class="radio-circle" :class="{ active: payMethod === 1 }">
            <i v-if="payMethod === 1" class="fas fa-check"></i>
          </div>
        </div>

        <!-- 微信 -->
        <div class="payment-row" :class="{ active: payMethod === 0 }" @click="payMethod = 0">
          <img src="/img/wechat.png" class="payment-icon" alt="微信" />
          <span class="payment-text">微信</span>
          <div class="radio-circle" :class="{ active: payMethod === 0 }">
            <i v-if="payMethod === 0" class="fas fa-check"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部固定区域 -->
    <div class="bottom-bar">
      <button class="pay-btn" @click="handlePay">确认支付</button>
    </div>
  </div>
</template>

<script setup>import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { GetShopDetail } from '@/api/shop'
import { GetCartList } from '@/api/cart'
import {PayOrder} from '@/api/orders'

const cartStore = useCartStore()
const router = useRouter()
const route = useRoute()
const orderId = Number(route.params.orderId)

// 支付方式：alipay / wechat
const payMethod = ref(1)

// 剩余秒数（15分钟 = 900秒）
const remainingSeconds = ref(900)
let timer = null

// 格式化倒计时
const formattedTime = computed(() => {
  const m = Math.floor(remainingSeconds.value / 60).toString().padStart(2, '0')
  const s = (remainingSeconds.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

// ========== 总金额和商家信息 ==========
const totalAmount = ref(0)
const shopName = ref('')

const loadPaymentData = async () => {

  const shopId = Number(route.query.shopId) || Number(localStorage.getItem('currentShopId'))
  const deliveryFee = ref(0)
  const packingFee = ref(1)

  // 获取商家名称
  const shopResult = await GetShopDetail(shopId)
  if (shopResult.code === 200) {
    shopName.value = shopResult.data.name
    deliveryFee.value = shopResult.data.deliveryFee
  }

  // 获取购物车数据
  const cartResult = await GetCartList(shopId)
  if (cartResult.code === 200 && cartResult.data.length > 0) {
    totalAmount.value = cartResult.data.reduce((sum, item) => sum + item.amount * item.number, 0) - 19 + deliveryFee.value + packingFee.value
  }

}

onMounted(() => {
  loadPaymentData()
  timer = setInterval(() => {
    if (remainingSeconds.value > 0) {
      remainingSeconds.value--
    } else {
      clearInterval(timer)
    }
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})

const handlePay = async () => {
  console.log('paymethod',payMethod.value)
  await PayOrder(orderId,payMethod.value);
  await router.push('/pay-success')
}
</script>

<style scoped>
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.scroll-area {
  flex: 1;
  overflow-y: auto;
}

/* ========== 第一块：倒计时 ========== */
.countdown-section {
  width: 100%;
  height: 49px;
  padding: 30px 24px 5px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.countdown-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.countdown-label {
  font-size: 14px;
  color: #191919;
}

.countdown-time {
  font-size: 16px;
  font-weight: 700;
  color: #191919;
}

/* ========== 第二块：总金额 ========== */
.amount-section {
  width: 100%;
  padding: 5px 0 8px;
  box-sizing: border-box;
}

.amount-row {
  display: flex;
  align-items: baseline;
  justify-content: center;
}

.amount-symbol {
  font-size: 24px;
  color: #000;
  height: 34.67px;
  line-height: 34.67px;
}

.amount-number {
  font-size: 30px;
  font-weight: 600;
  color: #000;
  height: 58px;
  line-height: 58px;
}

.shop-name-row {
  width: 330px;
  height: 14.4px;
  margin: 0 50px 25px;
  text-align: center;
}

.shop-name {
  font-size: 12px;
  color: #999;
}

/* ========== 第三块：支付方式 ========== */
.payment-methods {
  width: 406px;
  margin: 5px 12px;
  padding: 15px 5px;
  box-sizing: border-box;
  background: #f9f9f9;
  border-radius: 10px;
}

.payment-row {
  width: 386px;
  height: 48px;
  margin: 0 5px;
  padding: 12px 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.payment-row + .payment-row {
  margin-top: 8px;
}

.payment-icon {
  height: 24px;
  flex-shrink: 0;
}

.payment-text {
  flex: 1;
  font-size: 16px;
  color: #000;
  padding-left: 12px;
}

.radio-circle {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.5px solid #c8ccd2;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.radio-circle i {
  font-size: 10px;
  color: #fff;
}

.radio-circle.active {
  background: #ff6200;
  border-color: #ff6200;
}

/* ========== 底部固定区域 ========== */
.bottom-bar {
  flex-shrink: 0;
  width: 100%;
  height: 86px;
  padding: 8px 16px 34px;
  background: #fff;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pay-btn {
  width: 398px;
  height: 44px;
  background: #ff6200;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>