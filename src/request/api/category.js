import { post, get } from '@/request/http'

export const apiGetCategory = p => post('Category/getAll', p)
export const apiGetCategoryListByPagination = p => post('Category/getCategoryByConditionalPaging', p)
export const apiUpdateCategory = p => post('Category/updateById', p)
export const apiDeleteCategory = p => post('Category/deleteById', p)
export const apiAddCategory = p => get('Category/addCategory', p)
