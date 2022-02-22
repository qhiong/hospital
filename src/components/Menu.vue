<template>
  <label v-for='menu in menuList' :key="menu.menuId+''">
    <el-sub-menu :index="menu.menuId+''" v-if='getBool(menu)'>
      <template #title>
        <i class='el-icon-location'></i>
        <span>{{ menu.menuName }}</span>
      </template>
      <Menu :menuList='menu.children'></Menu>
    </el-sub-menu>
    <el-menu-item v-else-if="getAuthority(menu)" :route='menu.menuAddress' :index="menu.menuId+''">
      {{ menu.menuName }}
    </el-menu-item>
  </label>
</template>

<script>
export default {
  name: 'Menu',
  // 父子通信
  props: [
    'menuList'
  ],
  methods: {
    getAuthority (menu) {
      if (menu.authority.includes(localStorage.getItem('token'))) {
        if (menu.children && menu.children.length > 0) {
          menu.children.forEach(item => {
            return item === menu.menuId
          })
        } else if (menu.children && menu.children.length === 0) {
          return true
        } else if (!menu.children) {
          return true
        }
      }
    },
    getBool (menu) {
      if (menu.authority.includes(localStorage.getItem('token'))) {
        if (menu.children && menu.children.length > 0) {
          return menu.children.length > 0
        } else {
          return false
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
