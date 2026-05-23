<template>
  <div class="bottom-nav">
    <router-link to="/" class="nav-item" active-class="active" exact>
      <span class="nav-icon">🏠</span>
      <span class="nav-text">首页</span>
    </router-link>
    <router-link to="/orders" class="nav-item" active-class="active">
      <span class="nav-icon">📋</span>
      <span class="nav-text">订单</span>
    </router-link>
    <router-link to="/profile" class="nav-item" active-class="active">
      <span class="nav-icon">👤</span>
      <span class="nav-text">我的</span>
    </router-link>
  </div>
</template>

<style scoped>
.bottom-nav {
  flex-shrink: 0;
  display: flex;
  background: white;
  border-top: 1px solid #eee;
  padding: 8px 0 12px;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  color: #999;
  font-size: 12px;
}

.nav-item.active {
  color: #ffc107;
}

.nav-icon {
  font-size: 22px;
}

.nav-text {
  font-size: 12px;
}
</style>