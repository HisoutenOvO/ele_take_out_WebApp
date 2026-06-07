<template>
  <div class="page">
    <!-- 顶部橙色区域 -->
    <div class="top-area">
      <h1 class="logo">闪购</h1>
      <p class="subtitle">欢迎回来</p>
    </div>

    <!-- 登录表单 -->
    <div class="login-form">
      <div class="form-item">
        <i class="fas fa-user icon"></i>
        <input
            v-model="loginForm.username"
            type="text"
            placeholder="请输入用户名/手机号"
            class="form-input"
        />
      </div>
      <div class="form-item">
        <i class="fas fa-lock icon"></i>
        <input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            class="form-input"
        />
      </div>
      <button class="login-btn" @click="handleLogin">登 录</button>
      <p class="register-link">
        还没有账号？<span @click="goRegister">立即注册</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { userLogin } from '@/api/login'

const router = useRouter()

const loginForm = ref({
  username: '',
  password: ''
})

const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }
  try {
    const res = await userLogin(loginForm.value)
    // 不管成功还是失败，先把完整的响应对象打印出来
    console.log('后端返回的完整对象:', JSON.stringify(res))
    if (res.code === 200) {
      ElMessage.success('登录成功')
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data))
      router.push('/')
    } else {
      // 把整个 res 对象显示出来，看看它里面到底有没有 msg
      ElMessage.error(res.msg)
    }
  } catch {
    ElMessage.error('网络错误，请稍后重试')
  }
}

const goRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.page {
  height: 100vh;
  background: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.top-area {
  background: linear-gradient(135deg, #ED6C2D, #f08a5d);
  padding: 60px 30px 40px;
  text-align: center;
}

.logo {
  font-size: 36px;
  font-weight: 400;
  font-style: italic;
  color: #fff;
  margin: 0;
}

.subtitle {
  font-size: 16px;
  color: rgba(255,255,255,0.8);
  margin-top: 10px;
}

.login-form {
  padding: 40px 30px;
}

.form-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding: 0 10px;
}

.icon {
  font-size: 18px;
  color: #999;
  margin-right: 10px;
  width: 20px;
  text-align: center;
}

.form-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 12px 0;
  font-size: 16px;
  color: #333;
}

.form-input::placeholder {
  color: #bbb;
}

.login-btn {
  width: 100%;
  height: 48px;
  background: #ED6C2D;
  border: none;
  border-radius: 24px;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
  transition: background 0.2s;
}

.login-btn:active {
  background: #d45a1f;
}

.register-link {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #999;
}

.register-link span {
  color: #ED6C2D;
  cursor: pointer;
}
</style>