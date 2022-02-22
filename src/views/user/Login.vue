<template>
  <div class='loginDiv'>
    <div class='circular'></div>
    <h4>欢迎使用</h4>
    <h3>平昌医院器械管理系统</h3>
    <el-form :model='loginForm' :rules='loginRules' ref='loginRuleForm' label-width='100px' class='demo-ruleForm'>
      <el-form-item prop='userJobNumber' label-width='0'>
        <el-input v-model='loginForm.user_number' placeholder='请输入用户名'></el-input>
      </el-form-item>
      <el-form-item prop='userPassword' label-width='0'>
        <el-input type='password' v-model='loginForm.user_password'
                  placeholder='请输入密码' show-password @keypress='doLogin'>
        </el-input>
      </el-form-item>
      <el-form-item label-width='0'>
        <el-button class='submit' type='primary' @click='loginSubmit'>登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// @ is an alias to /src
import { apiLogin } from '@/request/api/user'
import router from '@/router'
import { apiAddJournal } from '@/request/api/journal'
// 引入路由组件
// import router from '@/router'

export default {
  name: 'Login',
  data () {
    return {
      // 登录表单数据
      loginForm: {
        // 登陆用户名
        user_number: '',
        // 登陆密码
        user_password: ''
      },
      // 表单验证对象
      loginRules: {
        // 用户名
        user_number: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 10,
            message: '长度在 5 到 10 个字符',
            trigger: 'blur'
          }
        ],
        // 密码
        user_password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 10,
            message: '长度在 6 到 8 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 登陆表单提交
    loginSubmit () {
      const that = this
      // 验证表单数据
      this.$refs.loginRuleForm.validate(valid => {
        if (!valid) {
          that.$message.error('请输入正确内容')
          return
        }
        // 验证成功发送请求
        apiLogin(that.loginForm).then(res => {
          // 跳转到主页面
          // router.push('/home')
          console.log(res)
          if (res.code === 200) {
            // 在本地存储令牌
            localStorage.setItem('token', res.data.role_id)
            localStorage.setItem('login', res.data.user_id)
            if (res.data.user_state) {
              if (res.code === 200) {
                this.$message.success(res.msg)
                apiAddJournal({
                  user_id: res.data.user_id,
                  journal_content: `${res.data.user_name}登录`
                }).then(res => {
                  console.log(res)
                })
                router.push('/index')
              } else {
                this.$message.error(res.msg)
              }
            } else {
              this.$message.error('已禁用')
            }
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    },
    // 密码框按键事件
    doLogin (e) {
      // 获取按键码
      const keyCode = e.keyCode
      // 判断是否是回车
      if (keyCode === 13) {
        // 执行登陆
        this.loginSubmit()
      }
    }
  },
  created () {
  }
}
</script>
<style lang='less' scoped>

.loginDiv {
  width: 400px;
  height: 400px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  box-shadow: 20px 40px 60px #C5C7C7;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  background-color: #fff;
  padding: 0 30px 30px 30px;

  .circular {
    width: 150px;
    height: 75px;
    border-radius: 150px 150px 0 0;
    box-shadow: 2px -5px 10px #F1F3F3;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -100%);
    background-color: #fff;
  }

  .el-button {
    width: 100%;
    margin: 5px 0;
  }

}

h4 {
  color: #00BFFF;
  font-size: 24px;
  margin: 30px 0;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

h3 {
  color: #00BFFF;
  font-size: 30px;
  margin: 0 0 40px 0;
  font-family: "PingFang SC";
  letter-spacing: 7px;
}
</style>
