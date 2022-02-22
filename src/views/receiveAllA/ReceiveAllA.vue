<template>
  <div>
    <el-row style="margin-bottom: 20px;">
      <el-col :span='6'>
        <el-input
          placeholder='请输入器械编号'
          v-model='deviceNumberId'
          clearable @change='getReceiveList' suffix-icon='el-icon-search'>
        </el-input>
      </el-col>
    </el-row>
    <el-radio-group v-model="radio" @change="changeRadio">
      <el-radio :label="-1">未审批</el-radio>
      <el-radio :label="0">已审批</el-radio>
      <el-radio :label="1">未归还</el-radio>
    </el-radio-group>
    <el-table
      :data="receiveList"
      style="width: 100%"
      row-key="device_number_id"
      border
      lazy
      :tree-props="{ children: 'children' }"
    >
      <el-table-column
        type='index'
        label='序号' width='200'>
      </el-table-column>
      <el-table-column prop="device_number_id" label="器械编号" width="200"/>
      <el-table-column prop="device_name_name" label="器械名称" width="200"/>
      <el-table-column prop="category_name" label="所属类别" width="200"/>
      <el-table-column prop="receive_return_time" label="应归还时间" width="200"/>
      <el-table-column
        label='操作'>
        <template #default="scope">
          <el-button
            size="mini"
            type="primary"
            :disabled="!approveBool"
            @click="handleApprove(scope.row)"
          >审批
          </el-button
          >
          <el-button
            size="mini"
            type="primary"
            :disabled="!approveBool"
            @click="handleRefuse(scope.row)"
          >打回
          </el-button
          >
          <el-button
            size="mini"
            type="danger"
            :disabled="!approveBool"
            @click="handleDelete(scope.row)"
          >删除
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="dialogVisible"
      title="审批领取"
      width="30%"
    >
      <el-form :inline="true" :rules='receiveFormRules' ref="roleFormRef" :model="receiveForm" class="demo-form-inline">
        <el-form-item label="器械类别" prop="categoryName">
          <el-input disabled v-model="receiveForm.categoryName" placeholder="审批"></el-input>
        </el-form-item>
        <el-form-item label="器械名称" prop="deviceNameName">
          <el-input disabled v-model="receiveForm.deviceNameName" placeholder="审批"></el-input>
        </el-form-item>
        <el-form-item label="应还时间" prop="receiveTime">
          <el-input disabled v-model="receiveForm.receiveTime" placeholder="审批"></el-input>
        </el-form-item>
        <el-form-item label="器械级别" prop="categoryLevel">
          <el-input disabled v-model="receiveForm.categoryLevel" placeholder="审批"></el-input>
        </el-form-item>
        <el-form-item label="供应商" prop="supplierName">
          <el-input disabled v-model="receiveForm.supplierName" placeholder="审批"></el-input>
        </el-form-item>
        <el-form-item label="申请缘由" prop="receiveReason">
          <el-input disabled v-model="receiveForm.receiveReason" placeholder="审批"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onReceiveSubmit">批准</el-button>
          <el-button type="danger" @click="handleRefuse">驳回</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { apiDeleteReceive, apiGetByState, apiUpdateReceive } from '@/request/api/receive'
import { ref } from 'vue'

export default {
  name: 'ReceiveAllA',
  data () {
    return {
      receiveList: [],
      deviceNumberId: null,
      radio: ref(-1),
      approveBool: true,
      dialogVisible: false,
      receiveForm: {
        categoryName: '',
        deviceNameName: '',
        deviceNumberId: null,
        receiveTime: '',
        receiveId: 0,
        supplierName: '',
        receiveReason: '',
        categoryLevel: ''
      },
      receiveFormRules: {}
    }
  },
  methods: {
    async getReceiveList () {
      await apiGetByState({ receive_state: this.radio }).then(async res => {
        this.getList(res, -1)
      })
    },
    async changeRadio (val) {
      this.approveBool = val === -1
      await apiGetByState({ receive_state: val }).then(async res => {
        this.getList(res, val)
      })
    },
    async getList (res, val) {
      const list = []
      res.data.forEach((item) => {
        if (list.length === 0) {
          list.push(item)
        } else {
          for (let i = 0; i < list.length; i++) {
            const itemL = list[i]
            if (itemL.device_name_id === item.device_name_id) {
              if (!itemL.children) {
                itemL.children = []
              }
              itemL.children.push(item)
              break
            } else if (i === list.length - 1) {
              list.push(item)
              break
            }
          }
        }
      })
      // if (val === 0) {
      //   await apiGetByState({ receive_state: 2 }).then(async res => {
      //     this.getList(res)
      //   })
      //   list.push(list)
      // } else {
      this.receiveList = list
      // }
    },
    handleDelete (row) {
      this.$confirm('是否删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(_ => {
        apiDeleteReceive({
          receive_id: row.receive_id
        }).then(res => {
          this.$message.success(res.msg)
          this.getReceiveList()
        })
      })
    },
    handleApprove (row) {
      this.dialogVisible = true
      this.receiveForm.categoryName = row.category_name
      this.receiveForm.deviceNameName = row.device_name_name
      this.receiveForm.receiveReason = row.receive_reason
      this.receiveForm.receiveTime = row.receive_return_time
      this.receiveForm.supplierName = row.supplier_name
      this.receiveForm.receiveId = row.receive_id
      this.receiveForm.categoryLevel = row.category_level
    },
    onReceiveSubmit () {
      const level = this.receiveForm.categoryLevel === '三级' ? 2 : 0
      apiUpdateReceive({
        receive_id: this.receiveForm.receiveId,
        receive_state: level,
        receive_liquidated_damages: 0
      }).then(res => {
        if (res.code === 200) {
          this.$message.success('已批准成功！')
          this.dialogVisible = false
          this.getReceiveList()
        }
      })
    },
    handleRefuse (row) {

    }
  },
  created () {
    // 执行获取角色数据
    this.getReceiveList()
  }
}
</script>

<style scoped>

</style>
