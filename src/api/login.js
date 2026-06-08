import request from '@/utils/request'

// 用户登录
export const userLogin = (data) => request.post('/user/login', data)

// 用户注册（新增）
export const userRegister = (data) => request.post('/user/register', data)

