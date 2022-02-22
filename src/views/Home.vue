<template>
  <el-container>
    <el-header>
      <h3>平昌医院器械管理系统<a title='折叠' @click='isCollapse = !isCollapse'><i class='iconfont iconzhedie'></i></a>
      </h3>
      <div class='dis_flex'>
        <el-menu text-color='#fff' class='el-menu-demo' mode='horizontal' background-color='#032121'
                 active-text-color='#fff'>
          <el-submenu index='1'>
            <template #title>
              <el-avatar
                :src='infoImgPath'
              ></el-avatar>
            </template>
            <el-menu-item index='1-1' @click='personalInformation'>个人信息</el-menu-item>
            <el-menu-item index='1-2' @click='signOut'>退出</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse?'0px': '210px'">
        <el-menu @select='handleMenuSelect' router class='el-menu-vertical-demo' :collapse='isCollapse'
                 text-color='#AAA9B0'
                 :collapse-transition='false' unique-opened>
          <Menu :menuList='menuList'></Menu>
        </el-menu>
      </el-aside>
      <el-main>
        <div class='layout'>
          <router-view/>
        </div>
      </el-main>
    </el-container>
  </el-container>

</template>
<script>
// 引入路由
import router from '@/router'
// 引入菜单组件
import Menu from '@/components/Menu'
// 菜单
import Data from '@/assets/json/menu'

export default {
  name: 'index',
  components: {
    Menu
  },
  data () {
    return {
      // 查看菜单是否折叠状态
      isCollapse: false,
      // 菜单数组
      menuList: [],
      // 面包屑内容数组
      crumbs: ['角色管理', '查看']
    }
  },
  methods: {
    // 退出登陆
    signOut () {
      // 弹出是否要退出对话框
      this.$confirm('确认退出？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(_ => {
        // 确认后删除本地存储的令牌
        localStorage.removeItem('token')
        // 跳转到登陆页
        router.push('/login')
      })
    },
    personalInformation () {
      // 跳转
      this.$router.push('/PersonalInfo')
    },
    handleMenuSelect () {

    }
  },
  created () {
    // 执行获取菜单方法
    this.menuList = Data
    // 刷新页面时
    const crumbs = window.sessionStorage.getItem('crumbs')
    if (crumbs !== null && crumbs !== '') {
      this.crumbs = JSON.parse(crumbs)
    }
  },
  // 传值
  provide () {
    return {
      crumbs: () => this.crumbs()
    }
  }
}
</script>
<style lang='less' scoped>
html {
  height: 100%;
}

.el-header {
  display: flex;
  justify-content: space-between;
  width: 100%;

  a {
    margin-left: 10px;
  }

}

.el-aside {
  overflow-y: auto;
  overflow-x: hidden;
}

.el-menu {
  text-align: left;
  border: none;
  height: 100%;
}

.el-main {
  background-color: #E9ECF3;
  padding: 20px;
}

.iconzhedie {
  margin: 0 auto;
  width: 10px;
  margin: 10px 0;
}

.el-container {
  height: 100%;
}

.el-main {
  text-align: left;
  height: 1020px;
}

.layout {
  background-color: #fff;
  padding: 10px;
}

.item {
  margin-top: 10px;
  margin-right: 40px;
}

.dis_flex {
  display: flex;
}
</style>
