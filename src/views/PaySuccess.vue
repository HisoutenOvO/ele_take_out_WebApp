<template>
  <div class="page">
    <div class="scroll-area">
      <div class="gray-wrapper">
        <div class="white-block top-block">
          <div class="spacer-28"></div>
          <div class="top-row">
            <span class="back-arrow" @click="goToOrders">←</span>
          </div>
        </div>

        <div class="white-block success-block">
          <div class="success-content">
            <div class="success-icon">
              <div class="check-circle">
                <i class="fas fa-check"></i>
              </div>
            </div>
            <div class="success-title">支付成功</div>
            <div class="success-amount">
              <span class="amount-symbol">￥</span>
              <span class="amount-number">{{ payAmount }}</span>
            </div>
            <div class="success-hint">感谢您的购买，祝您用餐愉快</div>
          </div>
        </div>

        <div class="white-block btn-block">
          <button class="done-btn" @click="goToOrders">完成</button>
        </div>

        <div class="gray-spacer"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const cartStore = useCartStore()

// 从购物车 Store 读取实际支付金额
const payAmount = computed(() => cartStore.totalPrice)

const goToOrders = () => {
  router.push('/orders')
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

/* ========== 灰色背景大容器 ========== */
.gray-wrapper {
  background: #f3f6f8;
  min-height: 100%;
}

/* ========== 白色内容块 ========== */
.white-block {
  background: #fff;
}

/* ========== 顶部空白 + 返回箭头 ========== */
.spacer-28 {
  width: 100%;
  height: 28px;
}

.top-row {
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  box-sizing: border-box;
}

.back-arrow {
  font-size: 24px;
  cursor: pointer;
  color: #111920;
}

/* ========== 支付成功内容 ========== */
.success-block {
  padding-bottom: 24px;
}

.success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0 20px;
}

.success-icon {
  margin-bottom: 24px;
}

.check-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #00c853;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-circle i {
  font-size: 36px;
  color: #fff;
}

.success-title {
  font-size: 22px;
  font-weight: 700;
  color: #111920;
  margin-bottom: 20px;
}

.success-amount {
  display: flex;
  align-items: baseline;
  margin-bottom: 12px;
}

.amount-symbol {
  font-size: 20px;
  color: #000;
}

.amount-number {
  font-size: 36px;
  font-weight: 700;
  color: #000;
}

.success-hint {
  font-size: 14px;
  color: #999;
}

/* ========== 完成按钮 ========== */
.btn-block {
  padding: 12px 16px;
}

.done-btn {
  width: 100%;
  height: 44px;
  background: #ff6200;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
}

.done-btn:active {
  opacity: 0.9;
}

/* ========== 灰色间距 ========== */
.gray-spacer {
  width: 100%;
  height: 20px;
  background: #f3f6f8;
}
</style>