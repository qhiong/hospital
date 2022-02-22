<template>
  <div>
    <el-row>
      <el-col :span='4'>
        <el-select :span='5' v-model="administrativeOfficeId" placeholder="请选择器械" filterable>
          <el-option v-for="item in officeList" :key="item.administrative_office_id"
                     :label="item.administrative_office_name"
                     :value="item.administrative_office_id"></el-option>
        </el-select>
      </el-col>
      <el-col :span='5' :offset='1'>
        <el-input
          placeholder='请输入器械名称'
          v-model='deviceNameName'
          clearable>
        </el-input>
      </el-col>
      <el-col :span='3' :offset='1'>
        <el-button @click='getStandardList' type="primary">查询</el-button>
      </el-col>
    </el-row>
    <el-table
      :data='standardList'
      style='width: 100%'>
      <el-table-column
        type='index'
        label='序号' width='200'>
      </el-table-column>
      <el-table-column
        prop='administrative_office_name'
        label='科室名称'
        width='200'>
      </el-table-column>
      <el-table-column
        prop='device_name_name'
        label='器械名称'
        width='200'>
      </el-table-column>
      <el-table-column
        prop='device_receiving_standard_count'
        label='领取数量'
        width='200'>
      </el-table-column>
      <el-table-column
        prop='device_receiving_standard_cycle'
        label='领取周期'
        width='200'>
      </el-table-column>
      <el-table-column
        label='操作'>
        <template #default="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)"
          >修改
          </el-button
          >
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
      title="修改器械领取标准"
      width="30%"
    >
      <el-form :inline="true" :rules='standardFormRules' ref="standardFormRef" :model="standardForm"
               class="demo-form-inline">
        <el-form-item label="科室名称" prop="administrativeOfficeName">
          <el-input v-model="standardForm.administrativeOfficeName" placeholder="科室名称"></el-input>
        </el-form-item>
        <el-form-item label="器械名称" prop="deviceNameName">
          <el-input v-model="standardForm.deviceNameName" placeholder="器械名称"></el-input>
        </el-form-item>
        <el-form-item label="器械领取数量" prop="deviceReceivingStandardCount">
          <el-input-number v-model="standardForm.deviceReceivingStandardCount" :step="10" placeholder="器械领取数量"
                           min="10"></el-input-number>
        </el-form-item>
        <el-form-item label="器械领取周期" prop="deviceReceivingStandardCycle">
          <el-input-number v-model="standardForm.deviceReceivingStandardCycle" placeholder="器械领取周期" :step='1'
                           min="1"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onStandardSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>
import { apiGetDeviceReceivingStandardListByPagination, apiUpdateDeviceReceivingStandard } from '@/request/api/standard'
import { apiGetDepartAll } from '../../request/api/administrativeOffice'

export default {
  name: 'standard',
  data () {
    return {
      standardList: [],
      standardFormTitle: '',
      pageSize: 10,
      currentPage: 1,
      standardName: '',
      total: 0,
      officeList: [],
      dialogVisible: false,
      administrativeOfficeId: 5,
      deviceNameName: null,
      deviceNameId: null,
      standardForm: {
        administrativeOfficeName: '',
        administrativeOfficeId: 0,
        deviceNameName: '',
        deviceNameId: 0,
        deviceReceivingStandardCount: 0,
        deviceReceivingStandardCycle: 0,
        deviceReceivingStandardId: 0
      },
      // 表单验证规则
      standardFormRules: {
        // 器械领取标准名验证规则
        standardName: [
          {
            required: true,
            message: '请输入器械领取标准名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    getStandardList () {
      apiGetDeviceReceivingStandardListByPagination({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        administrative_office_id: this.administrativeOfficeId,
        device_name_name: this.deviceNameName
      }).then(res => {
        // 将返回的器械领取标准数组存储
        this.standardList = res.data.data
        // 将返回的总数存储
        this.total = res.data.total
      })
      apiGetDepartAll().then(res => {
        this.officeList = res.data
      })
    },
    handleEdit (row) {
      this.dialogVisible = true
      this.standardFormTitle = '修改器械领取标准'
      this.standardForm.administrativeOfficeName = row.administrative_office_name
      this.standardForm.administrativeOfficeId = row.administrative_office_id
      this.standardForm.deviceReceivingStandardCount = row.device_receiving_standard_count
      this.standardForm.deviceReceivingStandardCycle = row.device_receiving_standard_cycle
      this.standardForm.deviceReceivingStandardId = row.device_receiving_standard_id
      this.standardForm.deviceNameName = row.device_name_name
      this.standardForm.deviceNameId = row.device_name_id
    },
    onStandardSubmit () {
      // 保存this
      const that = this
      // 初始化状态值
      let valid = false
      // 表单验证
      that.$refs.standardFormRef.validate(v => {
        // 将验证结果保存
        valid = v
      })
      // 判断验证是否成功
      if (!valid) {
        this.$message.error('请输入正确内容')
        return
      }
      apiUpdateDeviceReceivingStandard({
        device_receiving_standard_id: this.standardForm.deviceReceivingStandardId,
        device_name_id: this.standardForm.deviceNameId,
        administrative_office_id: this.standardForm.administrativeOfficeId,
        device_receiving_standard_count: this.standardForm.deviceReceivingStandardCount,
        device_receiving_standard_cycle: this.standardForm.deviceReceivingStandardCycle
      }).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.dialogVisible = false
          this.getStandardList()
        } else {
          this.$message.success(res.msg)
        }
      })
    },
    changeCurrentPage (newPage) {
      this.currentPage = newPage
      this.getStandardList()
    }
  },
  created () {
    // 执行获取器械领取标准数据
    this.getStandardList()
  }
}
</script>

<style scoped>

</style>
