<template>
  <div>
    <el-row>
      <el-col :span='3'>
        <el-button type='primary' plain @click='openDepartFromDialog(-1)'>添加科室
        </el-button>
      </el-col>
      <el-col :span='6' :offset='14'>
        <el-input
          placeholder='请输入名称'
          v-model='administrativeOfficeName'
          clearable @change='getAdministrativeOfficeList' suffix-icon='el-icon-search'>
        </el-input>
      </el-col>
    </el-row>
    <el-table
      :data='administrativeOfficeList'
      style='width: 100%'>
      <el-table-column
        type='index'
        label='序号' width='200'>
      </el-table-column>
      <el-table-column
        prop='administrative_office_name'
        label='名称'
        width='400'>
      </el-table-column>
      <el-table-column
        prop='user_name'
        label='管理员'
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
      :title="departFormTitle"
      width="30%"
    >
      <el-form :inline="true" :rules='departFormRules' ref="roleFormRef" :model="departForm" class="demo-form-inline">
        <el-form-item label="科室名称" prop="administrativeOfficeName">
          <el-input v-model="departForm.administrativeOfficeName" placeholder="科室名称"></el-input>
        </el-form-item>
        <el-form-item label="科室管理员" prop="userId">
          <el-select v-model="departForm.userId" placeholder="请选择角色" filterable>
            <el-option v-for="item in userDepList" :key="item.user_id" :label="item.user_name"
                       :value="item.user_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onRoleSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { apiGetDepartListByPagination, apiAddDepart, apiUpdateDepart, apiDeleteDepart } from '@/request/api/administrativeOffice'
import { apiGetAllUser } from '@/request/api/user'

export default {
  name: 'department',
  data () {
    return {
      administrativeOfficeList: [],
      departFormTitle: '',
      pageSize: 10,
      currentPage: 1,
      administrativeOfficeName: '',
      total: 0,
      dialogVisible: false,
      departForm: {
        administrativeOfficeId: 0,
        administrativeOfficeName: '',
        userId: 0,
        userName: ''
      },
      userDepList: [],
      // 表单验证规则
      departFormRules: {
        // 角色名验证规则
        administrativeOfficeName: [
          {
            required: true,
            message: '请输入科室名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        userId: [
          {
            required: true,
            message: '请选择管理人',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    getAdministrativeOfficeList () {
      apiGetDepartListByPagination({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        administrative_office_name: this.administrativeOfficeName
      }).then(res => {
        this.administrativeOfficeList = res.data.data
        this.total = res.data.total
      })
      apiGetAllUser({}).then(res => {
        this.userDepList = res.data.filter(item => item.role_id === 2)
      })
    },
    openDepartFromDialog () {
      this.dialogVisible = true
      this.departFormTitle = '添加科室'
      this.clearForm()
    },
    clearForm () {
      this.departForm.administrativeOfficeName = ''
      this.departForm.userId = 0
      this.administrativeOfficeId = 0
    },
    handleEdit (row) {
      this.dialogVisible = true
      this.departFormTitle = '修改科室'
      this.departForm.userId = row.user_id
      this.departForm.administrativeOfficeId = row.administrative_office_id
      this.departForm.administrativeOfficeName = row.administrative_office_name
    },
    handleDelete (row) {
      this.$confirm('是否删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(_ => {
        apiDeleteDepart({
          administrative_office_id: row.administrative_office_id
        }).then(res => {
          this.$message.success(res.msg)
          this.getAdministrativeOfficeList()
        })
      })
    },
    onRoleSubmit () {
      // 保存this
      const that = this
      // 初始化状态值
      let valid = false
      // 表单验证
      that.$refs.roleFormRef.validate(v => {
        // 将验证结果保存
        valid = v
      })
      // 判断验证是否成功
      if (!valid) {
        this.$message.error('请输入正确内容')
        return
      }
      if (this.departForm.administrativeOfficeId === 0) {
        apiAddDepart({
          administrative_office_name: this.departForm.administrativeOfficeName,
          user_id: this.departForm.userId
        }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.getAdministrativeOfficeList()
          }
        })
      } else {
        apiUpdateDepart({
          administrative_office_name: this.departForm.administrativeOfficeName,
          administrative_office_id: this.departForm.administrativeOfficeId,
          user_id: this.departForm.userId
        }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.getAdministrativeOfficeList()
          }
        })
      }
    },
    changeCurrentPage (newPage) {
      this.currentPage = newPage
      this.getAdministrativeOfficeList()
    }
  },
  created () {
    this.getAdministrativeOfficeList()
  }
}
</script>

<style scoped>

</style>
