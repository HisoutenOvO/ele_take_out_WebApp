<template>
  <div class="card">
    <!-- 左侧图片，无包裹，直接作为卡片子元素 -->
    <span class="card-emoji">{{ emoji }}</span>

    <!-- 右侧详细信息容器 -->
    <div class="card-detail">
      <div class="line1">
        <span class="shop-name">{{ data.name }}</span>
      </div>
      <div class="line2">
        <div class="line2-left">
          <span class="rating">⭐{{ data.rating }}</span>
          <span class="monthly-sales">月售{{ data.monthlySales }}+</span>
        </div>
        <div class="line2-right">
          <span class="time">{{ data.deliveryTime }}分钟</span>
          <span class="distance">{{ data.distance }}</span>
        </div>
      </div>
      <div class="line3">
        <div class="line3-left">
          <span class="min-price">起送¥{{ data.minPrice }}</span>
          <span class="delivery-fee">配送¥{{ data.deliveryFee }}</span>
        </div>
        <div class="line3-right">
          <span class="campus-tag" v-if="data.campus">校园送</span>
        </div>
      </div>
      <div class="line4">
        <span class="shop-desc" v-if="data.description">“{{ data.description }}”</span>
      </div>
      <div class="line5">
        <span class="discount" v-if="data.discount">{{ data.discount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: { type: Object, required: true }
})

const emoji = computed(() => {
  const map = {
    '必胜客': '🍕', '麦当劳': '🍔', '海底捞': '🍲',
    '瑞幸咖啡': '☕', '肯德基': '🍗'
  }
  return map[props.data.name] || '🏪'
})
</script>

<style scoped>
/* ===== 卡片整体 ===== */
.card {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 12px;
  margin-bottom: 10px; /* 可以用，不会破坏滚动 */
}

/* ===== 左侧图片：无背景，直接显示 emoji，尺寸占卡片 1/3 ===== */
.card-emoji {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64px;
  /* 背景透明，与卡片融为一体，开发者工具不会单独高亮 */
  background: transparent;
  border-radius: 12px;
}

/* ===== 右侧详细信息容器 ===== */
.card-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 2px 0;
  min-width: 0;
}

/* ===== 第1行：店名（字体加大） ===== */
.line1 { display: flex; }
.shop-name {
  font-size: 18px;
  font-weight: 700;
  color: #222;
  max-width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ===== 第2行：评分 月售 | 时间 距离（字体加大） ===== */
.line2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}
.line2-left { display: flex; align-items: center; gap: 6px; }
.rating {
  font-size: 18px;
  font-weight: 700;
  color: #e59400;
}
.monthly-sales { font-size: 14px; color: #999; }
.line2-right { display: flex; align-items: center; gap: 4px; }
.time { font-size: 14px; color: #666; }
.distance { font-size: 14px; color: #999; }

/* ===== 第3行：起送 配送 | 校园送 ===== */
.line3 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}
.line3-left { display: flex; align-items: center; gap: 6px; }
.min-price { font-size: 14px; color: #666; }
.delivery-fee { font-size: 14px; color: #666; }
.campus-tag {
  font-size: 14px;
  font-weight: 700;
  color: #e59400;
}

/* ===== 第4行：商家描述 ===== */
.line4 { display: flex; }
.shop-desc {
  font-size: 12px;
  color: #e67e22;       /* 橙色字 */
  background: #fef3c7;  /* 黄色背景 */
  padding: 3px 8px;
  border-radius: 3px;
  font-weight: 500;
}

/* ===== 第5行：优惠 ===== */
.line5 { display: flex; }
.discount {
  font-size: 12px;
  color: #d73232;
  border: 1px solid #f5c6c6;
  padding: 3px 8px;
  border-radius: 3px;
}
</style>