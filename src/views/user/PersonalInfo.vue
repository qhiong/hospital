<template>
  <h2>账号信息</h2>
  <el-form ref='form' :model='information' label-width='80px'>
    <el-form-item label='用户名'>
      <el-input :disabled='true' v-model='information.user.user_number'></el-input>
    </el-form-item>
    <el-form-item label='密码'>
      <el-input :disabled='true' v-model='information.user.user_password'></el-input>
      <el-button type='info' plain @click='updatePasswordForm.isUpdatePasswordDialog = true'>修改密码</el-button>
    </el-form-item>
    <el-form-item label='姓名'>
      <el-input :disabled='true' v-model='information.user.user_name'></el-input>
    </el-form-item>
    <el-form-item label='角色'>
      <el-input :disabled='true' v-model='information.role.role_name'></el-input>
    </el-form-item>
    <el-form-item label='科室'>
      <el-input :disabled='true' v-model='information.administrativeOffice.administrative_office_name'></el-input>
    </el-form-item>
    <el-form-item label='身份证'>
      <el-input :disabled='true' v-model='information.user.user_id_card'></el-input>
    </el-form-item>
    <el-form-item label='电话'>
      <el-input :disabled='true' v-model='information.user.user_phone'></el-input>
    </el-form-item>
    <el-form-item label='邮箱'>
      <el-input :disabled='true' v-model='information.user.user_email'></el-input>
      <el-button type='info' plain @click='updateEmailForm.isUpdateEmailDialog = true' v-if="false">修改邮箱</el-button>
    </el-form-item>
  </el-form>
  <el-dialog
    title='修改密码'
    v-model='updatePasswordForm.isUpdatePasswordDialog'
    width='30%'
    @close='resetForm'>
    <el-form :model='updatePasswordForm' :rules='updatePasswordRules' ref='updatePasswordRef' label-width='100px'
             class='demo-ruleForm'>
      <el-form-item label='旧密码' prop='oldPassword'>
        <el-input type='password' v-model='updatePasswordForm.oldPassword'></el-input>
      </el-form-item>
      <el-form-item label='新密码' prop='newPassword1'>
        <el-input type='password' v-model='updatePasswordForm.newPassword1'></el-input>
      </el-form-item>
      <el-form-item label='确认密码' prop='newPassword2'>
        <el-input type='password' v-model='updatePasswordForm.newPassword2'></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
    <span class='dialog-footer'>
      <el-button @click='resetForm'>取 消</el-button>
      <el-button type='primary' @click='submitUpdatePassword'>确 定</el-button>
    </span>
    </template>
  </el-dialog>
  <el-dialog
    title='修改邮箱'
    v-model='updateEmailForm.isUpdateEmailDialog'
    width='30%'
    @close='resetForm'>
    <el-steps :active='updateEmailForm.active' finish-status='success'>
      <el-step title='步骤 1'></el-step>
      <el-step title='步骤 2'></el-step>
      <el-step title='步骤 3'></el-step>
      <el-step title='步骤 4'></el-step>
    </el-steps>
    <div v-show='updateEmailForm.active == 0'>
      <p>你正在进行敏感操作, 继续操作前请验证您的身份</p>
      <div class='demo-input-suffix'>
        密码验证：
        <el-input
          placeholder='请输入密码'
          v-model='updateEmailForm.password' type='password'>
        </el-input>
      </div>
    </div>
    <div v-show='updateEmailForm.active == 1'>
      <p>你正在进行敏感操作, 继续操作前请验证您的身份</p>
      <div class='demo-input-suffix'>
        <p>
          邮箱验证:
        </p>
        <el-row>
          <el-col :span='17'>
            <el-input
              placeholder='请输入验证码'
              v-model='updateEmailForm.verificationCode'>
            </el-input>
          </el-col>
          <el-col :span='4'>
            <el-button type='warning' plain @click='sendVerificationCode'
                       v-text='updateEmailForm.captchaButton'></el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div v-show='updateEmailForm.active == 2'>
      <div class='demo-input-suffix'>
        新邮箱:
        <el-input
          placeholder='请输入邮箱'
          v-model='updateEmailForm.email'>
        </el-input>
      </div>
    </div>
    <div v-show='updateEmailForm.active == 3'>
      <div class='demo-input-suffix'>
        <el-input
          placeholder='请输入验证码'
          v-model='updateEmailForm.verificationCode'>
        </el-input>
      </div>
    </div>
    <template #footer>
    <span class='dialog-footer'>
      <el-button type='danger' @click='next'>下一步</el-button>
    </span>
    </template>
  </el-dialog>
</template>

<script>
import { apiGetAllUser, apiUpdatePassword } from '@/request/api/user'
import { apiGetRoles } from '@/request/api/role'
import { apiGetDepartAll } from '@/request/api/administrativeOffice'

export default {
  name: 'PersonalInfo',
  data () {
    return {
      information: {
        user: {},
        role: {},
        administrativeOffice: {}
      },
      updatePasswordForm: {
        // 是否显示修改密码对话框
        isUpdatePasswordDialog: false,
        // 旧密码
        oldPassword: '',
        // 新密码
        newPassword1: '',
        // 确认密码
        newPassword2: ''
      },
      // 修改邮箱表单
      updateEmailForm: {
        // 是否显示修改邮箱对话框
        isUpdateEmailDialog: false,
        // 邮箱地址
        email: '',
        // 验证码
        verificationCode: '',
        // 步骤条进度
        active: 0,
        // 验证密码
        password: '',
        // 按钮是否可用
        captchaButtonState: false,
        // 按钮文字
        captchaButton: '发送验证码'
      },
      // 表单验证对象
      updatePasswordRules: {
        // 原密码
        oldPassword: [
          {
            required: true,
            message: '请输入原密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ],
        // 新密码
        newPassword1: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ],
        // 确认密码
        newPassword2: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 获取当前登陆者信息
    getLoginInformation () {
      // 执行获取信息
      apiGetAllUser().then(res => {
        // 将返回信息中基本信息保存
        this.information.user = res.data.find(item => item.user_id === Number(localStorage.getItem('login')))
        this.information.user.user_password = '******'
      })
      apiGetRoles().then(res => {
        this.information.role = res.data.find(item => item.role_id === Number(localStorage.getItem('token')))
      })
      apiGetDepartAll().then(res => {
        const ao = res.data.find(item => item.user_id === Number(localStorage.getItem('login')))
        this.information.administrativeOffice = ao || ''
      })
    },
    resetForm () {
      this.updatePasswordForm.isUpdatePasswordDialog = false
      this.updatePasswordForm.oldPassword = ''
      this.updatePasswordForm.newPassword1 = ''
      this.updatePasswordForm.newPassword2 = ''
      this.updateEmailForm.isUpdateEmailDialog = false
      this.updateEmailForm.email = ''
      this.updateEmailForm.verificationCode = ''
      this.updateEmailForm.active = 0
      this.updateEmailForm.password = ''
      this.updateEmailForm.captchaButtonState = false
      this.updateEmailForm.captchaButton = '发送验证码'
    },
    submitUpdatePassword () {
      // 初始化状态值
      let valid = false
      // 表单验证
      this.$refs.updatePasswordRef.validate(v => {
        // 将验证结果保存
        valid = v
      })
      // 判断验证是否成功
      if (!valid) {
        this.$message.error('请输入正确内容')
        return
      }
      if (this.information.user.password !== this.updatePasswordForm.oldPassword) {
        this.$message.error('旧密码不正确')
        return
      }
      // 判断两次密码是否一致
      if (this.updatePasswordForm.newPassword1 !== this.updatePasswordForm.newPassword2) {
        this.$message.error('两次密码不一致')
        return
      }
      // 执行修改密码
      apiUpdatePassword({
        user_id: this.information.user.user_id,
        user_password: this.updatePasswordForm.newPassword1
      }).then(res => {
        // 提示信息
        this.$message.success(res.msg)
        // 跳转到登录页
        this.$router.push('/login')
      })
    },
    next () {

    },
    sendVerificationCode () {

    }
  },
  created () {
    // 获取个人信息
    this.getLoginInformation()
  }
}
</script>

<style lang='less' scoped>
h2 {
  border-bottom: 1px solid #E5E5E5;
  padding-bottom: 3px;
}

.el-input {
  max-width: 400px;
}

.el-button {
  margin-left: 10px;
}

.el-col {
  text-align: left;
}

.el-steps {
  margin-bottom: 20px;
}
</style>
