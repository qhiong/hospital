import { post, get } from '@/request/http'

export const apiGetDeviceName = p => post('DeviceName/getAll', p)
export const apiGetDeviceNameListByPagination = p => post('DeviceName/getDeviceNameByConditionalPaging', p)
export const apiUpdateDeviceName = p => post('DeviceName/updateById', p)
export const apiDeleteDeviceName = p => post('DeviceName/deleteById', p)
export const apiAddDeviceName = p => get('DeviceName/addDeviceName', p)
