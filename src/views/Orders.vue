<template>
  <div class="page">
    <!-- 顶部固定区域 -->
    <div class="top-fixed">
      <div class="search-bar">
        <i class="fa-brands fa-sistrix search-icon" style="flex:0 0 6vw;"></i>
        <input
            v-model="searchKeyword"
            placeholder="搜索订单"
            class="search-input"
        />
        <button class="search-btn" @click="handleSearch">搜索</button>
      </div>

      <div class="tabs">
        <div
            v-for="tab in tabs"
            :key="tab.key"
            class="tab-item"
            :class="{ active: activeTab === tab.key }"
            @click="switchTab(tab.key)"
        >
          {{ tab.label }}
          <span v-if="activeTab === tab.key" class="underline"></span>
        </div>
      </div>
    </div>

    <!-- 中间可滚动订单列表 -->
    <div class="order-scroll">
      <div v-for="order in filteredOrders" :key="order.id" class="order-card">
        <div class="order-header" @click="goToShop(order.shopId)">
          <div class="shop-mini">
            <img :src="order.shopImage" class="mini-img" alt="店铺图片" />
            <span class="shop-name">{{ order.shopName }}</span>
          </div>
          <span class="order-status">{{ order.status }}</span>
        </div>

        <div class="order-body" @click="goToOrderDetail(order.id)">
          <img :src="order.dishImage" class="goods-img" alt="商品图片" />
          <div class="goods-info">
            <div class="info-row1">
              <span class="goods-content">{{ order.dishName }}</span>
              <span class="goods-price">¥{{ order.actualPayment }}</span>
            </div>
            <div class="info-row2">
              <span class="goods-count">×{{ order.quantity }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="end-text" v-if="filteredOrders.length === 0">暂无相关订单</div>
      <div class="end-text" v-else>— 已经到底了 —</div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BottomNav from '@/components/BottomNav.vue'
import { useRouter } from 'vue-router'
import { GetOrderList } from '@/api/orders'
import { ElMessage } from 'element-plus'

const router = useRouter()

const goToShop = (id) => {
  router.push(`/shop/${id}`)
}

const goToOrderDetail = (orderId) => {
  router.push(`/order-result/${orderId}`)
}

const searchKeyword = ref('')
const activeTab = ref('all')

const tabs = [
  { key: 'all', label: '全部' },
  { key: '待支付', label: '待支付' },
  { key: '已完成', label: '已完成' }
]

const orders = ref([])

const search = async () => {
  const result = await GetOrderList()
  if (result.code === 200) {
    orders.value = result.data
  } else {
    ElMessage.error(result.msg || '获取订单失败')
  }
}

const filteredOrders = computed(() => {
  let list = orders.value

  if (activeTab.value !== 'all') {
    list = list.filter(o => o.status === activeTab.value)
  }

  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.trim().toLowerCase()
    list = list.filter(o =>
        o.shopName.toLowerCase().includes(kw) ||
        o.dishName.toLowerCase().includes(kw)
    )
  }
  return list
})

const switchTab = (key) => {
  activeTab.value = key
}

const handleSearch = () => {}

onMounted(() => {
  search()
})
</script>

<style scoped>
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.top-fixed {
  flex-shrink: 0;
  background: #fff;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.search-bar {
  display: flex;
  align-items: center;
  padding: 12px 16px 10px;
}

.search-icon {
  font-size: 16px;
  color: #999;
  padding: 10px 0 10px 12px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-right: none;
  border-radius: 8px 0 0 8px;
}

.search-input {
  flex: 1;
  padding: 10px 8px;
  border: 1px solid #e0e0e0;
  border-left: none;
  border-right: none;
  background: #f5f5f5;
  font-size: 14px;
  outline: none;
  color: #333;
}

.search-input::placeholder {
  color: #aaa;
}

.search-btn {
  background: #ED6C2D;
  border: none;
  border-radius: 0 8px 8px 0;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  color: white;
}

.tabs {
  display: flex;
  padding: 0 16px;
  gap: 32px;
  position: relative;
}

.tab-item {
  font-size: 16px;
  color: #666;
  cursor: pointer;
  padding-bottom: 6px;
  position: relative;
  transition: color 0.2s;
}

.tab-item.active {
  color: #222;
  font-weight: 600;
}

.underline {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background: #d73232;
  border-radius: 2px;
}

.order-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 16px 12px;
}

.order-card {
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}

.shop-mini {
  display: flex;
  align-items: center;
  gap: 6px;
}

.mini-img {
  font-size: 20px;
  width: 43px;
  height: 43px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  object-fit: cover;
}

.shop-name {
  font-size: 18px;
  color: #333;
  font-weight: 500;
}

.order-status {
  font-size: 13px;
  color: #999;
}

.order-body {
  display: flex;
  gap: 12px;
  cursor: pointer;
}

.goods-img {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  background: #f9f9f9;
  border-radius: 10px;
  object-fit: cover;
}

.goods-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4px 0;
}

.info-row1 {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.goods-content {
  font-size: 15px;
  color: #222;
  font-weight: 500;
  max-width: 70%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goods-price {
  font-size: 18px;
  font-weight: 700;
  color: #222;
}

.info-row2 {
  display: flex;
  justify-content: flex-end;
}

.goods-count {
  font-size: 13px;
  color: #999;
}

.end-text {
  text-align: center;
  padding: 20px;
  color: #ccc;
  font-size: 13px;
}
</style>