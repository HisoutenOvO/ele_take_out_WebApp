<template>
  <div class="page">
    <!-- 独立的返回按钮 -->
    <div
        class="back-btn-fixed"
        :style="{ color: backBtnColor }"
        @click="$router.back()"
    >
      <i class="fas fa-chevron-left"></i>
    </div>

    <!-- 固定搜索栏 -->
    <div
        class="floating-header"
        :style="{ opacity: headerOpacity }"
    >
      <div class="header-content">
        <div
            class="search-group"
            :style="{
              transform: `translateX(${searchTranslateX})`,
              pointerEvents: headerFixed ? 'auto' : 'none'
            }"
        >
          <div class="search-icon-box">
            <i class="fa-brands fa-sistrix"></i>
          </div>
          <input
              type="text"
              placeholder="搜索商家或商品"
              class="search-input-box"
              readonly
          />
        </div>
        <div class="heart-icon">
          <i class="far fa-heart"></i>
        </div>
      </div>
    </div>

    <!-- 可滚动内容区域 -->
    <div
        class="scroll-area"
        ref="scrollAreaRef"
        @scroll="handleScroll"
    >
      <!-- 顶部大图 -->
      <div class="shop-cover">
        <img :src="shopInfo.image" class="cover-img" alt="封面" />
      </div>

      <!-- 商家信息卡片 -->
      <div class="shop-info-card">
        <div class="info-wrapper">
          <img :src="shopInfo.image" class="shop-logo" alt="店标" />
          <div class="info-right">
            <div class="name-row">
              <span class="shop-name">{{ shopInfo.name }}</span>
            </div>
            <div class="data-grid">
              <div class="data-col">
                <span class="data-label">评分</span>
                <span class="data-value rating-value">{{ shopInfo.rating }}</span>
              </div>
              <div class="col-divider"></div>
              <div class="data-col">
                <span class="data-label">月售</span>
                <span class="data-value">{{ shopInfo.monthlySales }}+</span>
              </div>
              <div class="col-divider"></div>
              <div class="data-col">
                <span class="data-label">校园送</span>
                <span class="data-value">{{ shopInfo.deliveryTime }}分钟</span>
              </div>
              <div class="col-divider"></div>
              <div class="data-col">
                <span class="data-label">商家特色</span>
                <span class="data-value">{{ shopInfo.special }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="notice-bar">
          <div class="notice-scroll">
            <span class="notice-text">{{ shopInfo.notice }}</span>
            <span class="notice-text spacer">&nbsp;&nbsp;&nbsp;</span>
            <span class="notice-text">{{ shopInfo.notice }}</span>
            <span class="notice-text spacer">&nbsp;&nbsp;&nbsp;</span>
          </div>
        </div>
        <div class="member-box" v-if="discounts && discounts.length">
          <img src="/img/super_member.png" class="member-icon" alt="皇冠" />
          <div class="member-discounts">
            <span
                v-for="(item, idx) in discounts"
                :key="idx"
                class="member-item"
            >
              {{ item }}
              <span v-if="idx < discounts.length - 1" class="member-divider"></span>
            </span>
          </div>
        </div>
      </div>

      <div class="goods-container" :class="{ 'fixed-layout': tabBarFixed }">
        <!-- 条形容器 -->
        <div
            class="tab-bar"
            :class="{ 'tab-fixed': tabBarFixed }"
            ref="tabBarRef"
        >
          <div class="tab-item active">
            <span>点餐</span>
            <span class="active-line"></span>
          </div>
          <div class="tab-item">
            <span>评价</span>
          </div>
          <div class="tab-item">
            <span>商家</span>
          </div>
        </div>
        <div v-if="tabBarFixed" class="tab-placeholder"></div>

        <div class="menu-area" :class="{ 'flex-fixed': tabBarFixed }">
          <!-- 左侧分类 -->
          <div
              class="category-list"
              :class="{ 'fixed-height': tabBarFixed }"
              ref="categoryListRef"
          >
            <div
                v-for="cat in categories"
                :key="cat.id"
                class="category-item"
                :class="{ selected: currentCategoryId === cat.id }"
                @click="selectCategory(cat.id)"
            >
              <span class="cat-icon">{{ cat.emoji }}</span>
              <span class="cat-name">{{ cat.name }}</span>
            </div>
          </div>

          <!-- 右侧菜品列表 -->
          <div
              class="dish-list"
              ref="dishListRef"
              @scroll="handleDishScroll"
          >
            <template v-for="cat in categories" :key="cat.id">
              <div
                  v-if="dishesByCategory[cat.id] && dishesByCategory[cat.id].length"
                  :id="`cat-${cat.id}`"
                  class="category-title"
              >
                {{ cat.name }}
              </div>
              <DishCard
                  v-for="dish in dishesByCategory[cat.id]"
                  :key="dish.id"
                  :dish="dish"
              />
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部购物车栏 -->
    <CartBar
        :deliveryFee="shopInfo.deliveryFee"
        :minPrice="shopInfo.minPrice"
    />
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import { useRoute } from 'vue-router'
import CartBar from '@/components/CartBar.vue'
import DishCard from "@/components/DishCard.vue"
import { GetShopDetail } from '@/api/shop'
import {ElMessage} from "element-plus";

const tabBarRef = ref(null)
const tabBarFixed = ref(false)
const tabBarInitialTop = ref(0)
const categoryListRef = ref(null)
const dishListRef = ref(null)
const scrollAreaRef = ref(null)
const scrollTop = ref(0)
const transitionEnd = 150
const isManualJump = ref(false)   // 防止手动跳转时触发联动
const route = useRoute()
const shopId = route.params.id
const discounts = ref(['满65减5', '满100减15', '满139减25', '新客立减10'])

// ---------- 分类数据 ----------
const categories = ref([
  { id: 1, name: '人气推荐', emoji: '🔥' },
  { id: 2, name: '汉堡', emoji: '🍔' },
  { id: 3, name: '小食', emoji: '🍟' },
  { id: 4, name: '饮品', emoji: '🥤' },
  { id: 5, name: '甜品', emoji: '🍰' },
  { id: 6, name: '炸鸡', emoji: '🍗' },
  { id: 7, name: '面条', emoji: '🍜' },
  { id: 8, name: '寿司', emoji: '🍣' },
  { id: 9, name: '沙拉', emoji: '🥗' },
  { id: 10, name: '小吃', emoji: '🍢' },
  { id: 11, name: '冰淇淋', emoji: '🍦' },
])

// ---------- 菜品数据（按分类组织） ----------
const dishesByCategory = ref({
  1: [
    { id: 101, name: '超级至尊披萨', description: '芝士、香肠、青椒、洋葱', monthlySales: 500, price: 128, image: '/img/sp02.png' },
    { id: 102, name: '巨无霸套餐', description: '巨无霸 + 可乐 + 薯条', monthlySales: 800, price: 42, image: '/img/sp06.png' },
    { id: 103, name: '招牌牛肉饭', description: '肥牛、洋葱、温泉蛋', monthlySales: 320, price: 38, image: '/img/sp05.png' },
  ],
  2: [
    { id: 201, name: '经典牛肉堡', description: '安格斯牛肉饼、生菜、芝士', monthlySales: 600, price: 35, image: '/img/sp07.png' },
    { id: 202, name: '双层吉士汉堡', description: '双层牛肉、芝士、酸黄瓜', monthlySales: 750, price: 29, image: '/img/sp08.png' },
    { id: 203, name: '香辣鸡腿堡', description: '鸡腿肉、生菜、香辣酱', monthlySales: 420, price: 22, image: '/img/sp09.png' },
    { id: 204, name: '鳕鱼堡', description: '鳕鱼排、塔塔酱', monthlySales: 280, price: 26, image: '/img/sp04.png' },
  ],
  3: [
    { id: 301, name: '黄金鸡块', description: '外酥里嫩，搭配甜辣酱', monthlySales: 900, price: 18, image: '/img/sp06.png' },
    { id: 302, name: '美式薯条', description: '粗薯条，海盐调味', monthlySales: 1100, price: 15, image: '/img/sp07.png' },
    { id: 303, name: '洋葱圈', description: '酥脆洋葱圈，番茄酱', monthlySales: 670, price: 14, image: '/img/sp08.png' },
  ],
  4: [
    { id: 401, name: '冰美式', description: '意式浓缩+冰水', monthlySales: 850, price: 18, image: '/img/sp09.png' },
    { id: 402, name: '柠檬茶', description: '鲜切柠檬，清凉解腻', monthlySales: 720, price: 16, image: '/img/sp02.png' },
    { id: 403, name: '草莓奶昔', description: '新鲜草莓+冰淇淋', monthlySales: 540, price: 24, image: '/img/sp05.png' },
    { id: 404, name: '可乐', description: '冰镇可口可乐', monthlySales: 1200, price: 10, image: '/img/sp04.png' },
  ],
  5: [
    { id: 501, name: '巧克力熔岩', description: '爆浆巧克力，香草冰淇淋', monthlySales: 380, price: 32, image: '/img/sp06.png' },
    { id: 502, name: '焦糖布丁', description: '香滑布丁，焦糖酱', monthlySales: 450, price: 22, image: '/img/sp07.png' },
  ],
  6: [
    { id: 601, name: '韩式炸鸡', description: '甜辣酱，外酥里嫩', monthlySales: 880, price: 38, image: '/img/sp08.png' },
    { id: 602, name: '原味炸鸡', description: '薄脆外皮，鲜嫩多汁', monthlySales: 760, price: 36, image: '/img/sp09.png' },
    { id: 603, name: '鸡米花', description: '一口一个，蜂蜜芥末酱', monthlySales: 540, price: 20, image: '/img/sp02.png' },
  ],
  7: [
    { id: 701, name: '番茄肉酱面', description: '手工意面，浓郁肉酱', monthlySales: 410, price: 28, image: '/img/sp05.png' },
    { id: 702, name: '日式拉面', description: '豚骨汤底，溏心蛋', monthlySales: 370, price: 35, image: '/img/sp04.png' },
  ],
  8: [
    { id: 801, name: '三文鱼寿司', description: '新鲜三文鱼，芥末酱油', monthlySales: 320, price: 22, image: '/img/sp06.png' },
    { id: 802, name: '鳗鱼寿司', description: '蒲烧鳗鱼，照烧汁', monthlySales: 290, price: 25, image: '/img/sp07.png' },
  ],
  9: [
    { id: 901, name: '凯撒沙拉', description: '罗马生菜、培根、帕玛森', monthlySales: 250, price: 24, image: '/img/sp08.png' },
    { id: 902, name: '田园沙拉', description: '混合生菜、圣女果、玉米', monthlySales: 200, price: 20, image: '/img/sp09.png' },
  ],
  10: [
    { id: 1001, name: '烤翅', description: '奥尔良风味烤翅', monthlySales: 650, price: 16, image: '/img/sp02.png' },
    { id: 1002, name: '玉米浓汤', description: '香甜浓郁，黄油面包', monthlySales: 310, price: 12, image: '/img/sp05.png' },
  ],
  11: [
    { id: 1101, name: '香草冰淇淋', description: '马达加斯加香草', monthlySales: 480, price: 15, image: '/img/sp04.png' },
    { id: 1102, name: '抹茶冰淇淋', description: '宇治抹茶，微苦回甘', monthlySales: 420, price: 18, image: '/img/sp06.png' },
    { id: 1103, name: '抹茶冰淇淋', description: '宇治抹茶，微苦回甘', monthlySales: 420, price: 18, image: '/img/sp06.png' },
    { id: 1104, name: '抹茶冰淇淋', description: '宇治抹茶，微苦回甘', monthlySales: 420, price: 18, image: '/img/sp06.png' },
    { id: 1105, name: '抹茶冰淇淋', description: '宇治抹茶，微苦回甘', monthlySales: 420, price: 18, image: '/img/sp06.png' },
    { id: 1106, name: '抹茶冰淇淋', description: '宇治抹茶，微苦回甘', monthlySales: 420, price: 18, image: '/img/sp06.png' },
  ]
})


const currentCategoryId = ref(1)

// ---------- 商家信息 ----------
const shopInfo = ref({})



const search = async() => {
  const result = await GetShopDetail(shopId)
  if(result.code === 200){
    shopInfo.value = result.data
  }else{
    ElMessage.error(result.msg || "请求错误")
  }
}


// ---------- 动画相关 ----------
const progress = computed(() => Math.min(scrollTop.value / transitionEnd, 1))
const headerFixed = computed(() => scrollTop.value >= transitionEnd)
const headerOpacity = computed(() => progress.value)
const backBtnColor = computed(() => {
  const r = 255, g = 255, b = 255
  const finalR = 0, finalG = 0, finalB = 0
  const p = progress.value
  return `rgb(${Math.round(r + (finalR - r) * p)}, ${Math.round(g + (finalG - g) * p)}, ${Math.round(b + (finalB - b) * p)})`
})
const searchTranslateX = computed(() => `${(1 - progress.value) * 100}%`)

// ---------- 左侧点击跳转 ----------
const selectCategory = (id) => {
  currentCategoryId.value = id
  isManualJump.value = true

  // 左侧列表滚动到可见位置
  const selectedItem = categoryListRef.value?.querySelector('.category-item.selected')
  if (selectedItem) {
    selectedItem.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }

  // 右侧跳转到对应标题
  const targetEl = document.getElementById(`cat-${id}`)
  if (!targetEl) return

  if (tabBarFixed.value) {
    const container = dishListRef.value
    if (container) {
      const containerRect = container.getBoundingClientRect()
      const targetRect = targetEl.getBoundingClientRect()
      const offsetTopInContainer = targetRect.top - containerRect.top + container.scrollTop
      container.scrollTo({ top: offsetTopInContainer - 8, behavior: 'smooth' })
    }
  } else {
    const scrollContainer = scrollAreaRef.value
    if (scrollContainer) {
      const containerRect = scrollContainer.getBoundingClientRect()
      const targetRect = targetEl.getBoundingClientRect()
      const offsetTop = targetRect.top - containerRect.top + scrollContainer.scrollTop
      scrollContainer.scrollTo({ top: offsetTop - 76 - 8, behavior: 'smooth' })
    }
  }

  setTimeout(() => {
    isManualJump.value = false
  }, 600)
}

// ---------- 右侧滚动联动左侧高亮 ----------
// 非固定模式：基于全局滚动
const updateActiveCategoryForGlobal = () => {
  const titles = document.querySelectorAll('.category-title')
  if (titles.length === 0) return
  const threshold = 76 + 10
  let activeId = categories.value[0]?.id
  for (let i = titles.length - 1; i >= 0; i--) {
    const rect = titles[i].getBoundingClientRect()
    if (rect.top <= threshold) {
      activeId = Number(titles[i].id.replace('cat-', ''))
      break
    }
  }
  if (activeId && activeId !== currentCategoryId.value) {
    currentCategoryId.value = activeId
  }
}

// 固定模式：基于右侧容器内部滚动
const updateActiveCategoryForFixed = () => {
  const container = dishListRef.value
  if (!container) return
  const titles = container.querySelectorAll('.category-title')
  if (titles.length === 0) return

  const containerRect = container.getBoundingClientRect()
  let activeId = categories.value[0]?.id
  for (let i = titles.length - 1; i >= 0; i--) {
    const rect = titles[i].getBoundingClientRect()
    const relativeTop = rect.top - containerRect.top
    if (relativeTop <= 10) {
      activeId = Number(titles[i].id.replace('cat-', ''))
      break
    }
  }
  if (activeId && activeId !== currentCategoryId.value) {
    currentCategoryId.value = activeId
  }
}

const handleDishScroll = () => {
  if (!isManualJump.value) {
    updateActiveCategoryForFixed()
  }
}

const handleScroll = () => {
  if (!scrollAreaRef.value) return
  const st = scrollAreaRef.value.scrollTop
  scrollTop.value = st

  if (!tabBarRef.value) return
  if (!tabBarFixed.value) {
    tabBarInitialTop.value = tabBarRef.value.offsetTop
  }
  tabBarFixed.value = st >= tabBarInitialTop.value - 76

  if (!isManualJump.value) {
    if (!tabBarFixed.value) {
      updateActiveCategoryForGlobal()
    } else {
      updateActiveCategoryForFixed()
    }
  }
}

onMounted(()=>{
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

.back-btn-fixed {
  position: fixed;
  top: 0;
  left: 16px;
  height: 76px;
  display: flex;
  align-items: center;
  z-index: 110;
  font-size: 22px;
  cursor: pointer;
  padding: 8px;
}

.floating-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 76px;
  background-color: white;
  z-index: 100;
  display: flex;
  align-items: center;
}

.header-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-sizing: border-box;
}

.search-group {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 41.27px;
  overflow: hidden;
}

.search-icon-box {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 10px;
  border: 1px solid #000;
  border-right: none;
  border-radius: 20px 0 0 20px;
  background: rgb(243,246,248);
  color: #333;
  font-size: 18px;
  flex-shrink: 0;
}

.search-input-box {
  flex: 1;
  height: 100%;
  border: 1px solid #000;
  border-left: none;
  border-radius: 0 20px 20px 0;
  padding: 0 12px;
  font-size: 14px;
  outline: none;
  background: rgb(243,246,248);
  color: #333;
  max-width: 251.78px;
  box-sizing: border-box;
}

.heart-icon {
  flex: 0 0 auto;
  font-size: 22px;
  color: #999;
  padding: 8px;
  margin-right: -8px;
}

.scroll-area {
  flex: 1;
  overflow-y: auto;
  position: relative;
  scroll-padding-top: 76px;
}

.shop-cover {
  width: 100%;
  height: 20vh;
  overflow: hidden;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.shop-info-card {
  background: #fff;
  border-radius: 16px 16px 0 0;
  margin-top: -16px;
  padding-bottom: 10px;
  position: relative;
  z-index: 2;
}

.info-wrapper {
  display: flex;
  gap: 10px;
  padding: 16px 16px 0;
  align-items: flex-start;
}

.shop-logo {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
}

.info-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.name-row {
  padding-top: 4px;
  padding-bottom: 10px;
  line-height: 20px;
}

.shop-name {
  font-size: 20px;
  font-weight: 800;
  color: #222;
}

.data-grid {
  display: flex;
  align-items: stretch;
  height: 28px;
}

.data-col {
  flex: none;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 0 5px;
}

.data-label { font-size: 11px; color: #999; line-height: 14px; }
.data-value { font-size: 13px; color: #333; font-weight: 700; line-height: 14px; }
.rating-value { color: #e59400; }
.col-divider { width: 1px; height: 28px; background: #e0e0e0; flex-shrink: 0; align-self: center; }

.notice-bar {
  margin-top: 8px; padding: 0 16px; height: 14px; display: flex; align-items: center; overflow: hidden;
}
.notice-scroll { display: flex; white-space: nowrap; animation: scroll-left 8s linear infinite; width: max-content; }
.notice-text { font-size: 11px; color: #999; line-height: 14px; flex-shrink: 0; }
.spacer { color: transparent; }

@keyframes scroll-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.member-box {
  margin: 8px 16px 0;
  padding: 4px 12px;
  background: rgb(255,227,183);
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  max-width: calc(100% - 32px);
}
.member-icon { width: 15px; height: 15px; flex-shrink: 0; }
.member-discounts { display: flex; align-items: center; gap: 0; flex-wrap: wrap; }
.member-item { font-size: 12px; color: #8B4513; display: flex; align-items: center; white-space: nowrap; }
.member-divider { width: 1px; height: 12px; background: #8B4513; margin: 0 8px; flex-shrink: 0; }

.goods-container {
  background: #fff;
  padding-top: 9px;
  margin-top: 25px;
  min-height: 100vh;
  transition: height 0.2s;
}
.goods-container.fixed-layout {
  height: calc(100vh - 76px - 56px);
  display: flex;
  flex-direction: column;
  min-height: auto;
}

.tab-bar {
  display: flex;
  align-items: center;
  height: 48px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  width: fit-content;
  margin: 0;
  gap: 50px;
  padding-left: 20px;
}
.tab-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  width: 37px;
  position: relative;
  color: #666;
  font-size: 16px;
}
.tab-item.active { color: #222; font-weight: 600; }
.active-line {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 18px;
  height: 3px;
  background: #222;
  border-radius: 2px;
}

.tab-bar.tab-fixed {
  position: fixed;
  top: 76px;
  left: 0;
  width: 100%;
  max-width: 100%;
  z-index: 99;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.tab-placeholder { height: 48px; }

.menu-area { flex: 1; display: flex; overflow: hidden; }
.menu-area.flex-fixed { height: 100%; }

/* 左侧分类 - 默认 */
.category-list {
  width: 100px;
  max-height: calc(100vh - 76px - 48px - 56px - 9px);
  overflow-y: auto;
  overflow-x: hidden;
  background: #f5f5f5;
  padding: 16.05px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16.05px;
  flex-shrink: 0;
}

/* 固定模式下撑满高度 */
.category-list.fixed-height {
  max-height: none !important;
  height: 100% !important;
}

.category-item {
  width: 55.04px;
  height: 49.3px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border-radius: 8px;
  background: #F3F6F8;
  color: #50607A;
  font-weight: normal;
  cursor: pointer;
  flex-shrink: 0;
  position: relative;
  z-index: 0;
  transition: color 0.2s, font-weight 0.2s;
}
.category-item.selected::before {
  content: '';
  position: absolute;
  top: -16.05px; left: -16.05px; right: -16.05px; bottom: -16.05px;
  background: #fff;
  border-radius: 8px;
  z-index: -1;
}
.category-item.selected {
  color: #111920;
  font-weight: bold;
  background: transparent;
}

/* 右侧菜品列表 */
.dish-list {
  flex: 1;
  overflow-y: auto;          /* 始终可滚动，保证滚动事件触发 */
  -webkit-overflow-scrolling: touch;
  background: #fff;
}

.category-title {
  width: 117.76px;
  height: 45.86px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  color: #000;
  font-size: 17.74px;
  font-weight: 600;
  background: #fff;
  margin-top: 10px;
}

.cat-icon {
  font-size: 13px;
  width: 13.15px;
  height: 13.75px;
  margin-right: 6.88px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.cat-name {
  width: 34.42px;
  height: 34.4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  line-height: 1.2;
  text-align: center;
  word-break: break-all;
}
</style>