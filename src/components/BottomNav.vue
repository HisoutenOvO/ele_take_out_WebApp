<template>
  <div class="bottom-nav">
    <router-link to="/index" class="nav-item" active-class="active" exact>
      <i class="fa-solid fa-house nav-icon"></i>
      <span class="nav-text">首页</span>
    </router-link>
    <router-link to="/orders" class="nav-item" active-class="active">
      <i class="fa-regular fa-paste nav-icon"></i>
      <span class="nav-text">订单</span>
    </router-link>
    <router-link to="/profile" class="nav-item" active-class="active">
      <i class="fa-solid fa-user nav-icon"></i>
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
  height: 48px;           /* 固定高度，防止撑开 */
  justify-content: center;
}

.nav-item.active {
  color: #ffc107;
}

.nav-icon {
  font-size: 22px;
  line-height: 1;
}

.nav-text {
  font-size: 12px;
  line-height: 1;
  font-weight: 400;       /* 始终用相同字重 */
}

.nav-item.active .nav-text {
  font-weight: 400;       /* 激活态也不加粗，避免高度变化 */
}</style>