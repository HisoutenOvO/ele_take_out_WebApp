<template>
  <div class="page">
    <div class="top-area">
      <h1 class="logo">闪购</h1>
      <p class="subtitle">创建账号</p>
    </div>

    <div class="register-form">
      <div class="form-item">
        <i class="fas fa-user icon"></i>
        <input
            v-model="registerForm.username"
            type="text"
            placeholder="请输入用户名"
            class="form-input"
        />
      </div>
      <div class="form-item">
        <i class="fas fa-phone icon"></i>
        <input
            v-model="registerForm.phone"
            type="tel"
            placeholder="请输入手机号"
            class="form-input"
        />
      </div>
      <div class="form-item">
        <i class="fas fa-id-card icon"></i>
        <input
            v-model="registerForm.nickname"
            type="text"
            placeholder="请输入昵称"
            class="form-input"
        />
      </div>
      <div class="form-item">
        <i class="fas fa-lock icon"></i>
        <input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            class="form-input"
        />
      </div>
      <button class="register-btn" @click="handleRegister">注 册</button>
      <p class="login-link">
        已有账号？<span @click="goLogin">立即登录</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus'
import {userRegister} from '@/api/login'

const router = useRouter()

const registerForm = ref({
  username: '',
  phone: '',
  nickname: '',
  password: ''
})

const handleRegister = async () => {
  if (!registerForm.value.username || !registerForm.value.phone || !registerForm.value.nickname || !registerForm.value.password) {
    ElMessage.warning('请填写所有字段')
    return
  }

  if (!/^1[3-9]\d{9}$/.test(registerForm.value.phone)) {
    ElMessage.warning('请输入正确的手机号')
    return
  }

  if (registerForm.value.password.length < 6) {
    ElMessage.warning('密码长度不能少于6位')
    return
  }

  try {
    const result = await userRegister(registerForm.value)
    if (result.code === 200) {
      ElMessage.success('注册成功，请登录')
      router.push('/login')
    } else {
      ElMessage.error(result.msg)
    }
  } catch {
    ElMessage.error('网络错误，请稍后重试')
  }
}

const goLogin = () => {
  router.push('/login')
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
  color: rgba(255, 255, 255, 0.8);
  margin-top: 10px;
}

.register-form {
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

.register-btn {
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

.register-btn:active {
  background: #d45a1f;
}

.login-link {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #999;
}

.login-link span {
  color: #ED6C2D;
  cursor: pointer;
}
</style>