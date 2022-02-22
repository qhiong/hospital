import { post } from '@/request/http'

export const apiGetSuppliers = p => post('Supplier/getAll', p)
export const apiGetSupplierListByPagination = p => post('Supplier/getSupplierByConditionalPaging', p)
export const apiUpdateSupplier = p => post('Supplier/updateById', p)
export const apiDeleteSupplier = p => post('Supplier/deleteById', p)
export const apiAddSupplier = p => post('Supplier/addSupplier', p)
