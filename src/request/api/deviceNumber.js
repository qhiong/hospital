import { post, get } from '@/request/http'

export const apiGetDeviceNumberByDeviceNameId = p => get('DeviceNumber/getDeviceNumberByDeviceNameId', p)
export const apiGetDeviceNumberAll = p => post('DeviceNumber/getAll', p)
export const apiGetDeviceNumberListByPagination = p => post('DeviceNumber/getDeviceNumberByConditionalPaging', p)
export const apiUpdateDeviceNumber = p => post('DeviceNumber/updateById', p)
export const apiDeleteDeviceNumber = p => post('DeviceNumber/deleteById', p)
export const apiAddDeviceNumber = p => post('DeviceNumber/addDeviceNumber', p)
