<template>
  <div class="page">
    <div class="header">
      <span class="back-btn" @click="$router.back()">←</span>
      <span class="title">订单详情</span>
    </div>
    <div class="content">
      <p>订单 ID: {{ orderId }}</p>
      <p>（页面待开发）</p>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
const orderId = route.params.id
</script>

<style scoped>
.page {
  height: 100vh;
  background: #fff;
}
.header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  font-size: 18px;
  font-weight: 600;
}
.back-btn {
  cursor: pointer;
  margin-right: 12px;
  font-size: 22px;
}
.content {
  padding: 20px;
  color: #666;
}
</style>