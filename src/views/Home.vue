<template>
  <div class="page">
    <!-- 顶部固定区域 -->
    <div class="top">
      <div class="yellow-bar">
        <h1>淘宝闪购</h1>
        <div class="address">
          <span>📍</span>
          <span>杭州西湖区·梦想小镇</span>
          <span>▼</span>
        </div>
      </div>
      <div class="gap"></div>

      <!-- 搜索栏：左侧放大镜图标 -->
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input
            v-model="searchKeyword"
            placeholder="搜索商家或商品"
            class="search-input"
            @keyup.enter="handleSearch"
        />
        <button class="search-btn" @click="handleSearch">搜索</button>
      </div>
    </div>

    <!-- 中间滚动区域 -->
    <div class="scroll">
      <div class="title">为你推荐附近的商家</div>

      <!-- 卡片列表 -->
      <div v-for="shop in shops" :key="shop.id" class="card">
        <!-- 左侧图片：直接放emoji，无背景，占1/3 -->
        <span class="card-emoji">{{ getEmoji(shop.name) }}</span>

        <!-- 右侧详细信息容器 -->
        <div class="card-detail">
          <!-- 第1行：店名 -->
          <div class="line1">
            <span class="shop-name">{{ shop.name }}</span>
          </div>

          <!-- 第2行：评分 月售 | 时间 距离 -->
          <div class="line2">
            <div class="line2-left">
              <span class="rating">{{ shop.rating }}</span>
              <span class="monthly-sales">月售{{ shop.monthlySales }}+</span>
            </div>
            <div class="line2-right">
              <span class="time">{{ shop.deliveryTime }}分钟</span>
              <span class="distance">{{ shop.distance }}</span>
            </div>
          </div>

          <!-- 第3行：起送 配送 | 校园送 -->
          <div class="line3">
            <div class="line3-left">
              <span class="min-price">起送¥{{ shop.minPrice }}</span>
              <span class="delivery-fee">配送¥{{ shop.deliveryFee }}</span>
            </div>
            <div class="line3-right">
              <span class="campus-tag" v-if="shop.campus">校园送</span>
            </div>
          </div>

          <!-- 第4行：商家描述（黄色背景橙色字） -->
          <div class="line4" v-if="shop.description">
            <span class="shop-desc">{{ shop.description }}</span>
          </div>

          <!-- 第5行：优惠 -->
          <div class="line5" v-if="shop.discount">
            <span class="discount">{{ shop.discount }}</span>
          </div>
        </div>
      </div>

      <div class="end">— 已经到底了 —</div>
    </div>

    <!-- 底部固定导航 -->
    <div class="bottom">
      <BottomNav />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BottomNav from '@/components/BottomNav.vue'

const searchKeyword = ref('')

// 模拟数据（后期替换为API）
const shops = ref([
  {
    id: 1,
    name: '必胜客（1111111111）',
    rating: 4.6,
    monthlySales: 500,
    deliveryTime: 42,
    distance: '1.2km',
    minPrice: 88,
    deliveryFee: 5,
    campus: true,
    description: '品质西餐·新鲜现做',
    discount: '满65减5'
  },
  {
    id: 2,
    name: '麦当劳',
    rating: 4.5,
    monthlySales: 800,
    deliveryTime: 35,
    distance: '800m',
    minPrice: 59,
    deliveryFee: 3,
    campus: false,
    description: '经典汉堡·快速出餐',
    discount: '满59减15'
  },
  {
    id: 3,
    name: '海底捞',
    rating: 4.9,
    monthlySales: 1200,
    deliveryTime: 55,
    distance: '2.0km',
    minPrice: 199,
    deliveryFee: 8,
    campus: false,
    description: '火锅盛宴·极致服务',
    discount: '满199减30'
  },
  {
    id: 4,
    name: '瑞幸咖啡',
    rating: 4.7,
    monthlySales: 950,
    deliveryTime: 28,
    distance: '500m',
    minPrice: 35,
    deliveryFee: 2,
    campus: true,
    description: '大师咖啡·便捷快取',
    discount: '9.9专区'
  },
  {
    id: 5,
    name: '肯德基（1111111111）',
    rating: 4.8,
    monthlySales: 1500,
    deliveryTime: 35,
    distance: '1.0km',
    minPrice: 59,
    deliveryFee: 3,
    campus: false,
    description: '炸鸡专家·疯狂星期四',
    discount: '满30减15'
  }
])

// emoji 映射
const getEmoji = (name) => {
  const map = {
    '必胜客（1111111111）': '🍕',
    '麦当劳': '🍔',
    '海底捞': '🍲',
    '瑞幸咖啡': '☕',
    '肯德基（1111111111）': '🍗'
  }
  return map[name] || '🏪'
}

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    console.log('搜索:', searchKeyword.value)
  }
}
</script>

<style scoped>
/* 全局重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f5f5f5;
}

/* 顶部 */
.top {
  flex-shrink: 0;
}

.yellow-bar {
  background: #ffc107;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}
.yellow-bar h1 {
  font-size: 24px;
  font-weight: 400;
  font-style: italic;
}
.address {
  display: flex;
  gap: 6px;
  font-size: 14px;
}

.gap {
  height: 12px;
}

/* 搜索栏 */
.search-bar {
  display: flex;
  align-items: center;
  padding: 0 16px 12px;
}

.search-icon {
  font-size: 16px;
  color: #999;
  padding: 10px 0 10px 12px;
  background: white;
  border: 1px solid #ddd;
  border-right: none;
  border-radius: 8px 0 0 8px;
}

.search-input {
  flex: 1;
  padding: 10px 8px;
  border: 1px solid #ddd;
  border-left: none;
  border-right: none;
  font-size: 14px;
  outline: none;
  background: white;
  color: #333;
}
.search-input::placeholder {
  color: #aaa;
  font-size: 14px;
}

.search-btn {
  background: #ffc107;
  border: none;
  border-radius: 0 8px 8px 0;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

/* 中间滚动区域 */
.scroll {
  flex: 1;
  overflow-y: auto;
  padding: 16px 12px;
}

.title {
  text-align: center;
  color: #999;
  font-size: 14px;
  margin-bottom: 16px;
}

/* 卡片 */
.card {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 12px;
  margin-bottom: 10px;
}

.card-emoji {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64px;
  background: transparent;
  border-radius: 12px;
}

.card-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 2px 0;
  min-width: 0;
}

/* 第1行 */
.line1 {
  display: flex;
}
.shop-name {
  font-size: 18px;
  font-weight: 700;
  color: #222;
  max-width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 第2行 */
.line2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.line2-left {
  display: flex;
  align-items: center;
  gap: 6px;
}
.rating {
  font-size: 16px;
  font-weight: 700;
  color: #e59400;
}
.monthly-sales {
  font-size: 14px;
  color: #999;
}
.line2-right {
  display: flex;
  align-items: center;
  gap: 4px;
}
.time, .distance {
  font-size: 14px;
  color: #666;
}

/* 第3行 */
.line3 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.line3-left {
  display: flex;
  align-items: center;
  gap: 6px;
}
.min-price, .delivery-fee {
  font-size: 14px;
  color: #666;
}
.campus-tag {
  font-size: 14px;
  font-weight: 700;
  color: #e59400;
}

/* 第4行：黄底橙字 */
.line4 {
  display: flex;
}
.shop-desc {
  font-size: 12px;
  color: #e67e22;
  background: #fef3c7;
  padding: 3px 8px;
  border-radius: 3px;
  font-weight: 500;
}

/* 第5行 */
.line5 {
  display: flex;
}
.discount {
  font-size: 12px;
  color: #d73232;
  border: 1px solid #f5c6c6;
  padding: 3px 8px;
  border-radius: 3px;
}

/* 底部文字 */
.end {
  text-align: center;
  color: #ccc;
  font-size: 12px;
  padding: 10px;
}

/* 底部导航 */
.bottom {
  flex-shrink: 0;
  display: flex;
  background: white;
  border-top: 1px solid #eee;
  padding: 8px 0 12px;
}
.bottom div {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}
.bottom div:first-child {
  color: #ffc107;
}
</style>