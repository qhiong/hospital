<template>
  <el-row>
    <el-col :span='4'>
      <el-select :disabled="deviceNameId" v-model="departmentId" placeholder="请选择部门" filterable>
        <el-option v-for="item in depList" :key="item.department_id"
                   :label="item.department_name"
                   :value="item.department_id"></el-option>
      </el-select>
    </el-col>
    <el-col :span='4' :offset='1'>
      <el-select :disabled="departmentId" :span='5' v-model="deviceNameId" placeholder="请选择器械名称" filterable>
        <el-option v-for="item in deviceNameList" :key="item.device_name_id"
                   :label="item.device_name_name"
                   :value="item.device_name_id"></el-option>
      </el-select>
    </el-col>
    <el-col :span='2' :offset='1'>
      <el-button @click='getCharts' type="primary">查询</el-button>
    </el-col>
  </el-row>
  <div class="charts">
    <div v-for="item in list" :key="item.id">
      <div class="charts-item" style="width: 400px;height: 400px;margin-top: 15px;margin-right: 20px"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { apiGetDepartments } from '@/request/api/department.js'
import { apiGetReceiveAll } from '@/request/api/receive'
import { apiGetAllUser } from '@/request/api/user'
import { apiGetDepartAll } from '@/request/api/administrativeOffice'

export default {
  name: 'InterCount',
  data () {
    return {
      depList: [],
      depDataList: [],
      departmentId: null,
      deviceNameId: null,
      deviceNameList: [],
      list: []
    }
  },
  methods: {
    async getData () {
      apiGetDepartments().then(res => {
        this.depList = res.data
        this.depList.forEach(item => {
          this.depDataList.push(item.department_name)
        })
      })
      this.deviceNameList = []
      await apiGetReceiveAll().then(async result => {
        for (let i = 0; i < result.data.length; i++) {
          if (result.data[i].administrative_office_id === await this.getOfficeId()) {
            if (this.deviceNameList.find(item => item.device_name_name === result.data[i].device_name_name)) {
              continue
            } else {
              this.deviceNameList.push(result.data[i])
            }
          }
        }
        this.getShowList()
      })
      this.getCharts()
    },
    getCharts () {
      let list = this.list
      if (this.departmentId) {
        this.list = []
        list = this.deviceNameList.filter(item => (item.department_id === this.departmentId)).map(it => {
          const obj = {}
          let count = 0
          const nowDep = this.depList.find(is => is.department_id === it.department_id)
          obj.name = nowDep.department_name
          obj.id = nowDep.department_id
          obj.arr = []
          this.deviceNameList.forEach(items => {
            this.depList.forEach(itt => {
              if (items.department_id === itt.department_id) {
                count = count + 1
              }
            })
            obj.arr.push({
              count,
              name: items.device_name_name
            })
          })
          return obj
        })
        this.list = list
      } else if (this.deviceNameId) {
        this.list = []
        list = this.deviceNameList.filter(item => (item.device_name_id === this.deviceNameId)).map(it => {
          const obj = {}
          let count = 0
          obj.name = it.device_name_name
          obj.id = it.device_name_id
          obj.arr = []
          this.depList.forEach(items => {
            this.deviceNameList.forEach(itt => {
              if (items.department_id === itt.department_id) {
                count = count + 1
              }
            })
            obj.arr.push({
              count,
              name: items.department_name
            })
          })
          return obj
        })
        this.list = list
      } else {
        this.getShowList()
      }
      this.drawing(list)
    },
    getShowList () {
      const list = this.deviceNameList.map(it => {
        const obj = {}
        let count = 0
        obj.name = it.device_name_name
        obj.id = it.device_name_id
        obj.arr = []
        this.depList.forEach(items => {
          this.deviceNameList.forEach(itt => {
            if (items.department_id === itt.department_id) {
              count = count + 1
            }
          })
          obj.arr.push({
            count,
            name: items.department_name
          })
        })
        return obj
      })
      this.list = list
    },
    drawing (list) {
      const newPromise = new Promise((resolve) => {
        resolve()
      })

      // 然后异步执行echarts的初始化函数
      newPromise.then(() => {
        setTimeout(() => {
          list.forEach((item, index) => {
            const doms = document.querySelectorAll('.charts-item')
            const dataX = item.arr.map(ite => ite.name)
            const dataY = item.arr.map(ites => ites.count)
            // 基于准备好的dom，初始化echarts实例
            const myChart = echarts.init(doms[index])
            // 绘制图表
            myChart.setOption({
              title: {
                text: item.name
              },
              tooltip: {},
              xAxis: {
                data: dataX
              },
              yAxis: {},
              series: [
                {
                  name: '领取',
                  type: 'bar',
                  data: dataY
                }
              ]
            })
          })
        }, 100)
      })
    },
    async getOfficeId () {
      let administrativeOfficeId = null
      const id = Number(localStorage.getItem('login'))
      await apiGetAllUser().then(async res => {
        const user = res.data.find(item => item.user_id === id)
        await apiGetDepartAll().then(res => {
          administrativeOfficeId = (res.data.find(t => t.user_id === user.user_id)).administrative_office_id
        })
      })
      return administrativeOfficeId
    }
  },
  created () {
    this.getData()
  },
  mounted () {
    this.drawing(this.list)
  }
}
</script>

<style scoped>
.charts {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
</style>
