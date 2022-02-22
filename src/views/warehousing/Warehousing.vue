<template>
  <div>
    <el-row>
      <el-col :span='3'>
        <el-button type='primary' plain icon='el-icon-circle-plus-outline' @click='openWarehousingFromDialog(-1)'>添加入库
        </el-button>
      </el-col>
      <el-col :span='6' :offset='14'>
        <el-input
          placeholder='请输入名称'
          v-model='deviceNumberId'
          clearable @change='getWarehousingList' suffix-icon='el-icon-search'>
        </el-input>
      </el-col>
    </el-row>
    <el-table
      :data='warehousingList'
      style='width: 100%'>
      <el-table-column
        type='index'
        label='序号' width='200'>
      </el-table-column>
      <el-table-column
        prop='device_name_name'
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
      title="修改入库"
      width="30%"
    >
      <el-form :inline="true" :rules='warehousingFormRules' ref="warehousingFormRef" :model="warehousingForm"
               class="demo-form-inline">
        <el-form-item label="器械编号" prop="deviceNumberId">
          <el-cascader
            v-model="value"
            filterable
            :options="options"
            :props="{value:'id',label:'name'}"
            @change="handleChangeSelect"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="入库备注" prop="warehousingRemarks">
          <el-input v-model="warehousingForm.warehousingRemarks" placeholder="入库备注"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onWarehousingSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>
import {
  apiGetWarehousingListByPagination,
  apiUpdateWarehousing,
  apiDeleteWarehousing,
  apiAddWarehousing
} from '@/request/api/warehousing'
import getOptionsNum from '../../utils/selectDeviceNumberInfo'

export default {
  name: 'warehousing',
  data () {
    return {
      warehousingList: [],
      warehousingFormTitle: '',
      pageSize: 10,
      currentPage: 1,
      deviceNameId: 0,
      total: 0,
      deviceNumberId: 0,
      dialogVisible: false,
      options: [],
      warehousingForm: {
        deviceNumberId: 0,
        warehousingRemarks: '',
        id: 0
      },
      // 表单验证规则
      warehousingFormRules: {
        // 入库名验证规则
        warehousingRemarks: [
          {
            required: true,
            message: '请输入入库名备注',
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
    async getWarehousingList () {
      apiGetWarehousingListByPagination({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        device_name_id: this.deviceNameId,
        device_number_id: this.deviceNumberId
      }).then(res => {
        // 将返回的入库数组存储
        this.warehousingList = res.data.data
        // 将返回的总数存储
        this.total = res.data.total
      })
      this.options = await getOptionsNum(this.options)
    },
    handleEdit (row) {
      this.dialogVisible = true
      this.warehousingForm.deviceNumberId = row.device_number_id
      this.warehousingForm.warehousingRemarks = row.warehousing_remarks
      this.warehousingForm.id = 1
    },
    handleChangeSelect (value) {
      this.warehousingForm.deviceNumberId = Number(value[value.length - 1])
    },
    openWarehousingFromDialog () {
      this.dialogVisible = true
      this.warehousingForm.warehousingRemarks = ''
      this.warehousingForm.deviceNumberId = 0
      this.warehousingForm.id = 0
    },
    onWarehousingSubmit () {
      // 保存this
      const that = this
      // 初始化状态值
      let valid = false
      // 表单验证
      that.$refs.warehousingFormRef.validate(v => {
        // 将验证结果保存
        valid = v
      })
      // 判断验证是否成功
      if (!valid) {
        this.$message.error('请输入正确内容')
        return
      }
      if (this.warehousingForm.id === 0) {
        apiAddWarehousing({
          device_number_id: this.warehousingForm.deviceNumberId,
          warehousing_remarks: this.warehousingForm.warehousingRemarks
        }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.getWarehousingList()
          } else {
            this.$message.success(res.msg)
          }
        })
      } else {
        apiUpdateWarehousing({
          warehousing_id: this.warehousingForm.warehousingId,
          warehousing_name: this.warehousingForm.warehousingName
        }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.getWarehousingList()
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
        apiDeleteWarehousing({
          warehousing_id: row.warehousing_id
        }).then(res => {
          this.$message.success(res.msg)
          this.getWarehousingList()
        })
      })
    },
    changeCurrentPage (newPage) {
      this.currentPage = newPage
      this.getWarehousingList()
    }
  },
  created () {
    // 执行获取入库数据
    this.getWarehousingList()
  }
}
</script>

<style scoped>
.el-form-item {
  width: 450px;
}
</style>
