import { post } from '@/request/http'

export const apiGetDeviceReceivingStandardListByPagination = p => post('DeviceReceivingStandard/getDeviceReceivingStandardByConditionalPaging', p)
export const apiUpdateDeviceReceivingStandard = p => post('DeviceReceivingStandard/updateDeviceReceivingStandard', p)
