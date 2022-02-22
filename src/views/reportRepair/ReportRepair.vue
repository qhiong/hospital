<template>
  <div>
    <el-row>
      <el-col :span='3'>
        <el-button type='primary' plain @click='openRepairFromDialog(-1)'>申请报修
        </el-button>
      </el-col>
      <el-col :span='6' :offset='14'>
        <el-input
          placeholder='请输入器械编号'
          v-model='queryData.deviceNumberId'
          clearable @change='getRepairList' suffix-icon='el-icon-search'>
        </el-input>
      </el-col>
      <el-radio-group v-model="radio" @change="changeRadio">
        <el-radio :label="0">未上报</el-radio>
        <el-radio :label="1">正在维修</el-radio>
        <el-radio :label="2">已完成</el-radio>
        <el-radio :label="3">已报废</el-radio>
      </el-radio-group>
    </el-row>
    <el-table
      :data='repairList'
      style='width: 100%'>
      <el-table-column
        type='index'
        label='序号' width='200'>
      </el-table-column>
      <el-table-column
        prop='category_name'
        label='类别名称'
        width='200'>
      </el-table-column>
      <el-table-column
        prop='device_name_name'
        label='器械名称'
        width='200'>
      </el-table-column>
      <el-table-column
        prop='device_number_id'
        label='器械编号'
        width='200'>
      </el-table-column>
      <el-table-column
        prop='repair_strat_time'
        label='开始时间'
        width='200'>
      </el-table-column>
      <el-table-column
        :prop='repairTypeList["repair_type"]'
        label='报修类型'
        width='200'>
      </el-table-column>
      <el-table-column
        prop='repair_fault_description'
        label='故障描述'
        width='200'>
      </el-table-column>
      <el-table-column
        label='操作'>
        <template #default="scope">
          <el-button
            size="mini"
            type="primary"
            :disabled="!repairBool"
            @click="handleExit(scope.row)"
          >上报
          </el-button
          >
          <el-button
            size="mini"
            type="danger"
            :disabled="!repairBool"
            @click="handleDelete(scope.row)"
          >取消
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="changeCurrentPage"
      :page-size="queryData.pageSize"
      :pager-count="11"
      layout="prev, pager, next"
      :total="total"
    >
    </el-pagination>
    <el-dialog
      v-model="dialogVisible"
      width="30%"
    >
      <el-form :inline="true" :rules='repairFormRules' ref="repairFormRef" :model="repairForm" class="demo-form-inline">
        <el-form-item label="器械所属类别" prop="categoryId">
          <el-select v-model="repairForm.categoryId" placeholder="请选择分类" filterable
                     @change="selectCategory">
            <el-option v-for="item in categoryList" :key="item.category_id"
                       :label="item.category_name"
                       :value="item.category_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="器械名称" prop="deviceNameId">
          <el-select v-model="repairForm.deviceNameId" placeholder="请选择分类" filterable
                     @change="selectDeviceName">
            <el-option v-for="item in deviceNameList" :key="item.device_name_id"
                       :label="item.device_name_name"
                       :value="item.device_name_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="器械编号" prop="deviceNumberId">
          <el-select v-model="repairForm.deviceNumberId" placeholder="请选择分类" filterable
                     @change="selectDeviceName">
            <el-option v-for="item in deviceNumberList" :key="item.device_number_id"
                       :label="item.device_number_id"
                       :value="item.device_number_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="维修类型" prop="repairType">
          <el-select v-model="repairForm.repairType" placeholder="请选择分类" filterable
                     @change="selectDeviceName">
            <el-option v-for="(item,index) in repairTypeList" :key="index"
                       :label="item"
                       :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="维修故障描述" prop="repairFaultDescription">
          <el-input v-model="repairForm.repairFaultDescription" type="textarea" :rows="2"
                    placeholder="维修故障描述"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onRepairSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      v-model="dialog1Visible"
      width="30%"
    >
      <el-form :inline="true" :rules='repairFormRules' ref="repairFormRef" :model="repairForm" class="demo-form-inline">
        <el-form-item label="器械名称" prop="deviceNameName">
          <el-input v-model="repairForm.deviceNameName" type="text" disabled
                    placeholder="器械名称"></el-input>
        </el-form-item>
        <el-form-item label="维修类型" prop="repairType">
          <el-input v-model="repairForm.repairType" type="text" disabled
                    placeholder="维修类型"></el-input>
        </el-form-item>
        <el-form-item label="维修故障描述" prop="repairFaultDescription">
          <el-input v-model="repairForm.repairFaultDescription" type="text" disabled
                    placeholder="维修故障描述"></el-input>
        </el-form-item>
        <el-form-item label="申请报修科室" prop="administrativeOfficeName">
          <el-input v-model="repairForm.administrativeOfficeName" type="text" disabled
                    placeholder="申请报修科室"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onRepairsSubmit" v-if="repairBool">上报</el-button>
          <el-button type="primary" @click="onMaintainSubmit" v-else>保养</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>
import {
  apiGetRepairListByPagination,
  apiDeleteRepair,
  apiAddRepair,
  apiGetAllRepair
  , apiUpdateRepair
} from '@/request/api/repair'
import { apiGetCategory } from '@/request/api/category'
import { apiGetDeviceName } from '@/request/api/deviceName'
import { apiGetDeviceNumberAll } from '@/request/api/deviceNumber'
import { apiGetReceiveAll } from '@/request/api/receive'
import { apiGetDepartAll } from '@/request/api/administrativeOffice'

import { ref } from 'vue'

export default {
  name: 'repair',
  data () {
    return {
      repairList: [],
      repairFormTitle: '',
      repairName: '',
      categoryList: [],
      total: 0,
      dialogVisible: false,
      dialog1Visible: false,
      deviceNumberId: null,
      deviceNameList: [],
      deviceNumberList: [],
      repairBool: true,
      repairTypeList: ['维修', '保养'],
      radio: ref(0),
      queryData: {
        pageSize: 10,
        currentPage: 1,
        deviceNumberId: null,
        administrativeOfficeId: null,
        repairState: null,
        repairType: null,
        repairFaultDescription: ''
      },
      repairForm: {
        repairId: 0,
        administrativeOfficeId: null,
        repairStratTime: this.getCurrentTime(),
        deviceNumberId: null,
        repairState: null,
        repairType: null,
        repairFaultDescription: '',
        repairEndTime: this.getCurrentTime(),
        categoryId: null,
        deviceNameId: null,
        deviceNameName: '',
        administrativeOfficeName: ''
      },
      // 表单验证规则
      repairFormRules: {
        // 维修名验证规则
        repairFaultDescription: [
          {
            required: true,
            message: '请输入维修故障内容',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 40 个字符',
            trigger: 'blur'
          }
        ],
        repairType: [
          {
            required: true,
            message: '请选择维修类型',
            trigger: 'blur'
          }
        ],
        deviceNameId: [
          {
            required: true,
            message: '请选择器械名称',
            trigger: 'blur'
          }
        ],
        deviceNumberId: [
          {
            required: true,
            message: '请选择器械编号',
            trigger: 'blur'
          }
        ],
        categoryId: [
          {
            required: true,
            message: '请选择类别编号',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    getRepairList () {
      this.getData(0)
      apiGetCategory({}).then(res => {
        this.categoryList = res.data
      })
      this.repairForm.administrativeOfficeId = Number(localStorage.getItem('login'))
    },
    async changeRadio (val) {
      this.repairBool = val === 0
      this.getData(val)
    },
    async selectCategory (val) {
      await apiGetDeviceName().then(res => {
        this.deviceNameList = res.data.filter(item => item.category_id === val)
      })
    },
    getData (state) {
      this.repairList = []
      apiGetRepairListByPagination({
        currentPage: this.queryData.currentPage,
        pageSize: this.queryData.pageSize,
        device_number_id: this.queryData.deviceNumberId,
        administrative_office_id: this.queryData.administrativeOfficeId,
        repair_state: state,
        repair_type: this.queryData.repairType,
        repair_fault_description: this.queryData.repairFaultDescription
      }).then(res => {
        // 将返回的维修数组存储
        this.repairList = res.data.data
        // 将返回的总数存储
        this.total = res.data.total
      })
    },
    async handleExit (row) {
      this.dialog1Visible = true
      this.repairBool = row.repair_type !== 1
      this.repairForm.repairId = row.repair_id
      this.repairForm.repairFaultDescription = row.repair_fault_description
      this.repairForm.deviceNameName = row.device_name_name
      this.repairForm.repairType = row.repair_type === 0 ? '维修' : '保养'
      this.repairForm.administrativeOfficeName = await this.getOfficeName(row.administrative_office_id)
    },
    async selectDeviceName (val) {
      this.deviceNumberList = []
      await apiGetDeviceNumberAll().then(res => {
        const list = res.data.filter(item => item.device_name_id === val)
        apiGetReceiveAll().then(result => {
          for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < result.data.length; j++) {
              if (list[i].device_number_id === result.data[j].device_number_id && (result.data[j].receive_state === 0 || result.data[j].receive_state === 2)) {
                apiGetAllRepair().then(resu => {
                  if (resu.data.length === 0) this.deviceNumberList.push(list[i])
                  for (let m = 0; m < resu.data.length; m++) {
                    if (resu.data[m].device_number_id === list[i].device_number_id) {
                      break
                    } else if (m === resu.data.length - 1) {
                      this.deviceNumberList.push(list[i])
                      break
                    }
                  }
                })
              }
            }
          }
        })
      })
    },
    openRepairFromDialog () {
      this.dialogVisible = true
      this.repairFormTitle = '申请维修'
      this.repairForm.deviceNumberId = null
      this.repairForm.repairState = null
      this.repairForm.repairType = null
      this.repairForm.repairFaultDescription = ''
      this.repairForm.categoryId = null
      this.repairForm.deviceNameId = null
    },
    async getOfficeName (id) {
      let name = ''
      await apiGetDepartAll().then(res => {
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].administrative_office_id === id) {
            name = res.data[i].administrative_office_name
          }
        }
      })
      return name
    },
    onRepairSubmit () {
      // 保存this
      const that = this
      // 初始化状态值
      let valid = false
      // 表单验证
      that.$refs.repairFormRef.validate(v => {
        // 将验证结果保存
        valid = v
      })
      // 判断验证是否成功
      if (!valid) {
        this.$message.error('请输入正确内容')
        return
      }
      apiAddRepair({
        device_number_id: this.repairForm.deviceNumberId,
        administrative_office_id: -1,
        repair_strat_time: this.repairForm.repairStratTime,
        repair_end_time: this.repairForm.repairEndTime,
        repair_state: 0,
        repair_type: this.repairForm.repairType,
        repair_fault_description: this.repairForm.repairFaultDescription
      }).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.dialogVisible = false
          this.getRepairList()
        } else {
          this.$message.success(res.msg)
        }
      })
    },
    handleDelete (row) {
      this.$confirm('是否删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(_ => {
        apiDeleteRepair({
          repair_id: row.repair_id
        }).then(res => {
          this.$message.success(res.msg)
          this.getRepairList()
        })
      })
    },
    onMaintainSubmit () {
      apiUpdateRepair({
        repair_id: this.repairForm.repairId,
        repair_state: 3
      }).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.getRepairList()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    onRepairsSubmit () {
      apiUpdateRepair({
        repair_id: this.repairForm.repairId,
        repair_state: 1
      }).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.getRepairList()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    changeCurrentPage (newPage) {
      this.currentPage = newPage
      this.getRepairList()
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
    // 执行获取维修数据
    this.getRepairList()
  }
}
</script>

<style scoped>
.el-form-item {
  width: 100%;
}

.el-select {
  width: 300px;
}
</style>
