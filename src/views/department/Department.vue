<template>
  <div>
    <el-row>
      <el-col :span='3'>
        <el-button type='primary' plain @click='opendepartmentFromDialog(-1)'>添加部门
        </el-button>
      </el-col>
      <el-col :span='6' :offset='14'>
        <el-input
          placeholder='请输入名称'
          v-model='departmentName'
          clearable @change='getDepartmentList' suffix-icon='el-icon-search'>
        </el-input>
      </el-col>
    </el-row>
    <el-table
      :data='departmentList'
      style='width: 100%'>
      <el-table-column
        type='index'
        label='序号' width='200'>
      </el-table-column>
      <el-table-column
        prop='department_name'
        label='名称'
        width='400'>
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
      title="修改部门"
      width="30%"
    >
      <el-form :inline="true" :rules='departmentFormRules' ref="departmentFormRef" :model="departmentForm"
               class="demo-form-inline">
        <el-form-item label="部门名称" prop="departmentName">
          <el-input v-model="departmentForm.departmentName" placeholder="部门名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="ondepartmentSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  apiGetDepartmentListByPagination,
  apiUpdateDepartment,
  apiDeleteDepartment,
  apiAddDepartment
} from '@/request/api/department'

export default {
  name: 'Department',
  data () {
    return {
      departmentList: [],
      departmentFormTitle: '',
      pageSize: 10,
      currentPage: 1,
      departmentName: '',
      total: 0,
      dialogVisible: false,
      departmentForm: {
        departmentName: '',
        departmentId: 0
      },
      // 表单验证规则
      departmentFormRules: {
        // 部门名验证规则
        departmentName: [
          {
            required: true,
            message: '请输入部门名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    getDepartmentList () {
      apiGetDepartmentListByPagination({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        department_name: this.departmentName
      }).then(res => {
        // 将返回的部门数组存储
        this.departmentList = res.data.data
        // 将返回的总数存储
        this.total = res.data.total
      })
    },
    handleEdit (row) {
      this.dialogVisible = true
      this.departmentForm.departmentId = row.department_id
      this.departmentForm.departmentName = row.department_name
    },
    opendepartmentFromDialog () {
      this.dialogVisible = true
      this.departmentForm.departmentName = ''
      this.departmentForm.departmentId = 0
    },
    ondepartmentSubmit () {
      // 保存this
      const that = this
      // 初始化状态值
      let valid = false
      // 表单验证
      that.$refs.departmentFormRef.validate(v => {
        // 将验证结果保存
        valid = v
      })
      // 判断验证是否成功
      if (!valid) {
        this.$message.error('请输入正确内容')
        return
      }
      if (this.departmentForm.departmentId === 0) {
        apiAddDepartment({
          department_name: this.departmentForm.departmentName
        }).then(res => {
          this.$message.success(res.msg)
          this.dialogVisible = false
          this.getDepartmentList()
        })
      } else {
        apiUpdateDepartment({
          department_id: this.departmentForm.departmentId,
          department_name: this.departmentForm.departmentName
        }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.getDepartmentList()
          }
        })
      }
    },
    handleDelete (row) {
      this.$confirm('是否删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(_ => {
        apiDeleteDepartment({
          department_id: row.department_id
        }).then(res => {
          this.$message.success(res.msg)
          this.getDepartmentList()
        })
      })
    },
    changeCurrentPage (newPage) {
      this.currentPage = newPage
      this.getDepartmentList()
    }
  },
  created () {
    this.getDepartmentList()
  }
}
</script>

<style scoped>

</style>
