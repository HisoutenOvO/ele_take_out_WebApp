import request from '@/utils/request'

//提交订单
export const SubmitOrder = (order) => request.post('/user/orders',order)

//支付订单
export const PayOrder = (id,payMethod) => request.post(`/user/orders/pay/${id}?payMethod=${payMethod}`)

//查看订单详情
export const GetOrderDetail = (id) => request.get(`/user/orders/${id}`)

//获取订单列表
export const GetOrderList = () => request.get('/user/orders/list')
