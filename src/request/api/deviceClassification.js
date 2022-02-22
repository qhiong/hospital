import { post, get } from '@/request/http'

export const apiGetDeviceClassifications = p => post('DeviceClassification/getAll', p)
export const apiGetDeviceClassificationListByPagination = p => post('DeviceClassification/getDeviceClassificationByConditionalPaging', p)
export const apiUpdateDeviceClassification = p => post('DeviceClassification/updateById', p)
export const apiDeleteDeviceClassification = p => post('DeviceClassification/deleteById', p)
export const apiAddDeviceClassification = p => get('DeviceClassification/addDeviceClassification', p)
