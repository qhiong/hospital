import { post, get } from '@/request/http'

export const apiGetDepartments = p => post('Department/getAll', p)
export const apiGetDepartmentListByPagination = p => post('Department/getDepartmentByConditionalPaging', p)
export const apiUpdateDepartment = p => post('Department/updateById', p)
export const apiDeleteDepartment = p => post('Department/deleteById', p)
export const apiAddDepartment = p => get('Department/addDepartment', p)
