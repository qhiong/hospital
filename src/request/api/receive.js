import { post, get } from '@/request/http'

export const apiGetByState = p => post('Receive/getByState', p)
export const apiGetReceiveAll = p => get('Receive/getAll', p)
export const apiGetDeviceNameListByPagination = p => post('Receive/getReceiveByConditionalPaging', p)
export const apiUpdateReceive = p => post('Receive/updateById', p)
export const apiDeleteReceive = p => post('Receive/deleteById', p)
export const apiAddReceive = p => get('Receive/addReceive', p)
export const apiUpdateReceiveToDep = p => post('Receive/updateDepById', p)
