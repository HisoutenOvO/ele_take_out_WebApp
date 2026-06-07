import request from '@/utils/request'

//查询分类下的菜品
export const GetCategoryDishes = (id) =>request.get(`/user/categories/dishes/${id}`)