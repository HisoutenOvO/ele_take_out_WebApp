<template>
  <div class="page">
    <div class="top-bar">
      <h1 class="logo">闪购</h1>
    </div>

    <div class="scroll-area">
      <div class="info-row">
        <div class="info-left">
          <span class="rose-icon">🌹</span>
          <span class="phone-number">130****1234</span>
        </div>
        <div class="info-right">
          <span class="account-btn" @click="showLogout = true">账号管理</span>
        </div>
      </div>

      <div class="feature-row">
        <div class="feature-item" @click="router.push('/address-list')">
          <div class="feature-content">
            <span class="feature-icon">📍</span>
            <span class="feature-label">收货地址</span>
          </div>
        </div>
        <div class="divider-line"></div>
        <div class="feature-item">
          <div class="feature-content">
            <span class="feature-icon">🧧</span>
            <span class="feature-title">红包</span>
            <span class="feature-subtitle">查看我的红包</span>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-content">
            <span class="feature-icon">🎫</span>
            <span class="feature-title">券</span>
            <span class="feature-subtitle">查看我的券</span>
          </div>
        </div>
      </div>
      <div style="height: 600px; background: transparent;"></div>
    </div>

    <div v-if="showLogout" class="modal-overlay" @click="showLogout = false">
      <div class="modal-box" @click.stop>
        <p class="modal-text">确定要退出登录吗？</p>
        <div class="modal-btns">
          <button class="btn-cancel" @click="showLogout = false">取消</button>
          <button class="btn-confirm" @click="handleLogout">确定</button>
        </div>
      </div>
    </div>

    <div class="bottom-wrapper">
      <BottomNav/>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import BottomNav from '@/components/BottomNav.vue'
import {cartStore} from "@/stores/cartStore.js"

const router = useRouter()
const showLogout = ref(false)

const handleLogout = () => {
  showLogout.value = false
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('role')
  cartStore.clear()
  router.push('/login')
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>

<style scoped>
.page {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow: hidden;
}

.top-bar {
  flex-shrink: 0;
  background: #fff;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.logo {
  font-size: 24px;
  font-weight: 400;
  font-style: italic;
  color: #333;
  margin: 0;
}

.scroll-area {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: #f5f5f5;
  padding: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}

.info-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rose-icon {
  font-size: 24px;
}

.phone-number {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.account-btn {
  font-size: 13px;
  color: #e59400;
  border: 1px solid #e59400;
  padding: 6px 14px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  white-space: nowrap;
}

.feature-row {
  display: flex;
  background: #fff;
  border-radius: 12px;
  padding: 8px 0;
  align-items: center;
  margin-bottom: 12px;
}

.feature-item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 8px;
}

.feature-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
}

.feature-icon {
  font-size: 28px;
}

.feature-label {
  font-size: 13px;
  color: #333;
  font-weight: 500;
}

.feature-title {
  font-size: 16px;
  font-weight: 700;
  color: #222;
}

.feature-subtitle {
  font-size: 11px;
  color: #999;
}

.divider-line {
  width: 1px;
  height: 36px;
  background: #e0e0e0;
  flex-shrink: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-box {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  width: 280px;
  text-align: center;
}

.modal-text {
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
}

.modal-btns {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-cancel {
  padding: 8px 24px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  color: #666;
}

.btn-confirm {
  padding: 8px 24px;
  border: none;
  background: #d73232;
  color: #fff;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

.bottom-wrapper {
  flex-shrink: 0;
  width: 100%;
}
</style>