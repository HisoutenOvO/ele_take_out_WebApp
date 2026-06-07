import request from '@/utils/request'

//商家列表查询
export const GetShopList = (keyword) =>request.get(`user/shops?keyword=${keyword}`)

//获取商家详情
export const GetShopDetail = (id) =>request.get(`user/shops/${id}`)