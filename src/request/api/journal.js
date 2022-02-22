import { post, get } from '@/request/http'

export const apiAddJournal = p => get('Journal/addJournal', p)
export const apiGetJournalListByPagination = p => post('Journal/getJournalByConditionalPaging', p)
