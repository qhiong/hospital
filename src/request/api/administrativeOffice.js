import { post, get } from '@/request/http'

export const apiGetDepartAll = p => post('AdministrativeOffice/getAll', p)
export const apiGetDepartListByPagination = p => post('AdministrativeOffice/getAdministrativeOfficeByConditionalPaging', p)
export const apiUpdateDepart = p => post('AdministrativeOffice/updateById', p)
export const apiDeleteDepart = p => post('AdministrativeOffice/deleteById', p)
export const apiAddDepart = p => get('AdministrativeOffice/addAdministrativeOffice', p)
