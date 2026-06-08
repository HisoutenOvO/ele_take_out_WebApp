<template>
  <div class="page">
    <!-- ========== 顶部固定区域 ========== -->
    <div class="top-fixed">
      <div class="top-bg-block"></div>
      <div class="top-row">
        <div class="back-btn" @click="$router.back()">
          <i class="fas fa-chevron-left"></i>
        </div>
        <div class="top-title">确认订单</div>
      </div>
    </div>

    <!-- ========== 中间可滚动区域 ========== -->
    <div class="scroll-area" ref="scrollAreaRef" @scroll="handleScroll">
      <!-- 轮播条 -->
      <div class="notice-bar">
        <div class="notice-content">
          <i class="fas fa-bullhorn notice-icon"></i>
          <div class="notice-scroll">
            <div
                class="notice-scroll-inner"
                :style="{ transform: `translateY(-${currentNotice * 30}px)` }"
            >
              <span
                  v-for="(text, idx) in noticeList"
                  :key="idx"
                  class="notice-text"
              >{{ text }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="section-wrapper">
        <!-- ========== 第一块内容区域 ========== -->
        <div class="content-area">
          <!-- 收货地址 -->
          <div class="address-row" @click="showAddressPopup = true" v-if="!currentAddressId">
            <span class="address-label">请选择收货地址</span>
            <span class="address-arrow">›</span>
          </div>

          <!-- 选中地址后的卡片 -->
          <div class="address-card" v-else>
            <div class="address-card-line1">
              <span class="address-card-tag">{{ selectedAddress.tag }}</span>
              <span class="address-card-detail">{{ selectedAddress.detail }}</span>
              <span class="address-card-arrow" @click="showAddressPopup = true">›</span>
            </div>
            <div class="address-card-line2">
              <span class="address-card-contact">{{ selectedAddress.name }}（先生）</span>
              <span class="address-card-phone">{{ selectedAddress.phone }}</span>
              <span class="address-card-edit" @click.stop="editAddress(selectedAddress.id)">
                <i class="fas fa-pen"></i>
              </span>
            </div>
            <div class="address-card-line3">
              当前地址长时间未使用，请注意
            </div>
          </div>

          <!-- 是否需要配送入校 -->
          <div class="school-row">
            <span class="school-title">需要配送入校</span>
            <div class="school-options">
              <div class="option-item" :class="{ active: !campusNeed }" @click="campusNeed = false">
                <span>否</span>
                <div class="radio-circle" :class="{ active: !campusNeed }">
                  <i v-if="!campusNeed" class="fas fa-check"></i>
                </div>
              </div>
              <div class="option-item" :class="{ active: campusNeed }" @click="campusNeed = true">
                <span>是</span>
                <div class="radio-circle" :class="{ active: campusNeed }">
                  <i v-if="campusNeed" class="fas fa-check"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- 立即送出 / 预约配送 -->
          <div class="delivery-row">
            <div class="delivery-card active">
              <div class="delivery-card-inner">
                <span class="delivery-title">立即送出</span>
                <span class="delivery-time">预计{{ estimatedTime }}左右送达</span>
              </div>
            </div>
            <div class="delivery-card">
              <div class="delivery-card-inner">
                <span class="delivery-title">预约配送</span>
                <span class="delivery-time">选择时间</span>
              </div>
            </div>
          </div>

          <!-- 超时赔付等 -->
          <div class="compensate-row">
            <span class="compensate-title">超1分钟赔</span>
            <span class="compensate-detail">最高赔8元可叠加红包</span>
            <span class="compensate-gift">商家赠送</span>
          </div>

          <!-- 配送提示 -->
          <div class="notice-row">
            <span class="notice-tip">因配送订单较多，送达时间可能波动</span>
          </div>
        </div>

        <!-- ========== 第二块：商家信息 + 菜品列表 ========== -->
        <div class="content-area second-block">
          <div class="shop-info-header">
            <span class="shop-name">{{ shopName }}</span>
            <span class="delivery-tag">蜂鸟准时达</span>
          </div>

          <div
              v-for="item in cartItems"
              :key="item.id"
              class="cart-item"
          >
            <img :src="item.image" class="cart-item-img" alt="菜品图" />
            <div class="cart-item-info">
              <span class="cart-item-name">{{ item.name }}</span>
              <span class="cart-item-count">×{{ item.number }}</span>
            </div>
            <div class="cart-item-price">
              <span class="price-symbol-small">￥</span>
              <span class="price-number-small">{{ item.amount }}</span>
            </div>
          </div>
        </div>

        <!-- ========== 第三块：费用明细 + 合计 ========== -->
        <div class="content-area third-block">
          <div class="fee-row">
            <span class="fee-label">打包费</span>
            <div class="fee-price">
              <span class="price-symbol-small">￥</span>
              <span class="price-number-small">{{ packingFee }}</span>
            </div>
          </div>
          <div class="fee-row">
            <span class="fee-label">配送费</span>
            <div class="fee-price">
              <span class="price-symbol-small">￥</span>
              <span class="price-number-small">{{ deliveryFee }}</span>
            </div>
          </div>
          <div class="coupon-row">
            <span class="coupon-label">店铺活动/券</span>
            <div class="coupon-right">
              <span class="coupon-text">一张店铺券可用</span>
              <span class="coupon-arrow">›</span>
            </div>
          </div>
          <div class="coupon-row">
            <span class="coupon-label">
              <span class="red-icon">🧧</span>
              平台红包
            </span>
            <div class="coupon-right">
              <span class="red-discount">-¥{{ redPacket }}</span>
              <span class="coupon-arrow">›</span>
            </div>
          </div>
          <div class="bean-row">
            <span class="coupon-label">
              <span class="red-icon">🧧</span>
              下单反豆
            </span>
            <span class="bean-text">返10吃货豆</span>
          </div>
          <div class="fee-divider"></div>
          <div class="total-row">
            <span class="total-label">合计</span>
            <div class="total-right">
              <span class="total-discount">已优惠</span>
              <span class="price-symbol-small total-red-symbol">￥</span>
              <span class="price-number-red">{{ redPacket }}</span>
              <span class="price-symbol-small total-black-symbol">￥</span>
              <span class="price-number-big">{{ cartTotal }}</span>
            </div>
          </div>
        </div>

        <!-- ========== 备注与餐具 ========== -->
        <div class="content-area remark-block">
          <div class="remark-row">
            <span class="remark-label">备注</span>
            <div class="remark-right">
              <span class="remark-text">可向商家/骑手提出商品与配送需求</span>
              <span class="coupon-arrow">›</span>
            </div>
          </div>
          <div class="remark-row">
            <span class="remark-label">餐具</span>
            <div class="remark-right">
              <span class="remark-required">必选</span>
              <span class="coupon-arrow">›</span>
            </div>
          </div>
          <div class="remark-row">
            <span class="remark-label">开票</span>
            <div class="remark-right">
              <span class="remark-text">未添加开票信息</span>
              <span class="coupon-arrow">›</span>
            </div>
          </div>
        </div>

        <!-- ========== 号码保护与安心权益 ========== -->
        <div class="content-area safety-block">
          <div class="safety-section">
            <div class="safety-row">
              <div class="safety-left">
                <span class="safety-icon"><i class="fas fa-shield-halved"></i></span>
                <span class="safety-title">号码保护</span>
              </div>
              <div class="safety-right">
                <span class="safety-status">加密保护中</span>
                <span class="radio-circle active"><i class="fas fa-check"></i></span>
              </div>
            </div>
            <div class="safety-desc">
              为了您的隐私安全，已对商家、骑士隐藏您的真实手机号；为保障服务质量，开启号码保护的订单通话可能会被录音
            </div>
          </div>
          <div class="safety-section">
            <div class="safety-row">
              <div class="safety-left">
                <span class="safety-icon"><i class="fas fa-shield-halved"></i></span>
                <span class="safety-title">安心权益</span>
              </div>
              <div class="safety-right">
                <span class="safety-text">食无忧</span>
                <span class="coupon-arrow">›</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========== 底部固定区域 ========== -->
    <div class="bottom-bar">
      <div class="bottom-inner">
        <div class="price-info">
          <div class="price-line1">
            <span class="total-text">合计</span>
            <span class="total-symbol">￥</span>
            <span class="total-amount">{{ cartTotal }}</span>
          </div>
          <div class="price-line2">
            <span class="discount-text">已优惠</span>
            <span class="discount-symbol">￥</span>
            <span class="discount-amount">{{ totalDiscount }}</span>
          </div>
        </div>
        <button
            class="submit-btn"
            :class="{ active: cartTotal >= minPrice }"
            @click="handleSubmit"
        >
          立即支付
        </button>
      </div>
    </div>

    <!-- ========== 地址选择弹出层 ========== -->
    <div
        class="address-overlay"
        :class="{ show: showAddressPopup }"
        @click="showAddressPopup = false"
    >
      <div class="address-popup" @click.stop>
        <div class="address-popup-header">
          <span class="address-popup-title">选择收货地址</span>
          <span class="address-popup-close" @click="showAddressPopup = false">✕</span>
        </div>
        <div class="address-popup-content">
          <div
              v-for="addr in addressList"
              :key="addr.id"
              class="address-item"
              @click="selectAddress(addr.id)"
          >
            <div class="address-radio">
              <div
                  class="radio-circle"
                  :class="{ active: currentAddressId === addr.id }"
              >
                <i v-if="currentAddressId === addr.id" class="fas fa-check"></i>
              </div>
            </div>
            <div class="address-info">
              <div class="address-line1">
                <span class="address-tag">{{ addr.tag }}</span>
                <span class="address-detail">{{ addr.detail }}</span>
              </div>
              <div class="address-line2">
                <span class="address-contact">{{ addr.name }}</span>
                <span class="address-phone">{{ addr.phone }}</span>
              </div>
            </div>
            <div class="address-edit" @click.stop="editAddress(addr.id)">
              <i class="fas fa-pen"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import router from "@/router/index.js"
import { GetAddressList } from '@/api/address'
import { ElMessage } from "element-plus"
import { GetShopDetail } from '@/api/shop'
import { GetCartList } from '@/api/cart'
import {SubmitOrder} from '@/api/orders'
// ========== 数据 ==========
const shopName = ref('')
const deliveryFee = ref(0)
const minPrice = ref(0)
const cartItems = ref([])            // 购物车列表
const cartTotal = ref(0)             // 购物车总价
const packingFee = ref(1)            // 打包费写死，后期可改
const redPacket = ref(19)
const totalDiscount = ref(19)
const campusNeed = ref(true)
const shopId = localStorage.getItem('currentShopId')

// ========== 加载所有数据 ==========
const loadData = async () => {

  const cartResult = await GetCartList(shopId)
  if (cartResult.code !== 200 || !cartResult.data || cartResult.data.length === 0) {
    ElMessage.warning('购物车为空，请先添加商品')
    router.push('/')
    return
  }

  const shopResult = await GetShopDetail(shopId)
  if (shopResult.code === 200) {
    shopName.value = shopResult.data.name
    deliveryFee.value = shopResult.data.deliveryFee
    minPrice.value = shopResult.data.minPrice
  }
  cartItems.value = cartResult.data
  cartTotal.value = cartResult.data.reduce((sum, item) => sum + item.amount * item.number, 0) - 19 + packingFee.value + deliveryFee.value
}

// ========== 地址 ==========
const showAddressPopup = ref(false)
const addressList = ref([])
const currentAddressId = ref(null)

const getAddress = async () => {
  const result = await GetAddressList()
  if (result.code === 200) {
    addressList.value = result.data
  }
}

const selectedAddress = computed(() => {
  if (!currentAddressId.value) return null
  return addressList.value.find(a => a.id === currentAddressId.value) || null
})

const selectAddress = (id) => {
  currentAddressId.value = id
  showAddressPopup.value = false
}
const editAddress = (id) => console.log('编辑地址:', id)

// ========== 其他 ==========
const estimatedTime = computed(() => {
  const now = new Date()
  now.setMinutes(now.getMinutes() + 30 + Math.floor(Math.random() * 11))
  return `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
})

const noticeList = ref(['适量点餐，环保健康', '远距离配送，配送费原价上调', '欢迎光临，祝您用餐愉快'])
const currentNotice = ref(0)
let noticeTimer = null


const handleSubmit = async() =>{
  if (currentAddressId.value === null || currentAddressId.value === undefined) {
    ElMessage.warning('请先选择收货地址')
    return
  }

  const order = {
    shopId: shopId,
    addressId: currentAddressId.value
  }
  const result = await SubmitOrder(order)
  const orderId= result.data.id
  router.push(`/payment/${orderId}`)
}

onMounted(async () => {
  await loadData()
  await getAddress()
  noticeTimer = setInterval(() => {
    currentNotice.value = (currentNotice.value + 1) % noticeList.value.length
  }, 3000)
})

onUnmounted(() => clearInterval(noticeTimer))
</script>

<style scoped>
/* ========== 全局 ========== */
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  font-family:
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      sans-serif;
}

/* ========== 顶部固定区域 ========== */
.top-fixed {
  flex-shrink: 0;
  background: linear-gradient(
      to right,
      rgb(249, 238, 224),
      rgb(225, 242, 253)
  );
}

.top-bg-block {
  width: 100%;
  height: 50.45px;
}

.top-row {
  display: flex;
  align-items: center;
  height: 44px;
  padding-left: 50.4533px;
  position: relative;
}

.back-btn {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 55.01px;
  height: 27.51px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 13.76px;
  cursor: pointer;
  font-size: 18px;
  color: #111920;
  box-sizing: border-box;
}

.top-title {
  font-size: 19.4933px;
  font-weight: 600;
  color: #111920;
  line-height: 44px;
}
/* 灰色背景大容器 */
.section-wrapper {
  background: #f3f6f8;
  padding-bottom: 12px;
}

.content-area {
  margin-bottom: 12px;
}
/* ========== 中间可滚动区域 ========== */
.scroll-area {
  flex: 1;
  overflow-y: auto;
}

/* 轮播条 */
.notice-bar {
  width: 100%;
  height: 29.81px;
  background: linear-gradient(
      to right,
      rgb(249, 238, 224),
      rgb(225, 242, 253)
  );
  display: flex;
  align-items: center;
}

.notice-content {
  width: 393.3px;
  height: 30px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  color: #7c889c;
  padding-left: 13.76px;
  box-sizing: border-box;
}

.notice-icon {
  font-size: 18.34px;
  width: 18.34px;
  height: 18.34px;
  margin-right: 9.17332px;
  flex-shrink: 0;
}

.notice-scroll {
  height: 30px;
  overflow: hidden;
  flex: 1;
}

.notice-scroll-inner {
  transition: transform 0.5s ease;
}

.notice-text {
  display: block;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  white-space: nowrap;
}

/* ========== 第一块内容区域 ========== */
.content-area {
  padding: 0;
  background: #fff;
}

/* 第一行：收货地址 */
.address-row {
  width: 100%;
  height: 50.63px;
  padding:
      11.4667px
      18.3467px
      9.17332px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.address-label {
  font-size: 22.9333px;
  color: #ff6200;
  font-weight: 500;
}

.address-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 6px;
  font-size: 33.75px;
  color: #7c889c;
}

/* 第二行：配送入校 */
.school-row {
  width: 100%;
  height: 43.55px;
  padding:
      11.4667px
      18.3467px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.school-title {
  font-size: 17.74px;
  color: #111920;
  line-height: 18.34px;
}

.school-options {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 18px;
}

.option-item {
  display: flex;
  align-items: center;
  font-size: 18px;
  color: #111920;
  cursor: pointer;
  gap: 6px;
}

.option-item span {
  user-select: none;
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
}

.radio-circle i {
  font-size: 10px;
  color: #fff;
}

.radio-circle.active {
  background: #ff6300;
  border-color: #ff6300;
}

/* 第三行：配送方式 */
.delivery-row {
  width: 100%;
  padding:
      1.14668px
      18.3467px
      9.17332px;
  display: flex;
  gap: 6.88px;
  box-sizing: border-box;
}

.delivery-card {
  flex: 1;
  padding:
      6.30668px
      9.17332px;
  border-radius: 8px;
  background: #f3f6f8;
}

.delivery-card.active {
  background: #f1faf5;
  border: 1px solid #0fad50;
}

.delivery-card-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.delivery-title {
  font-size: 14px;
  font-weight: 700;
  color: #0fad50;
}

.delivery-card:not(.active) .delivery-title {
  color: #111920;
}

.delivery-time {
  font-size: 13.76px;
  color: #0fad50;
}

.delivery-card:not(.active) .delivery-time {
  color: #7c889c;
}

/* 第四行：赔付信息 */
.compensate-row {
  width: 100%;
  height: 45.51px;
  padding: 9.17332px 18.3467px 18.3467px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.compensate-title {
  font-size: 14.91px;
  color: #191919;
  white-space: nowrap;
}

.compensate-detail {
  margin-left: 20px;
  font-size: 15.33px;
  color: #7c889c;
  white-space: nowrap;
}

.compensate-gift {
  margin-left: auto;
  font-size: 14.48px;
  color: #11192d;
  white-space: nowrap;
}

/* 第五行：配送波动提示 */
.notice-row {
  width: 100%;
  height: 43.22px;
  padding:
      6.88px
      18.3467px
      18.3467px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.notice-tip {
  font-size: 15px;
  color: #ff6200;
}

/* 测试滚动区域 */
.goods-list-area {
  padding: 16px;
}

.test-item {
  height: 200px;
  background: #f9f9f9;
  margin-bottom: 16px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #333;
}
/* ========== 第二块：商家信息 + 菜品 ========== */
.second-block {
  padding-top: 9.17332px;
}

.shop-info-header {
  width: 100%;
  height: 38.98px;
  padding: 0 18.3467px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.shop-name {
  font-size: 17.2px;
  font-weight: 600;
  color: #111920;
  height: 22.67px;
  line-height: 22.67px;
}

.delivery-tag {
  padding: 2.29332px 4.58668px;
  font-size: 12px;
  color: #ff6200;
  white-space: nowrap;
}

/* 菜品项 */
.cart-item {
  width: 100%;
  height: 75.68px;
  padding: 9.17332px 18.3467px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.cart-item-img {
  width: 57.32px;
  height: 57.32px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.cart-item-info {
  flex: 1;
  height: 57.32px;
  margin-left: 9.17332px;
  margin-right: 13.76px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.cart-item-name {
  font-size: 16.5px;
  color: #111920;
  line-height: 1.3;
  max-width: 272.8px;
  word-break: break-all;
}

.cart-item-count {
  font-size: 11px;
  color: #7c889c;
  letter-spacing: 0.5px;
  margin-top: 3.44px;
}

/* 菜品价格（小号） */
.cart-item-price {
  display: flex;
  align-items: baseline;
  flex-shrink: 0;
}

.price-symbol-small {
  font-size: 13px;
  color: #111920;
  margin-right: 4px;
  width: 7.84px;
  height: 20px;
  line-height: 20px;
}

.price-number-small {
  font-size: 20px;
  font-weight: 700;
  color: #111920;
  height: 30px;
  line-height: 30px;
}

/* ========== 第三块：费用明细 ========== */
.third-block {
  padding: 0;
}

.fee-row {
  width: 393.31px;
  height: 43.29px;
  padding: 10.32px 0;
  margin: 0 18.3467px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.fee-label {
  font-size: 14.9067px;
  color: #333;
}

.fee-price {
  display: flex;
  align-items: baseline;
}

.coupon-row {
  width: 393.31px;
  height: 38.98px;
  margin: 0 18.3467px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.coupon-label {
  font-size: 14.9067px;
  color: #333;
  display: flex;
  align-items: center;
}

.red-icon {
  width: 18.34px;
  height: 18.34px;
  margin-right: 4.58668px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.coupon-right {
  display: flex;
  align-items: center;
}

.coupon-text {
  font-size: 12px;
  color: #ff352e;
  margin-right: 4.58668px;
}

.coupon-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 6px;
  font-size: 33.75px;
  color: #7c889c;
}

.red-discount {
  font-size: 13px;
  color: #ff4b33;
  margin-right: 4.58668px;
  display: flex;
  align-items: baseline;
}

.bean-row {
  width: 393.31px;
  height: 41.26px;
  padding-top: 9.17332px;
  padding-bottom: 13.76px;
  margin: 0 18.3467px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bean-text {
  font-size: 12px;
  color: #ff352e;
}

.fee-divider {
  width: 393.31px;
  height: 21.33px;
  margin: 0 18.3467px;
}

/* 合计行 */
.total-row {
  width: 100%;
  height: 39.25px;
  padding: 0 18.3467px 4.58668px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.total-label {
  font-size: 12px;
  color: #7c889c;
  letter-spacing: 0.5px;
}

.total-right {
  display: flex;
  align-items: baseline;
}

.total-discount {
  font-size: 13px;
  color: #ff352e;
  letter-spacing: 0.5px;
  margin-right: 4px;
}

.total-red-symbol {
  color: #ff352e;
}

.price-number-red {
  font-size: 18px;
  font-weight: 700;
  color: #ff352e;
  height: 23px;
  line-height: 23px;
  margin-right: 4px;
}

.total-black-symbol {
  color: #111920;
}

/* 红包折扣文字加大 */
.red-discount {
  font-size: 15px;
  color: #ff4b33;
  margin-right: 4.58668px;
  display: flex;
  align-items: baseline;
}

/* 返豆文字加大 */
.bean-text {
  font-size: 14px;
  color: #ff352e;
}
/* 总价大号数字 */
.price-number-big {
  font-size: 24px;
  font-weight: 700;
  color: #111920;
  height: 34.67px;
  line-height: 34.67px;
}
/* ========== 第三块：备注与餐具 ========== */
.remark-block {
  width: 100%;
  padding: 9.17332px 18.3467px;
  box-sizing: border-box;
  margin-top: 9.17332px;
}

.remark-row {
  width: 393.31px;
  height: 42.92px;
  padding: 11.4667px 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.remark-label {
  font-size: 14.9067px;
  color: #333;
}

.remark-right {
  display: flex;
  align-items: center;
  gap: 4.58668px;
}

.remark-text {
  font-size: 15.5px;
  color: #7c889c;
}

.remark-required {
  font-size: 15.5px;
  color: #ff6200;
}

/* ========== 第四块：号码保护与安心权益 ========== */
.safety-block {
  width: 100%;
  padding: 9.17332px 18.3467px;
  box-sizing: border-box;
  margin-top: 9.17332px;
}

.safety-section {
  width: 393.31px;
  padding: 11.4667px 0;
  box-sizing: border-box;
}

.safety-section + .safety-section {
  border-top: 1px solid #f0f0f0;
}

.safety-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.safety-left {
  display: flex;
  align-items: center;
}

.safety-icon {
  width: 18.34px;
  height: 18.34px;
  margin-right: 4.58668px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.safety-title {
  font-size: 15px;
  font-weight: 600;
  color: #111920;
  height: 20.67px;
  line-height: 20.67px;
}

.safety-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.safety-status {
  font-size: 15px;
  font-weight: 600;
  color: #111920;
  margin-right: 9.17332px;
}

.safety-desc {
  width: 393.31px;
  font-size: 14px;
  color: #7c889c;
  line-height: 18px;
  margin-top: 4px;
}

.safety-text {
  font-size: 15px;
  color: #111920;
  margin-right: 4px;
}
/* ========== 底部固定区域 ========== */
.bottom-bar {
  flex-shrink: 0;
  width: 100%;
  height: 109.07px;
  padding: 6.88px 13.76px 42.4267px 0;
  background: #fff;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}

.bottom-inner {
  width: 209.47px;
  height: 59.78px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 左侧价格信息 */

.price-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
  margin-right: 8px;          /* 稍微缩小右边距，给文字多留空间 */
  white-space: nowrap;        /* 强制不换行 */
}

.price-line1 {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.total-text {
  font-size: 12px;            /* 缩小到15px */
  color: #000000e6;
  line-height: 15px;
}

.total-symbol {
  font-size: 15px;            /* 缩小到15px */
  color: #ff5128;
  line-height: 15px;
}

.total-amount {
  font-size: 24px;
  font-weight: 700;
  color: #ff5128;
  line-height: 1.2;
}

.price-line2 {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.discount-text {
  font-size: 13px;
  color: #ff352e;
  line-height: 13px;
}

.discount-symbol {
  font-size: 13px;
  color: #ff352e;
  line-height: 13px;
}

.discount-amount {
  font-size: 18px;
  font-weight: 700;
  color: #ff352e;
  width: 12.91px;
  height: 23.33px;
  line-height: 23.33px;
  display: inline-block;
  text-align: right;
}
/* 按钮 */
.submit-btn {
  width: 123.83px;
  height: 45.86px;
  background: #ff6200;
  color: #f3f6f8;
  border: none;
  border-radius: 8px;
  font-size: 18px;          /* 字体调大 */
  font-weight: 400;         /* 取消加粗 */
  letter-spacing: 1px;      /* 字间距变小 */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* ========== 地址弹出层 ========== */
.address-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  z-index: 200;
  pointer-events: none;
  transition: background 0.3s ease;
}

.address-overlay.show {
  background: rgba(0, 0, 0, 0.5);
  pointer-events: auto;
}

.address-popup {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 75vh;
  background: #fff;
  border-radius: 16px 16px 0 0;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.address-overlay.show .address-popup {
  transform: translateY(0);
}

.address-popup-header {
  display: flex;
  align-items: center;
  justify-content: center;       /* 内容水平居中 */
  height: 55.03px;
  padding: 0 18px;
  border-bottom: 1px solid #f0f0f0;
  position: relative;            /* 为关闭按钮绝对定位提供参照 */
}

.address-popup-title {
  font-size: 20px;
  font-weight: 600;
  color: #111920;
  text-align: center;            /* 文字居中 */
  flex: 1;                       /* 占满剩余空间 */
}

/* 关闭按钮用绝对定位固定到右侧 */
.address-popup-close {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: #999;
  cursor: pointer;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.address-popup-close:active {
  background: #f5f5f5;
}

.address-popup-content {
  flex: 1;
  overflow-y: auto;
}

/* 地址列表项 */
.address-item {
  width: 100%;
  padding: 13.76px 0;
  display: flex;
  align-items: center;          /* 从 flex-start 改为 center */
  border-bottom: 1.5px solid #f5f5f5;
  cursor: pointer;
}

.address-item:active {
  background: #fafafa;
}

/* 左侧圆圈 */
.address-radio {
  width: 50.44px;
  padding-left: 18.3467px;
  padding-right: 11.4667px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.address-radio .radio-circle {
  width: 20px;
  height: 20px;
  border: 1.5px solid #c8ccd2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.address-radio .radio-circle.active {
  background: #ff6200;
  border-color: #ff6200;
}

.address-radio .radio-circle i {
  font-size: 10px;
  color: #fff;
}

/* 中间信息 */
.address-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.address-line1 {
  display: flex;
  align-items: center;
  height: 22.94px;
}

.address-tag {
  font-size: 12px;
  color: #ff6205;
  background: #fff0e5;
  padding: 2px 4.58668px;
  border-radius: 3px;
  margin-right: 9.17332px;
  height: 14px;
  line-height: 14px;
  white-space: nowrap;
}

.address-detail {
  font-size: 18px;
  color: #111920;
  font-weight: 500;
  height: 22.94px;
  line-height: 22.94px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.address-line2 {
  display: flex;
  align-items: center;
  margin-top: 6.88px;
  height: 18.34px;
}

.address-contact {
  font-size: 13px;
  color: #7c8a9d;
  line-height: 18.34px;
}

.address-phone {
  font-size: 13px;
  color: #7c8a9d;
  line-height: 18.34px;
  margin-left: 9.17332px;
}

/* 右侧编辑图标 */
.address-edit {
  width: 22.93px;
  height: 22.93px;
  padding: 0 28.3467px 0 18.3467px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #7c889c;
  font-size: 16px;
  cursor: pointer;
}
/* ========== 选中地址后的卡片 ========== */
.address-card {
  width: 100%;
  padding: 11.4667px 18.3467px 9.17332px;
  box-sizing: border-box;
}

.address-card-line1 {
  width: 393.31px;
  height: 33.33px;
  display: flex;
  align-items: center;
}

.address-card-tag {
  font-size: 12px;
  color: #ff6200;
  background: #fff0e5;
  padding: 0 4.58668px;
  border-radius: 3px;
  height: 14px;
  line-height: 14px;
  margin-right: 4.58668px;
  white-space: nowrap;
}

.address-card-detail {
  flex: 1;
  font-size: 22.5px;
  font-weight: 700;
  color: #111920;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.address-card-arrow {
  font-size: 28px;
  color: #7c889c;
  cursor: pointer;
  height: 33.33px;
  line-height: 33.33px;
  padding-left: 8px;
}

.address-card-line2 {
  width: 393.31px;
  height: 27.51px;
  margin-top: 3.44px;
  display: flex;
  align-items: center;
}

.address-card-contact {
  font-size: 16.5px;
  color: #7c889c;
}

.address-card-phone {
  font-size: 16.5px;
  color: #7c889c;
  padding: 2.29332px 5.73332px;
}

.address-card-edit {
  font-size: 14.91px;
  color: #7c889c;
  width: 14.91px;
  height: 14.91px;
  margin-left: 2.29332px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.address-card-line3 {
  width: 393.31px;
  height: 20px;
  margin-top: 3.44px;
  font-size: 14px;
  color: #ff6200;
  line-height: 20px;
}
</style>