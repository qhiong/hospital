<template>
  <div>
    <el-row>
      <el-col :span='3'>
        <el-button type='primary' plain @click='opensupplierFromDialog(-1)'>添加供应商
        </el-button>
      </el-col>
      <el-col :span='6' :offset='14'>
        <el-input
          placeholder='请输入名称'
          v-model='supplierName'
          clearable @change='getsupplierList' suffix-icon='el-icon-search'>
        </el-input>
      </el-col>
    </el-row>
    <el-table
      :data='supplierList'
      style='width: 100%'>
      <el-table-column
        type='index'
        label='序号' width='200'>
      </el-table-column>
      <el-table-column
        prop='supplier_name'
        label='名称'
        width='200'>
      </el-table-column>
      <el-table-column
        prop='supplier_phone'
        label='电话'
        width='200'>
      </el-table-column>
      <el-table-column
        prop='supplier_email'
        label='邮箱'
        width='200'>
      </el-table-column>
      <el-table-column
        prop='supplier_address'
        label='地址'
        width='200'>
      </el-table-column>
      <el-table-column
        label='操作'>
        <template #default="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)"
          >修改
          </el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
          >删除
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="changeCurrentPage"
      :page-size="pageSize"
      :pager-count="11"
      layout="prev, pager, next"
      :total="total"
    >
    </el-pagination>
    <el-dialog
      v-model="dialogVisible"
      title="修改供应商"
      width="30%"
    >
      <el-form :inline="true" :rules='supplierFormRules' ref="supplierFormRef" :model="supplierForm"
               class="demo-form-inline">
        <el-form-item label="供应商名称" prop="supplierName">
          <el-input v-model="supplierForm.supplierName" placeholder="供应商名称"></el-input>
        </el-form-item>
        <el-form-item label="供应商电话" prop="supplierPhone">
          <el-input v-model="supplierForm.supplierPhone" placeholder="供应商电话"></el-input>
        </el-form-item>
        <el-form-item label="供应商邮箱" prop="supplierEmail">
          <el-input v-model="supplierForm.supplierEmail" placeholder="供应商邮箱"></el-input>
        </el-form-item>
        <el-form-item label="供应商地址" prop="supplierAddress">
          <el-input v-model="supplierForm.supplierAddress" placeholder="供应商地址"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onsupplierSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>
import {
  apiGetSupplierListByPagination,
  apiUpdateSupplier,
  apiDeleteSupplier,
  apiAddSupplier
} from '@/request/api/supplier'

export default {
  name: 'Supplier',
  data () {
    return {
      supplierList: [],
      supplierFormTitle: '',
      pageSize: 10,
      currentPage: 1,
      supplierName: '',
      supplierAddress: '',
      total: 0,
      dialogVisible: false,
      supplierForm: {
        supplierName: '',
        supplierId: 0,
        supplierAddress: '',
        supplierPhone: '',
        supplierEmail: ''
      },
      // 表单验证规则
      supplierFormRules: {
        // 供应商名验证规则
        supplierName: [
          {
            required: true,
            message: '请输入供应商名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        // 电话号验证
        supplierPhone: [
          {
            required: true,
            message: '请输入电话',
            trigger: 'blur'
          },
          {
            min: 11,
            max: 11,
            message: '长度在 11 个字符',
            trigger: 'blur'
          }
        ],
        // 邮箱验证
        supplierEmail: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 30,
            message: '长度在 5 到 30 个字符',
            trigger: 'blur'
          }
        ],
        supplierAddress: [
          {
            required: true,
            message: '请输入地址',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 40,
            message: '长度在 5 到 40 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    getsupplierList () {
      apiGetSupplierListByPagination({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        supplier_name: this.supplierName,
        supplier_address: this.supplierAddress
      }).then(res => {
        // 将返回的供应商数组存储
        this.supplierList = res.data.data
        // 将返回的总数存储
        this.total = res.data.total
      })
    },
    handleEdit (row) {
      this.dialogVisible = true
      this.supplierForm.supplierId = row.supplier_id
      this.supplierForm.supplierName = row.supplier_name
      this.supplierForm.supplierPhone = row.supplier_phone
      this.supplierForm.supplierEmail = row.supplier_email
      this.supplierForm.supplierAddress = row.supplier_address
    },
    opensupplierFromDialog () {
      this.dialogVisible = true
      this.supplierForm.supplierName = ''
      this.supplierForm.supplierPhone = ''
      this.supplierForm.supplierEmail = ''
      this.supplierForm.supplierAddress = ''
      this.supplierForm.supplierId = 0
    },
    onsupplierSubmit () {
      // 保存this
      const that = this
      // 初始化状态值
      let valid = false
      // 表单验证
      that.$refs.supplierFormRef.validate(v => {
        // 将验证结果保存
        valid = v
      })
      // 判断验证是否成功
      if (!valid) {
        this.$message.error('请输入正确内容')
        return
      }
      if (this.supplierForm.supplierId === 0) {
        apiAddSupplier({
          supplier_name: this.supplierForm.supplierName,
          supplier_phone: this.supplierForm.supplierPhone,
          supplier_address: this.supplierForm.supplierAddress,
          supplier_email: this.supplierForm.supplierEmail
        }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.getsupplierList()
          } else {
            this.$message.success(res.msg)
          }
        })
      } else {
        apiUpdateSupplier({
          supplier_id: this.supplierForm.supplierId,
          supplier_name: this.supplierForm.supplierName,
          supplier_phone: this.supplierForm.supplierPhone,
          supplier_address: this.supplierForm.supplierAddress,
          supplier_email: this.supplierForm.supplierEmail
        }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.getsupplierList()
          } else {
            this.$message.success(res.msg)
          }
        })
      }
    },
    handleDelete (row) {
      this.$confirm('是否删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(_ => {
        apiDeleteSupplier({
          supplier_id: row.supplier_id
        }).then(res => {
          this.$message.success(res.msg)
          this.getsupplierList()
        })
      })
    },
    changeCurrentPage (newPage) {
      this.currentPage = newPage
      this.getsupplierList()
    }
  },
  created () {
    // 执行获取供应商数据
    this.getsupplierList()
  }
}
</script>

<style scoped>

</style>
