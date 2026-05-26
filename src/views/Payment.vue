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
        <div class="payment-row" :class="{ active: payMethod === 'alipay' }" @click="payMethod = 'alipay'">
          <img src="/img/alipay.png" class="payment-icon" alt="支付宝" />
          <span class="payment-text">支付宝</span>
          <div class="radio-circle" :class="{ active: payMethod === 'alipay' }">
            <i v-if="payMethod === 'alipay'" class="fas fa-check"></i>
          </div>
        </div>

        <!-- 微信 -->
        <div class="payment-row" :class="{ active: payMethod === 'wechat' }" @click="payMethod = 'wechat'">
          <img src="/img/wechat.png" class="payment-icon" alt="微信" />
          <span class="payment-text">微信</span>
          <div class="radio-circle" :class="{ active: payMethod === 'wechat' }">
            <i v-if="payMethod === 'wechat'" class="fas fa-check"></i>
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

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 支付方式：alipay / wechat
const payMethod = ref('alipay')

// 剩余秒数（15分钟 = 900秒）
const remainingSeconds = ref(900)
let timer = null

// 格式化倒计时
const formattedTime = computed(() => {
  const m = Math.floor(remainingSeconds.value / 60).toString().padStart(2, '0')
  const s = (remainingSeconds.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

onMounted(() => {
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

// 模拟数据
const totalAmount = ref(99.93)
const shopName = ref('必胜客之超级强迪')

const handlePay = () => {
  alert(`使用${payMethod.value === 'alipay' ? '支付宝' : '微信'}支付`)
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