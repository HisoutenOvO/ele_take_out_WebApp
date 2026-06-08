<template>
  <div class="page">
    <div class="scroll-area">
      <div class="countdown-section">
        <div class="countdown-row">
          <span class="countdown-label">剩余支付时间</span>
          <span class="countdown-time">{{ formattedTime }}</span>
        </div>
      </div>

      <div class="amount-section">
        <div class="amount-row">
          <span class="amount-symbol">￥</span>
          <span class="amount-number">{{ totalAmount }}</span>
        </div>
        <div class="shop-name-row">
          <span class="shop-name">{{ shopName }}</span>
        </div>
      </div>

      <div class="payment-methods">
        <div class="payment-row" :class="{ active: payMethod === 1 }" @click="payMethod = 1">
          <img src="/img/alipay.png" class="payment-icon" alt="支付宝" />
          <span class="payment-text">支付宝</span>
          <div class="radio-circle" :class="{ active: payMethod === 1 }">
            <i v-if="payMethod === 1" class="fas fa-check"></i>
          </div>
        </div>

        <div class="payment-row" :class="{ active: payMethod === 0 }" @click="payMethod = 0">
          <img src="/img/wechat.png" class="payment-icon" alt="微信" />
          <span class="payment-text">微信</span>
          <div class="radio-circle" :class="{ active: payMethod === 0 }">
            <i v-if="payMethod === 0" class="fas fa-check"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-bar">
      <button class="pay-btn" @click="handlePay">确认支付</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { PayOrder, GetOrderDetail } from '@/api/orders'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const orderId = Number(route.params.orderId)

const payMethod = ref(1)
const remainingSeconds = ref(900)
let timer = null

const formattedTime = computed(() => {
  const m = Math.floor(remainingSeconds.value / 60).toString().padStart(2, '0')
  const s = (remainingSeconds.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

const totalAmount = ref(0)
const shopName = ref('')

const loadPaymentData = async () => {
  if (!orderId) {
    ElMessage.error('订单不存在')
    router.push('/')
    return
  }
  const result = await GetOrderDetail(orderId)
  if (result.code === 200) {
    const order = result.data.order || result.data
    totalAmount.value = order.actualPayment || order.totalPrice || 0
    shopName.value = order.shopName || ''
  } else {
    ElMessage.error(result.msg || '获取订单失败')
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
  try {
    const result = await PayOrder(orderId, payMethod.value)
    if (result.code === 200) {
      router.push(`/pay-success/${orderId}`)
    } else {
      ElMessage.error(result.msg || '支付失败')
    }
  } catch {
    ElMessage.error('网络错误，请稍后重试')
  }
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