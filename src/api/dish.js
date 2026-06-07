import request from '@/utils/request'

//根据id查询菜品
export const GetDishById = (id) => request.get(`/user/dishes/${id}`)