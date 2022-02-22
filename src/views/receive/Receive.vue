<template>
  <el-row>
    <el-col :span='4' :offset='1'>
      <el-select v-model="deviceClassificationId" @change="selectClassification" placeholder="请选择所属分类" filterable>
        <el-option v-for="item in deviceClassificationList" :key="item.device_classification_id"
                   :label="item.device_classification_name"
                   :value="item.device_classification_id"></el-option>
      </el-select>
    </el-col>
    <el-col :span='4' :offset='1'>
      <el-select :span='5' v-model="categoryId" @change="selectCategory" placeholder="请选择所属类别" filterable>
        <el-option v-for="item in categoryList" :key="item.category_id"
                   :label="item.category_name"
                   :value="item.category_id"></el-option>
      </el-select>
    </el-col>
    <el-col :span='4' :offset='1'>
      <el-select :span='5' v-model="deviceNameId" placeholder="请选择器械名称" filterable>
        <el-option v-for="item in deviceNameList" :key="item.device_name_id"
                   :label="item.device_name_name"
                   :value="item.device_name_id"></el-option>
      </el-select>
    </el-col>
    <el-col :span='2'>
      <el-button @click='getDevice' type="primary">查询</el-button>
    </el-col>
  </el-row>
  <div class='edit_dev'>
    <el-transfer
      v-model='valueArray'
      filterable
      filter-placeholder='请输入器械编号'
      :data='deviceNumberList'
      :props='{key: "device_number_id", label: "device_number_id"}'
      :titles="['器械名称编号', '已选器械名称编号']"
    />
  </div>
  <el-row>
    <el-col :span='6' :offset='1'>
      <el-input
        placeholder='请输入领取缘由'
        v-model='receiveReason'
        clearable suffix-icon='el-icon-search'>
      </el-input>
    </el-col>
    <el-col :span='3' :offset='1'>
      <el-button type='primary' @click='saveGet' class='m10_0'>立即保存</el-button>
    </el-col>
  </el-row>
</template>

<script>
import { apiGetCategory } from '@/request/api/category'
import { apiGetDeviceClassifications } from '@/request/api/deviceClassification'
import { apiGetDeviceName } from '@/request/api/deviceName'
import { apiGetDeviceNumberAll } from '@/request/api/deviceNumber'
import { apiGetAllUser } from '@/request/api/user'
import { apiGetDepartAll } from '@/request/api/administrativeOffice'
import { apiAddReceive, apiGetReceiveAll } from '@/request/api/receive'

export default {
  name: 'Receive',
  data () {
    return {
      categoryList: [],
      categoryId: null,
      deviceClassificationList: [],
      deviceClassificationId: null,
      deviceNameList: [],
      deviceNameId: null,
      deviceNumberList: [],
      receiveReason: '',
      data: [],
      valueArray: []
    }
  },
  methods: {
    getList () {
      apiGetDeviceClassifications().then(res => {
        this.deviceClassificationList = res.data
      })
    },
    selectClassification (val) {
      apiGetCategory().then(res => {
        this.categoryList = res.data.filter(item => item.device_classification_id === val)
      })
    },
    selectCategory (val) {
      apiGetDeviceName().then(res => {
        this.deviceNameList = res.data.filter(item => item.category_id === val)
      })
    },
    getDevice () {
      apiGetDeviceNumberAll().then(res => {
        res.data.forEach(item => {
          if (item.device_name_id === this.deviceNameId) {
            apiGetReceiveAll().then(result => {
              for (let i = 0; i < result.data.length; i++) {
                const t = result.data[i]
                if (t.device_number_id === item.device_number_id) {
                  break
                } else if (i === result.data.length - 1) {
                  this.deviceNumberList.push(item)
                }
              }
            })
          }
        })
      })
      if (this.deviceNumberId === null || this.deviceNameId === null || this.deviceClassificationId === null) {
        // 提示信息
        this.$message.error('请选择器械编号')
      }
    },
    async saveGet () {
      let administrativeOfficeId = null
      const id = Number(localStorage.getItem('login'))
      await apiGetAllUser().then(async res => {
        const user = res.data.find(item => item.user_id === id)
        await apiGetDepartAll().then(res => {
          const office = res.data.find(t => t.user_id === user.user_id)
          administrativeOfficeId = office.administrative_office_id
        })
      })
      const level = (this.categoryList.find(ttt => ttt.category_id === this.categoryId)).category_level
      this.valueArray.forEach(item => {
        console.log({
          device_number_id: Number(item),
          administrative_office_id: administrativeOfficeId,
          receive_reason: this.receiveReason,
          receive_return_time: this.getCurrentTime(),
          receive_state: level === '三类' ? 2 : -1,
          department_id: 0
        })
        apiAddReceive({
          device_number_id: Number(item),
          administrative_office_id: administrativeOfficeId,
          receive_reason: this.receiveReason,
          receive_return_time: this.getCurrentTime(),
          receive_state: level === '三类' ? 2 : -1,
          department_id: 0
        }).then(res => {
          if (res.code === 200) {
            this.$message.success('申请领取成功!')
            setTimeout(function () {
              location.reload()
            }, 2000)
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    },
    getCurrentTime () {
      // 获取当前时间并打印
      var _this = this
      const yy = new Date().getFullYear()
      const mm = new Date().getMonth() + 1
      const dd = new Date().getDate()
      const hh = new Date().getHours()
      const mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      const ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
      _this.gettime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
      return _this.gettime
    }
  },
  created () {
    this.getList()
  }
}
</script>

<style scoped>
.transfer-footer {
  margin-left: 20px;
  padding: 6px 5px;
}

.edit_dev /deep/ .el-transfer-panel {
  margin: 20px 15px;
  width: 40%;
  height: 400px;
}
</style>
