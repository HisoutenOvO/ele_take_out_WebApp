<template>
  <div class="page">
    <!-- 顶部固定区域 -->
    <div class="top-fixed">
      <!-- 搜索框 -->
      <div class="search-bar">
        <i class="fa-brands fa-sistrix search-icon" style="flex:0 0 6vw;"></i>
        <input
            v-model="searchKeyword"
            placeholder="搜索订单"
            class="search-input"
            @keyup.enter="handleSearch"
        />
        <button class="search-btn" @click="handleSearch">搜索</button>
      </div>

      <!-- 三个状态标签 -->
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
      <div v-for="order in filteredOrders" :key="order.id" class="order-card" @click="goToShop(order.shopId)">
        <!-- 第一行：店家小图 + 名称 + 状态 -->
        <div class="order-header">
          <div class="shop-mini">
            <img :src="getShopImg(order.shopName)" class="mini-img" />
            <span class="shop-name">{{ order.shopName }}</span>
          </div>
          <span class="order-status">{{ order.statusText }}</span>
        </div>

        <!-- 第二行：商品大图 + 信息 -->
        <div class="order-body">
          <!-- 商品图片（正方形，和商家卡片要求一致） -->
          <img :src="order.goodsImg" class="goods-img" />

          <div class="goods-info">
            <div class="info-row1">
              <span class="goods-content">{{ order.content }}</span>
              <span class="goods-price">¥{{ order.price }}</span>
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

    <!-- 底部导航 -->
    <BottomNav />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BottomNav from '@/components/BottomNav.vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const goToShop = (id) => {
  router.push(`/shop/${id}`)
}

const searchKeyword = ref('')
const activeTab = ref('all')

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'ongoing', label: '进行中' },
  { key: 'refunded', label: '已退款' }
]

// 模拟订单数据
const orders = ref([
  {
    id: 1,
    shopName: '必胜客',
    status: 'delivered',
    statusText: '已送达',
    goodsImg: '/img/sj08.png',
    content: '超级至尊披萨+可乐',
    price: 128,
    quantity: 2
  },
  {
    id: 2,
    shopName: '麦当劳',
    status: 'canceled',
    statusText: '已取消',
    goodsImg: '/img/sj07.png',
    content: '巨无霸套餐',
    price: 42,
    quantity: 1
  },
  {
    id: 3,
    shopName: '瑞幸咖啡',
    status: 'ongoing',
    statusText: '配送中',
    goodsImg: '/img/sp06.png',
    content: '生椰拿铁+厚乳拿铁',
    price: 58,
    quantity: 2
  },
  {
    id: 4,
    shopName: '海底捞',
    status: 'refunded',
    statusText: '已退款',
    goodsImg: '/img/sp05.png',
    content: '火锅底料套餐',
    price: 299,
    quantity: 1
  }
])
const getShopImg = (name) => {
  const map = {
    '必胜客': '/img/sj08.png',
    '麦当劳': '/img/sj09.png',
    '海底捞': '/img/sp03.png',
    '瑞幸咖啡': '/img/sp01.png',
    '肯德基': '/img/sp02.png'
  }
  return map[name] || '/img/default.png'
}
// 根据状态过滤
const filteredOrders = computed(() => {
  let list = orders.value
  if (activeTab.value === 'ongoing') {
    list = list.filter(o => o.status === 'ongoing')
  } else if (activeTab.value === 'refunded') {
    list = list.filter(o => o.status === 'refunded')
  }
  // 搜索过滤（简单模拟）
  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.trim().toLowerCase()
    list = list.filter(o => o.shopName.toLowerCase().includes(kw) || o.content.toLowerCase().includes(kw))
  }
  return list
})

const switchTab = (key) => {
  activeTab.value = key
}

const handleSearch = () => {
  // 搜索逻辑由 computed 自动处理
}
</script>

<style scoped>
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 顶部固定 */
.top-fixed {
  flex-shrink: 0;
  background: #fff;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

/* 搜索栏 */
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

/* 标签栏 */
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

/* 中间订单滚动 */
.order-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 16px 12px;
}

/* 订单卡片 */
.order-card {
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
}

/* 第一行：店铺信息+状态 */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.shop-mini {
  display: flex;
  align-items: center;
  gap: 6px;
}

.mini-img {
  font-size: 20px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  object-fit: cover;
}

.shop-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.order-status {
  font-size: 13px;
  color: #999;
}

/* 第二行：商品图片+信息 */
.order-body {
  display: flex;
  gap: 12px;
}

.goods-img {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  background: #f9f9f9;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
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

/* 底部提示 */
.end-text {
  text-align: center;
  padding: 20px;
  color: #ccc;
  font-size: 13px;
}
</style>