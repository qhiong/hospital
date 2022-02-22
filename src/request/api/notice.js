import { post, get } from '@/request/http'

export const apiGetNotices = p => post('Notice/getAnnouncementsValidAtTheCurrentTime', p)
export const apiGetNoticeListByPagination = p => post('Notice/getNoticeByConditionalPaging', p)
export const apiUpdateNotice = p => post('Notice/updateById', p)
export const apiDeleteNotice = p => post('Notice/deleteById', p)
export const apiAddNotice = p => get('Notice/addNotice', p)
