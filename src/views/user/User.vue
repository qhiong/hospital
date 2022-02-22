<template>
  <div>
    <el-row>
      <el-col :span="3">
        <el-button type='primary' plain @click='openUserFromDialog(-1)'>添加用户
        </el-button>
      </el-col>
      <el-col :span='6' :offset='14'>
        <el-input
          placeholder='请输入名称'
          v-model='userName'
          clearable @change='getUserList' suffix-icon='el-icon-search'>
        </el-input>
      </el-col>
    </el-row>
    <el-table
      :data='userList'
      style='width: 100%'>
      <el-table-column
        type='index'
        label='序号' width='100'>
      </el-table-column>
      <el-table-column
        prop='user_name'
        label='名称'
        width='200'>
      </el-table-column>
      <el-table-column
        prop='role_name'
        label='角色'
        width='200'>
      </el-table-column>
      <el-table-column
        prop='user_phone'
        label='电话'
        width='200'>
      </el-table-column>
      <el-table-column
        prop='user_email'
        label='邮箱'
        width='200'>
      </el-table-column>
      <el-table-column
        label='状态'
        width='80'>
        <template #default='scope'>
          <el-switch v-model='scope.row.user_state' active-color='#13ce66' inactive-color='#ff4949' :active-value='1'
                     :inactive-value='0' @change='userStateChange(scope.row)'>
          </el-switch>
        </template>
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
          <el-button type='warning' size='mini'
                     @click='initializationPassword(scope.row.user_id)'>初始化密码
          </el-button>
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
      :title="dialogTitle"
      width="30%"
    >
      <el-form :inline="true" :rules='userFormRules' ref="userFormRef" :model="userForm" class="demo-form-inline">
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="userForm.userName" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" v-if="insertBool" prop="userPassword">
          <el-input v-model="userForm.userPassword" placeholder="角色密码" type="password"></el-input>
        </el-form-item>
        <el-form-item label="用户账号" v-if="insertBool" prop="userNumber">
          <el-input v-model="userForm.userNumber" placeholder="角色账号"></el-input>
        </el-form-item>
        <el-form-item label="用户电话" prop="userPhone">
          <el-input v-model="userForm.userPhone" placeholder="用户电话"></el-input>
        </el-form-item>
        <el-form-item label="身份证" prop="userIdCard">
          <el-input v-model="userForm.userIdCard" placeholder="身份证"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="userEmail">
          <el-input v-model="userForm.userEmail" placeholder="用户邮箱"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" prop="roleId">
          <el-select v-model="userForm.roleId" placeholder="请选择角色" filterable>
            <el-option v-for="item in roleList" :key="item.role_id" :label="item.role_name"
                       :value="item.role_id"></el-option>
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
import {
  apiGetUserListByPagination,
  apiUpdateUser,
  apiUpdateUserState,
  apiDeleteUser,
  apiInsertUser,
  apiInitializationPassword
} from '@/request/api/user'
import { apiGetRoles } from '@/request/api/role'

export default {
  name: 'User',
  data () {
    return {
      userList: [],
      pageSize: 10,
      currentPage: 1,
      userName: '',
      userNumber: '',
      total: 0,
      dialogVisible: false,
      insertBool: false,
      dialogTitle: '',
      userForm: {
        userName: '',
        userId: 0,
        userPhone: '',
        userEmail: '',
        userIdCard: '',
        roleId: 0,
        roleName: '',
        userPassword: '',
        userNumber: ''
      },
      roleList: [],
      // 表单验证规则
      userFormRules: {
        // 工号验证规则
        userNumber: [
          {
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 10,
            message: '长度在 5 到 10 个字符',
            trigger: 'blur'
          }
        ],
        // 姓名验证
        userName: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 30,
            message: '长度在 2 到 30 个字符',
            trigger: 'blur'
          }
        ],
        // 学院编号验证
        roleId: [
          {
            required: true,
            message: '请选择角色',
            trigger: 'change'
          }
        ],
        // 身份证验证
        userIdCard: [
          {
            required: true,
            message: '请输入身份证',
            trigger: 'blur'
          },
          {
            min: 18,
            max: 18,
            message: '长度在 18 到 18 个字符',
            trigger: 'blur'
          }
        ],
        // 电话号验证
        userPhone: [
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
        userEmail: [
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
        userPassword: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 30,
            message: '长度在 5 到 30 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    getUserList () {
      apiGetUserListByPagination({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        user_number: this.userNumber,
        user_name: this.userName
      }).then(res => {
        this.userList = res.data.data
        this.total = res.data.total
      })
      this.getRoleAll()
    },
    handleEdit (row) {
      this.dialogTitle = '修改用户'
      this.insertBool = false
      this.dialogVisible = true
      this.userForm.userId = row.user_id
      this.userForm.userName = row.user_name
      this.userForm.userPhone = row.user_phone
      this.userForm.userEmail = row.user_email
      this.userForm.userIdCard = row.user_id_card
      this.userForm.roleId = row.role_id
    },
    getRoleAll () {
      apiGetRoles({}).then(res => {
        this.roleList = res.data
      })
    },
    onRoleSubmit () {
      // 保存this
      const that = this
      // 初始化状态值
      let valids = false
      // 表单验证
      that.$refs.userFormRef.validate(v => {
        // 将验证结果保存
        valids = v
      })
      // 判断验证是否成功
      if (!valids) {
        this.$message.error('请输入正确内容')
        return
      }
      if (this.userForm.userId === 0) {
        apiInsertUser({
          user_name: this.userForm.userName,
          user_number: this.userForm.userNumber,
          user_password: this.userForm.userPassword,
          user_phone: this.userForm.userPhone,
          user_id_card: this.userForm.userIdCard,
          user_email: this.userForm.userEmail,
          role_id: this.userForm.roleId
        }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.getUserList()
          } else {
            this.$message.success(res.msg)
          }
        }).catch(err => {
          this.$message.error(err.msg)
        })
      } else {
        apiUpdateUser({
          user_id: this.userForm.userId,
          user_name: this.userForm.userName,
          user_phone: this.userForm.userPhone,
          user_id_card: this.userForm.userIdCard,
          user_email: this.userForm.userEmail,
          role_id: this.userForm.roleId
        }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.getUserList()
          } else {
            this.$message.success(res.msg)
          }
        }).catch(err => {
          this.$message.error(err.msg)
        })
      }
    },
    userStateChange (row) {
      apiUpdateUserState({
        user_id: row.user_id
      }).then(res => {
        this.$message.success(res.msg)
        this.getUserList()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    openUserFromDialog () {
      this.dialogTitle = '添加用户'
      this.insertBool = true
      this.dialogVisible = true
      this.userForm.userId = 0
      this.userForm.userName = ''
      this.userForm.userPhone = ''
      this.userForm.userEmail = ''
      this.userForm.userIdCard = ''
      this.userForm.roleId = 0
      this.userForm.userNumber = ''
      this.userForm.userPassword = ''
    },
    handleDelete (row) {
      this.$confirm('是否删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(_ => {
        apiDeleteUser({
          user_id: row.user_id
        }).then(res => {
          this.$message.success(res.msg)
          this.getUserList()
        }).catch(err => {
          this.$message.error(err.msg)
        })
      })
    },
    initializationPassword (userId) {
      this.$confirm('确认初始化密码？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(_ => {
        // 执行初始化密码
        apiInitializationPassword({ user_id: userId }).then(res => {
          // 提示信息
          this.$message.success(res.msg)
        })
      })
    },
    changeCurrentPage (newPage) {
      this.currentPage = newPage
      this.getUserList()
    }
  },
  created () {
    this.getUserList()
  }
}
</script>

<style scoped>

</style>
