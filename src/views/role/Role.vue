<template>
  <div>
    <el-row>
      <el-col :span='3'>
        <el-button type='primary' plain @click='openRoleFromDialog(-1)'>添加角色
        </el-button>
      </el-col>
      <el-col :span='6' :offset='14'>
        <el-input
          placeholder='请输入名称'
          v-model='roleName'
          clearable @change='getRoleList' suffix-icon='el-icon-search'>
        </el-input>
      </el-col>
    </el-row>
    <el-table
      :data='roleList'
      style='width: 100%'>
      <el-table-column
        type='index'
        label='序号' width='200'>
      </el-table-column>
      <el-table-column
        prop='role_name'
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
      title="修改角色"
      width="30%"
    >
      <el-form :inline="true" :rules='roleFormRules' ref="roleFormRef" :model="roleForm" class="demo-form-inline">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onRoleSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>
import { apiGetRoleListByPagination, apiUpdateRole, apiDeleteRole, apiAddRole } from '@/request/api/role'

export default {
  name: 'Role',
  data () {
    return {
      roleList: [],
      roleFormTitle: '',
      pageSize: 10,
      currentPage: 1,
      roleName: '',
      total: 0,
      dialogVisible: false,
      roleForm: {
        roleName: '',
        roleId: 0
      },
      // 表单验证规则
      roleFormRules: {
        // 角色名验证规则
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
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
    getRoleList () {
      apiGetRoleListByPagination({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        role_name: this.roleName
      }).then(res => {
        // 将返回的角色数组存储
        this.roleList = res.data.data
        // 将返回的总数存储
        this.total = res.data.total
      })
    },
    handleEdit (row) {
      this.dialogVisible = true
      this.roleFormTitle = '修改角色'
      this.roleForm.roleId = row.role_id
      this.roleForm.roleName = row.role_name
    },
    openRoleFromDialog () {
      this.dialogVisible = true
      this.roleFormTitle = '添加角色'
      this.roleForm.roleName = ''
      this.roleForm.roleId = 0
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
      if (this.roleForm.roleId === 0) {
        apiAddRole({
          role_name: this.roleForm.roleName
        }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.getRoleList()
          } else {
            this.$message.success(res.msg)
          }
        })
      } else {
        apiUpdateRole({
          role_id: this.roleForm.roleId,
          role_name: this.roleForm.roleName
        }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.getRoleList()
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
        apiDeleteRole({
          role_id: row.role_id
        }).then(res => {
          this.$message.success(res.msg)
          this.getRoleList()
        })
      })
    },
    changeCurrentPage (newPage) {
      this.currentPage = newPage
      this.getRoleList()
    }
  },
  created () {
    // 执行获取角色数据
    this.getRoleList()
  }
}
</script>

<style scoped>

</style>
