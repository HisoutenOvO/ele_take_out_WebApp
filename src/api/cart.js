import request from '@/utils/request'

//获取购物车列表
export const GetCartList = (id) => request.get(`/user/cart/${id}`)

//添加购物车
export const AddCart = (cart) => request.post('/user/cart',cart)

//删除购物车
export const DeleteCart = (cart) => request.delete('/user/cart',{params: cart})
