import { post, get } from '@/request/http'

export const apiGetRoles = p => post('role/getAll', p)
export const apiGetRoleListByPagination = p => post('role/getRoleByConditionalPaging', p)
export const apiUpdateRole = p => post('role/updateById', p)
export const apiDeleteRole = p => post('role/deleteById', p)
export const apiAddRole = p => get('role/addRole', p)
