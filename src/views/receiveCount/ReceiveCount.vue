<template>
  <el-row>
    <el-col>
      <h1 style="font-size: 25px">科室领取统计</h1>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span='4'>
      <el-select :disabled="deviceNameId" v-model="administrative_office_id" placeholder="请选择科室" filterable @change="getAdData">
        <el-option v-for="item in depList" :key="item.administrative_office_id"
                   :label="item.administrative_office_name"
                   :value="item.administrative_office_id"></el-option>
      </el-select>
    </el-col>
    <el-col :span='4' :offset='1'>
      <el-select :disabled="administrative_office_id" :span='5' v-model="deviceNameId" placeholder="请选择器械名称" filterable @change="getCharts">
        <el-option v-for="item in deviceList" :key="item.device_name_id"
                   :label="item.device_name_name"
                   :value="item.device_name_id"></el-option>
      </el-select>
    </el-col>
    <el-col :span='2' :offset='1'>
      <el-button @click='getCharts' type="primary">查询</el-button>
    </el-col>
  </el-row>
  <div class="charts">
    <div v-for="item in showList" :key="item.id">
      <div class="charts-item" style="width: 400px;height: 400px;margin-top: 15px;margin-right: 20px"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { apiGetReceiveAll } from '@/request/api/receive'
import { apiGetDepartAll } from '@/request/api/administrativeOffice'

export default {
  name: 'ReceiveCount',
  data () {
    return {
      depList: [],
      depDataList: [],
      administrative_office_id: null,
      deviceNameId: null,
      deviceNameList: [],
      deviceList: [],
      showList: []
    }
  },
  methods: {
    getAdData (res) {
      this.administrative_office_id = res
      this.deviceNameId = null
      this.getChartsDataDep(this.deviceNameList, res)
    },
    // 获取初始数据
    async getData () {
      apiGetDepartAll().then(res => {
        this.depList = res.data
        this.depList.forEach(item => {
          this.depDataList.push(item.administrative_office_name)
        })
        this.getDeviceList()
      })
    },
    // 获取所有器械列表
    async getDeviceList () {
      this.deviceNameList = []
      await apiGetReceiveAll().then(async result => {
        for (let i = 0; i < result.data.length; i++) {
          if (this.deviceNameList.find(item => item.device_name_name === result.data[i].device_name_name)) {
            continue
          } else {
            this.deviceNameList.push(result.data[i])
            this.deviceList.push(result.data[i])
          }
        }
      })
      await this.getCharts()
    },
    // 选择科室绘画科室科室领取器械图
    async getChartsDataDep (list, dep) {
      this.showList = []
      const obj = {}
      obj.arr = []
      const depItem = this.depList.find(item => item.administrative_office_id === dep)
      let flag = 0
      await new Promise((resolve, reject) => {
        list.forEach(async (item) => {
          let count = 0
          await apiGetReceiveAll().then(res => {
            res.data.forEach(newItem => {
              if (newItem.administrative_office_id === item.administrative_office_id) {
                count = count + 1
              }
            })
            obj.name = depItem.administrative_office_name
            obj.id = depItem.administrative_office_id
            obj.arr.push({
              name: item.device_name_name,
              count
            })
            flag++
            if (flag === list.length) {
              resolve()
            }
          })
        })
      })
      this.showList.push(obj)
      this.drawing()
    },
    // 绘画所有器械被所有科室领取的统计图
    async getChartsData (list, device) {
      this.showList = []
      const obj = {}
      obj.arr = []
      let flag = 0
      const dev = this.deviceNameList.find(item => item.device_name_id === device)
      // eslint-disable-next-line no-new
      await new Promise((resolve, reject) => {
        list.forEach(async (item) => {
          let count = 0
          apiGetReceiveAll().then(res => {
            res.data.forEach(newItem => {
              if (newItem.device_name_name === dev.device_name_name && newItem.administrative_office_id === item.administrative_office_id) {
                count = count + 1
              }
            })
            obj.name = dev.device_name_name
            obj.id = dev.device_name_id
            obj.arr.push({
              name: item.administrative_office_name,
              count
            })
            flag++
            if (flag === list.length) {
              resolve()
            }
          })
        })
      })
      this.showList.push(obj)
      this.drawing()
    },
    // 根据选择的不同，筛选出绘画的数据
    async getCharts () {
      if (this.deviceNameId) {
        this.deviceNameList = this.deviceNameList.filter(item => {
          return item.device_name_id === this.deviceNameId
        })
        this.showList.push(this.getChartsData(this.depList, this.deviceNameId))
        this.drawing()
      } else if (this.administrative_office_id) {
        this.deviceNameList = this.deviceNameList.filter(item => {
          return item.administrative_office_id === this.administrative_office_id
        })
        await this.getChartsDataDep(this.deviceNameList, this.administrative_office_id)
      } else {
        this.deviceNameList.forEach(item => {
          this.showList.push(this.getChartsData(this.depList, item.device_name_id))
        })
        this.drawing()
      }
    },
    // 绘画统计图
    drawing () {
      setTimeout(() => {
        this.$nextTick(async () => {
          await this.draw(this.showList)
        })
      }, 10)
    },
    // 根据获取的数据绘画统计图
    draw (list) {
      const newPromise = new Promise((resolve) => {
        resolve()
      })

      // 然后异步执行echarts的初始化函数
      newPromise.then(() => {
        setTimeout(() => {
          const doms = document.querySelectorAll('.charts-item')
          for (let i = 0; i < list.length; i++) {
            const dataX = list[i].arr.map(it => it.name)
            const dataY = list[i].arr.map(it => it.count)
            // list.forEach(item => {
            // 基于准备好的dom，初始化echarts实例document.getElementById(this.showList[i].id)
            const chart = echarts.init(doms[i])
            // 绘制图表
            chart.setOption({
              title: {
                text: list[i].name
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
          }
        }, 100)
      })
    }
  },
  created () {
    this.getData()
  },
  mounted () {
    this.draw(this.showList)
  }
}
</script>

<style scoped>
.charts {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.chart {
  width: 400px;
  height: 400px;
  margin-top: 15px;
  margin-right: 20px;
}
</style>
