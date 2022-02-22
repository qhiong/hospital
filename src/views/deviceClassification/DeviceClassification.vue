<template>
  <div>
    <el-row>
      <el-col :span='3'>
        <el-button type='primary' plain @click='opendeviceClassificationFromDialog(-1)'>添加分类
        </el-button>
      </el-col>
      <el-col :span='6' :offset='14'>
        <el-input
          placeholder='请输入名称'
          v-model='deviceClassificationName'
          clearable @change='getDeviceClassificationList' suffix-icon='el-icon-search'>
        </el-input>
      </el-col>
    </el-row>
    <el-table
      :data='deviceClassificationList'
      style='width: 100%'>
      <el-table-column
        type='index'
        label='序号' width='200'>
      </el-table-column>
      <el-table-column
        prop='device_classification_name'
        label='名称'
        width='400'>
      </el-table-column>
      <el-table-column
        label='操作'>
        <template #default="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)"
          >修改
          </el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
          >删除
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
      title="修改分类"
      width="30%"
    >
      <el-form :inline="true" :rules='deviceClassificationFormRules' ref="deviceClassificationFormRef" :model="deviceClassificationForm" class="demo-form-inline">
        <el-form-item label="分类名称" prop="deviceClassificationName">
          <el-input v-model="deviceClassificationForm.deviceClassificationName" placeholder="分类名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onDeviceClassificationSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>
import { apiGetDeviceClassificationListByPagination, apiUpdateDeviceClassification, apiDeleteDeviceClassification, apiAddDeviceClassification } from '@/request/api/deviceClassification'

export default {
  name: 'deviceClassification',
  data () {
    return {
      deviceClassificationList: [],
      deviceClassificationFormTitle: '',
      pageSize: 10,
      currentPage: 1,
      deviceClassificationName: '',
      total: 0,
      dialogVisible: false,
      deviceClassificationForm: {
        deviceClassificationName: '',
        deviceClassificationId: 0
      },
      // 表单验证规则
      deviceClassificationFormRules: {
        // 分类名验证规则
        deviceClassificationName: [
          {
            required: true,
            message: '请输入分类名称',
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
    getDeviceClassificationList () {
      apiGetDeviceClassificationListByPagination({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        device_classification_name: this.deviceClassificationName
      }).then(res => {
        // 将返回的分类数组存储
        this.deviceClassificationList = res.data.data
        // 将返回的总数存储
        this.total = res.data.total
      })
    },
    handleEdit (row) {
      this.dialogVisible = true
      this.deviceClassificationForm.deviceClassificationId = row.device_classification_id
      this.deviceClassificationForm.deviceClassificationName = row.device_classification_name
    },
    opendeviceClassificationFromDialog () {
      this.dialogVisible = true
      this.deviceClassificationForm.deviceClassificationName = ''
      this.deviceClassificationForm.deviceClassificationId = 0
    },
    onDeviceClassificationSubmit () {
      // 保存this
      const that = this
      // 初始化状态值
      let valid = false
      // 表单验证
      that.$refs.deviceClassificationFormRef.validate(v => {
        // 将验证结果保存
        valid = v
      })
      // 判断验证是否成功
      if (!valid) {
        this.$message.error('请输入正确内容')
        return
      }
      if (this.deviceClassificationForm.deviceClassificationId === 0) {
        apiAddDeviceClassification({
          device_classification_name: this.deviceClassificationForm.deviceClassificationName
        }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.getDeviceClassificationList()
          } else {
            this.$message.success(res.msg)
          }
        })
      } else {
        apiUpdateDeviceClassification({
          device_classification_id: this.deviceClassificationForm.deviceClassificationId,
          device_classification_name: this.deviceClassificationForm.deviceClassificationName
        }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.getDeviceClassificationList()
          } else {
            this.$message.success(res.msg)
          }
        })
      }
    },
    handleDelete (row) {
      this.$confirm('是否删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(_ => {
        apiDeleteDeviceClassification({
          device_classification_id: row.device_classification_id
        }).then(res => {
          this.$message.success(res.msg)
          this.getDeviceClassificationList()
        })
      })
    },
    changeCurrentPage (newPage) {
      this.currentPage = newPage
      this.getDeviceClassificationList()
    }
  },
  created () {
    // 执行获取分类数据
    this.getDeviceClassificationList()
  }
}
</script>

<style scoped>

</style>
