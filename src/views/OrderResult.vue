<template>
  <div class="page">
    <!-- 可滚动内容区域 -->
    <div class="scroll-area">
      <!-- 灰色背景大容器（包裹所有白色内容块） -->
      <div class="gray-wrapper">
        <!-- 第一块：顶部空白 + 返回箭头 + 客服 -->
        <div class="white-block">
          <div class="spacer-28"></div>
          <div class="service-row">
            <span class="back-arrow" @click="goToOrders">←</span>
            <div class="service-icon-wrapper">
              <span class="service-icon">🎧</span>
              <span class="service-text">客服</span>
            </div>
          </div>
        </div>

        <!-- 第二块：订单状态 -->
        <div class="white-block">
          <div class="status-row">
            <span class="status-text">{{ orderStatus }}</span>
          </div>
        </div>

        <!-- 第三块：送达地址 -->
        <div class="white-block">
          <div class="address-section">
            <span class="address-label">送至</span>
            <div class="address-info">
              <span class="address-detail">{{ deliveryAddress }}</span>
              <span class="address-phone">{{ deliveryPhone }}</span>
            </div>
          </div>
        </div>

        <!-- 第四块：操作按钮 -->
        <div class="white-block">
          <div class="action-section">
            <div class="action-item" @click="handleReorder">
              <span class="action-icon order-icon">
                <i class="fa-solid fa-receipt"></i>
              </span>
              <span class="action-text">再来一单</span>
            </div>
            <div class="action-item" @click="handleCallShop">
              <span class="action-icon phone-icon">
                <i class="fa-solid fa-phone"></i>
              </span>
              <span class="action-text phone-text">电话商家</span>
            </div>
          </div>
        </div>

        <!-- 第五块：其他服务（上下有灰色间距） -->
        <div class="other-block">
          <div class="other-service-row">
            <div class="service-left">
              <span class="shield-icon">
                <i class="fas fa-shield-halved"></i>
              </span>
              <span class="service-label">其他服务</span>
            </div>
            <div class="service-right">
              <span class="service-desc">号码保护，售后无忧</span>
              <span class="service-arrow">›</span>
            </div>
          </div>
        </div>
        <!-- 菜品展示区域 -->
        <div class="white-block dish-show-block">
          <!-- 第一行：商家名称 -->
          <div class="dish-show-row1">
            <span class="dish-show-shop">{{ shopName }}</span>
          </div>

          <!-- 第二行：菜品图片 + 共x件 -->
          <div class="dish-show-row2">
            <img :src="orderDish.image" class="dish-show-img" alt="菜品图" />
            <span class="dish-show-count">共{{ orderDish.quantity }}件</span>
          </div>

          <!-- 第三行：价格明细 -->
          <div class="dish-show-row3">
            <span class="dish-show-label">价格明细</span>
            <div class="dish-show-prices">
              <span class="total-discount-text">总优惠</span>
              <span class="total-discount-symbol">￥</span>
              <span class="total-discount-amount">{{ totalDiscount }}</span>
              <span class="actual-text">实付</span>
              <span class="actual-symbol">￥</span>
              <span class="actual-amount">{{ actualPayment }}</span>
            </div>
          </div>

          <!-- 灰色分隔线 -->
          <div class="dish-show-divider"></div>
          <!-- 温馨提示等六行信息 -->
          <div class="white-block info-block">
            <div class="info-row">
              <span class="info-label">温馨提示</span>
              <span class="info-value">请厉行节约，避免浪费</span>
            </div>
            <div class="info-row">
              <span class="info-label">收货信息</span>
              <div class="info-value">
                <div class="info-value-line">{{ deliveryAddress }}</div>
                <div class="info-value-line">{{ deliveryPhone }}</div>
              </div>
            </div>
            <div class="info-row">
              <span class="info-label">备注</span>
              <span class="info-value">依据餐量提供餐具</span>
            </div>
            <div class="info-row">
              <span class="info-label">送达时间</span>
              <span class="info-value">尽快送达</span>
            </div>
            <div class="info-row">
              <span class="info-label">下单时间</span>
              <span class="info-value">{{ orderTime }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">订单号</span>
              <span class="info-value">{{ orderId }}</span>
            </div>
          </div>
        </div>
        <!-- 第六块：常见问题（上下灰色间距） -->
        <div class="faq-block">
          <div class="faq-row">
            <div class="faq-left">
              <span class="faq-label">常见问题</span>
            </div>
            <div class="faq-tags">
              <span class="faq-tag">未收到商品</span>
              <span class="faq-tag">少送商品</span>
              <span class="faq-tag">餐品撒漏</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import {} from '@/api/orders'

const shopName = ref('必胜客之超级强迪')

const orderDish = ref({
  image: '/img/sp02.png',
  quantity: 2
})

const totalDiscount = ref('19.00')
const actualPayment = ref('128.00')
const route = useRoute()
const router = useRouter()
const orderId = route.params.id+3065032035165

const goToOrders = () => {
  router.push('/orders')
}

const orderStatus = ref('订单已完成')
const deliveryAddress = ref('梦想小镇创业大街1号楼101室')
const deliveryPhone = ref('138****1234')
const orderTime = ref('2026-05-26 14:30:00')  // 模拟下单时间
const handleReorder = () => { console.log('再来一单') }
const handleCallShop = () => { console.log('电话商家') }
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

/* 灰色背景大容器 */
.gray-wrapper {
  background: #f3f6f8;
  min-height: 100%;
}

/* 白色内容块（紧贴，无间距） */
.white-block {
  background: #fff;
}

/* 第一块 */
.spacer-28 {
  width: 100%;
  height: 28px;
}

.service-row {
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  box-sizing: border-box;
}

.back-arrow {
  font-size: 24px;
  cursor: pointer;
  color: #111920;
}

.service-icon-wrapper {
  width: 41.27px;
  height: 41.27px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.service-icon { font-size: 22px; }
.service-text { font-size: 10px; color: #666; }

/* 第二块：订单状态 */
.status-row {
  width: 100%;
  height: 49.25px;
  padding-left: 18.3467px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.status-text {
  font-size: 22px;
  font-weight: 700;
  color: #111920;
}

/* 第三块：送达地址 */
.address-section {
  width: 100%;
  padding: 16.0533px 18.3467px;
  box-sizing: border-box;
  display: flex;
  border-bottom: 1px solid #e5e5e5;
  align-items: flex-start;
}

.address-label {
  font-size: 16px;
  font-weight: 700;
  color: #111920;
  width: 32.09px;
  margin-right: 4.58668px;
  flex-shrink: 0;
  line-height: 1.3;
}

.address-info {
  display: flex;
  flex-direction: column;
}

.address-detail {
  font-size: 16px;
  color: #111920;
  line-height: 1.3;
}

.address-phone {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

/* 第四块：操作按钮 */
.action-section {
  width: 100%;
  padding: 2.29332px 16.0533px 11.4667px;
  box-sizing: border-box;
  display: flex;
}

.action-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 9.17332px 0;
  cursor: pointer;
}

.action-icon {
  width: 18.34px;
  height: 18.34px;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.order-icon { color: #ff6200; }
.phone-icon { color: #111920; }

.action-text {
  font-size: 14px;
  margin-top: 4.58668px;
  color: #ff6200;
}

.phone-text {
  color: #111920;
}

/* 第五块：其他服务（上下灰色间距） */
.other-block {
  background: #f3f6f8;
  padding: 10px 0;
}

.other-service-row {
  background: #fff;
  width: 100%;
  height: 46.25px;
  padding: 11.4667px 18.3467px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.service-left {
  display: flex;
  align-items: center;
}

.shield-icon {
  width: 18.34px;
  height: 18.34px;
  margin-right: 4.58668px;
  font-size: 16px;
}

.service-label {
  font-size: 14px;
  font-weight: 600;
  color: #111920;
}

.service-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.service-desc {
  font-size: 14px;
  color: #7c889c;
}

.service-arrow {
  font-size: 14px;
  color: #cfcfcf;
  cursor: pointer;
}
/* 菜品展示区域 */
.dish-show-block {
  padding-top: 9.17332px;
  padding-bottom: 4.58668px;
}

/* 第一行：商家名称 */
.dish-show-row1 {
  width: 100%;
  height: 38.98px;
  padding: 0 18.3467px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.dish-show-shop {
  font-size: 18px;
  font-weight: 600;
  color: #111920;
}

/* 第二行：菜品图片 + 共x件 */
.dish-show-row2 {
  width: 100%;
  height: 64.2px;
  padding: 9.17332px 18.3467px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dish-show-img {
  width: 45.86px;
  height: 45.86px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
}

.dish-show-count {
  font-size: 13.5px;
  color: #7c889c;
}

/* 第三行：价格明细 */
.dish-show-row3 {
  width: 100%;
  height: 48.33px;
  padding: 9.17332px 18.3467px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dish-show-label {
  font-size: 17px;
  color: #111920;
}

.dish-show-prices {
  display: flex;
  align-items: baseline;
  gap: 0;
}

/* 总优惠（红色） */
.total-discount-text {
  font-size: 13px;
  color: #ff352e;
  margin-right: 2px;
}

.total-discount-symbol {
  font-size: 13px;
  color: #ff352e;
  margin-right: 1.14668px;
}

.total-discount-amount {
  font-size: 18px;
  font-weight: 600;
  color: #ff352e;
  margin-right: 12px;
}

/* 实付（黑色） */
.actual-text {
  font-size: 13px;
  color: #111920;
  margin-right: 2px;
}

.actual-symbol {
  font-size: 13px;
  color: #111920;
  margin-right: 1.14668px;
}

.actual-amount {
  font-size: 22px;
  font-weight: 600;
  color: #111920;
}

/* 灰色分隔线 */
.dish-show-divider {
  width: 100%;
  height: 19.33px;
  padding: 9.17332px 18.3467px;
  box-sizing: border-box;
  border-bottom: 1px solid #e0e0e0;
}
/* 六行信息块 */
.info-block {
  width: 100%;
  margin-bottom: 9.17332px;
  box-sizing: border-box;
}

.info-row {
  width: 100%;
  padding: 11.4667px 18.3467px;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
}

.info-label {
  font-size: 16.5px;
  color: #111920;
  width: auto;
  white-space: nowrap;
  margin-right: 13.76px;
  flex-shrink: 0;
}

.info-value {
  font-size: 16.5px;
  color: #333;
  text-align: right;
  margin-left: auto;
  line-height: 1.4;
}

.info-value-line {
  font-size: 16px;
  color: #333;
  line-height: 1.4;
}

.info-value-line + .info-value-line {
  margin-top: 4px;
}
/* 第六块：常见问题（上下灰色间距） */
.faq-block {
  background: #f3f6f8;
  padding: 20px 0;
}

.faq-row {
  background: #fff;
  width: 100%;
  padding: 11.4667px 18.3467px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.faq-left {
  display: flex;
  align-items: center;
}

.faq-label {
  font-size: 14px;
  font-weight: 600;
  color: #111920;
}

.faq-tags {
  display: flex;
  gap: 9.17332px;
}

.faq-tag {
  width: 91.72px;
  height: 27.51px;
  margin: 0 0 4.58668px;
  padding: 0 11.4667px;
  background: #f3f6f8;
  color: #50607a;
  font-size: 12px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  white-space: nowrap;
  box-sizing: border-box;
}
</style>