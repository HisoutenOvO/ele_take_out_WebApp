import request from '@/utils/request'

// 用户登录
export const userLogin = (data) => request.post('/user/login', data)
