import request from '@/utils/request'

//收货地址列表
export const GetAddressList = () => request.get('/user/addresses')

//根据id查询 地址
export const GetAddressById = (id) => request.get(`/user/addresses/${id}`)