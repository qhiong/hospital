import { post, get } from '@/request/http'

export const apiGetWarehousingListByPagination = p => post('Warehousing/getWarehousingByConditionalPaging', p)
export const apiDeleteWarehousing = p => post('Warehousing/deleteById', p)
export const apiAddWarehousing = p => get('Warehousing/addWarehousing', p)
