<template>
  <div class="page">
    <!-- 顶部固定区域 -->
    <div class="top">
      <div class="yellow-bar">
        <h1>淘宝闪购</h1>
        <div class="address">
          <i class="fa-solid fa-location-dot" style="font-size: 4vw"></i>
          <span>杭州西湖区·梦想小镇</span>
          <span>▼</span>
        </div>
      </div>
      <div class="gap"></div>

      <!-- 搜索栏：左侧放大镜图标 -->
      <div class="search-bar">
        <i class="fa-brands fa-sistrix search-icon" style="flex:0 0 6vw;"></i>
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
      <div class="recommend-header">
        <span class="line"></span>
        <span class="title-text">为你推荐附近的商家</span>
        <span class="line"></span>
      </div>

      <!-- 卡片列表 -->
      <div v-for="shop in filteredShops" :key="shop.id" class="card" @click="goToShop(shop.id)">
        <!-- 左侧图片：直接放emoji，无背景，占1/3 -->
        <img :src="shop.image" class="card-emoji" alt="商家图片" />
        <!-- 右侧详细信息容器 -->
        <div class="card-detail">
          <!-- 第1行：店名 -->
          <div class="line1">
            <span class="shop-name">{{ shop.name }}</span>
          </div>

          <!-- 第2行：评分 月售 | 时间 距离 -->
          <div class="line2">
            <div class="line2-left">
              <span class="rating">{{ shop.rating }}分</span>
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
              <span class="delivery-fee strikethrough">配送¥{{ shop.deliveryFee }}</span>
              <span class="delivery-fee">配送¥{{ shop.deliveryFee }}</span>
            </div>
            <div class="line3-right">
              <span class="campus-tag" v-if="shop.campus">校园送</span>
            </div>
          </div>

          <!-- 第4行：商家描述（黄色背景橙色字） -->
          <div class="line4" v-if="shop.special">
            <span class="shop-desc">{{ shop.special }}</span>
          </div>

          <!-- 第5行：优惠标签列表 -->
          <div class="line5" v-if="discounts && discounts.length">
            <span v-for="(item, idx) in discounts" :key="idx" class="discount">{{ item }}</span>
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
import {ref, computed, onMounted} from 'vue'
import BottomNav from '@/components/BottomNav.vue'
import { useRouter } from 'vue-router'
import { GetShopList } from '@/api/shop'
import {ElMessage} from "element-plus";
const router = useRouter()

const goToShop = (id) => {
  router.push(`/shop/${id}`)
}
const searchKeyword = ref('')

const search = async() => {
  const result = await GetShopList('')
  if(result.code === 200){
      shops.value = result.data
  }else{
    ElMessage.error(result.msg || "请求出错")
  }
}


const shops = ref([])
const discounts = ref(['满65减5', '满100减15', '新客立减10'])
const filteredShops = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (!keyword) return shops.value
  return shops.value.filter(shop =>
      shop.name.toLowerCase().includes(keyword)
  )
})

const getShopImg = (name) => {
  const map = {
    '必胜客': '/img/sj08.png',
    '麦当劳': '/img/sj09.png',
    '海底捞': '/img/sp01.png',
    '瑞幸咖啡': '/img/sp02.png',
    '肯德基': '/img/sp03.png'
  }
  return map[name] || '/img/sj01.png'
}

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    console.log('搜索:', searchKeyword.value)
    search(keyword)
  }
}

onMounted(()=>{
search()
})
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
  background: #ED6C2D;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  color: white;
  gap: 12px;   /* logo 和地址之间的间距 */
}

.yellow-bar h1 {
  font-size: 24px;
  font-weight: 400;
  font-style: italic;
  flex-shrink: 0;
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
/* 搜索栏 */
.search-bar {
  display: flex;
  align-items: center;
  padding: 0 16px 12px;
  height: 40px;                    /* 统一高度 */
}

.search-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #999;
  background: white;
  border: 1px solid #ddd;
  border-right: none;
  border-radius: 20px 0 0 20px;    /* 左半圆角 */
}

.search-input {
  flex: 1;
  height: 40px;
  padding: 0 8px;
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
  height: 40px;
  padding: 0 20px;
  background: #ED6C2D;
  border: none;
  border-radius: 0 20px 20px 0;    /* 右半圆角 */
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  color: white;
  white-space: nowrap;
}
.recommend-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 12px;
}
.line {
  flex: 1;
  height: 1px;
  background: #ddd;
}
.title-text {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  flex-shrink: 0;
}
/* 中间滚动区域 */
.scroll {
  flex: 1;
  overflow-y: auto;
  padding: 0 12px 16px;  /* 上边距 0，左右 12px，下边距 16px */
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
  object-fit: cover;
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
  gap: 8px;
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
.strikethrough {
  text-decoration: line-through;
  color: #999;
}
</style>