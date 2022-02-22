import { post, get } from '@/request/http'

export const apiGetAllRepair = p => post('Repair/getAll', p)
export const apiGetRepairListByPagination = p => post('Repair/getRepairByConditionalPaging', p)
export const apiUpdateRepair = p => post('Repair/updateUserById', p)
export const apiAddRepair = p => get('Repair/addRepair', p)
export const apiDeleteRepair = p => post('Repair/deleteById', p)
