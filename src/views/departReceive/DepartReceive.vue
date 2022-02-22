<template>
  <el-row>
    <el-col :span='4' style="margin-left: 20px;">
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
    <el-col :span='4' style="margin-left: 20px;">
      <el-select :span='5' v-model="departmentId" placeholder="请选择领取部门" filterable>
        <el-option v-for="item in departmentList" :key="item.department_id"
                   :label="item.department_name"
                   :value="item.department_id"></el-option>
      </el-select>
    </el-col>
    <el-col :span='3'>
      <el-button type='primary' @click='saveGet' class='m10_0'>立即保存</el-button>
    </el-col>
  </el-row>
</template>

<script>
import { apiGetAllUser } from '@/request/api/user'
import { apiGetDepartAll } from '@/request/api/administrativeOffice'
import { apiGetReceiveAll, apiUpdateReceiveToDep } from '@/request/api/receive'
import { apiGetDepartments } from '@/request/api/department'

export default {
  name: 'departReceive',
  data () {
    return {
      deviceNameList: [],
      deviceNameId: null,
      deviceNumberList: [],
      receiveReason: '',
      departmentList: [],
      data: [],
      departmentId: null,
      valueArray: []
    }
  },
  methods: {
    getList () {
      this.deviceNameList = []
      apiGetReceiveAll().then(async result => {
        for (let i = 0; i < result.data.length; i++) {
          if (result.data[i].administrative_office_id === await this.getOfficeId()) {
            if (this.deviceNameList.find(item => item.device_name_name === result.data[i].device_name_name)) {
              continue
            } else {
              this.deviceNameList.push(result.data[i])
            }
          }
        }
      })
      apiGetDepartments().then(async res => {
        if (res.code === 200) {
          this.departmentList = res.data
        }
      })
    },
    getDevice () {
      this.deviceNumberList = []
      apiGetReceiveAll().then(async result => {
        for (let i = 0; i < result.data.length; i++) {
          const t = result.data[i]
          if (t.administrative_office_id !== await this.getOfficeId()) { continue }
          if (t.receive_state === -1 || t.receive_state === 1) continue
          if (t.device_name_id !== this.deviceNameId) continue
          if (t.department_id) continue
          this.deviceNumberList.push(t)
        }
      })
      if (this.deviceNumberId === null || this.deviceNameId === null) {
        // 提示信息
        this.$message.error('请选择器械编号')
      }
    },
    async saveGet () {
      if (this.departmentId === null) {
        return
      }
      this.valueArray.forEach(item => {
        apiUpdateReceiveToDep({
          device_number_id: Number(item),
          department_id: this.departmentId
        }).then(res => {
          if (res.code === 200) {
            this.$message.success('申请领取成功!')
          } else {
            this.$message.error('申请领取失败!')
          }
        })
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
