import { post, get } from '@/request/http'

export const apiLogin = p => post('user/doLogin', p)
export const apiGetUserListByPagination = p => get('user/getUserByConditionalPaging', p)
export const apiUpdateUser = p => get('user/updateUserById', p)
export const apiGetAllUser = p => get('user/getAll', p)
export const apiUpdateUserState = p => get('user/updataStateById', p)
export const apiDeleteUser = p => get('user/deleteById', p)
export const apiInsertUser = p => get('user/addUser', p)
export const apiInitializationPassword = p => get('user/initializationPassword', p)
export const apiUpdatePassword = p => get('user/updatePassword', p)
