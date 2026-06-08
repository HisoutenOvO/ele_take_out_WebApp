import request from '@/utils/request'

//收货地址列表
export const GetAddressList = () => request.get('/user/addresses')

//根据id查询 地址
export const GetAddressById = (id) => request.get(`/user/addresses/${id}`)

//新增地址
export const AddAddress = (addr) => request.post('/user/addresses',addr)

// 修改地址
export const UpdateAddress = (id, data) => request.put(`/user/addresses/${id}`, data)

// 删除地址
export const DeleteAddress = (id) => request.delete(`/user/addresses/${id}`)