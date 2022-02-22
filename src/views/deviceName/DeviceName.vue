<template>
  <div>
    <el-row>
      <el-col :span='4'>
        <el-input
          placeholder='请输入器械名称'
          v-model='queryData.deviceNameName'
          clearable>
        </el-input>
      </el-col>
      <el-col :span='4' :offset='1'>
        <el-input
          placeholder='请输入器械作用'
          v-model='queryData.deviceNameEffect'
          clearable>
        </el-input>
      </el-col>
      <el-col :span='4' :offset='1'>
        <el-select v-model="queryData.categoryId" placeholder="请选择所属类别" filterable>
          <el-option v-for="item in categoryList" :key="item.category_id"
                     :label="item.category_name"
                     :value="item.category_id"></el-option>
        </el-select>
      </el-col>
      <el-col :span='4' :offset='1'>
        <el-select :span='5' v-model="queryData.supplierId" placeholder="请选择供应商" filterable>
          <el-option v-for="item in supplierList" :key="item.supplier_id"
                     :label="item.supplier_name"
                     :value="item.supplier_id"></el-option>
        </el-select>
      </el-col>
      <el-col :span='2' :offset='1'>
        <el-button @click='getDeviceNameList' type="primary" >查询</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px;" v-if="showOperation">
      <el-col :span='3'>
        <el-button type='primary' plain @click='openDeviceNameFromDialog(-1)'>添加器械名称
        </el-button>
      </el-col>
    </el-row>
    <el-table
      :data='deviceNameList'
      style='width: 100%'>
      <el-table-column
        type='index'
        label='序号' width='200'>
      </el-table-column>
      <el-table-column
        prop='device_name_name'
        label='名称'
        width='200'>
      </el-table-column>
      <el-table-column
        prop='device_name_effect'
        label='器械作用'
        width='300'>
      </el-table-column>
      <el-table-column
        prop='category_name'
        label='所属类别'
        width='200'>
      </el-table-column>
      <el-table-column
        prop='category_level'
        label='所属级别'
        width='200'>
      </el-table-column>
      <el-table-column
        prop='supplier_name'
        label='供应商'
        width='200'>
      </el-table-column>
      <el-table-column
        prop='device_name_service_life'
        label='使用寿命'
        width='200'>
      </el-table-column>
      <el-table-column
        prop='device_name_service_cycle'
        label='使用周期'
        width='200'>
      </el-table-column>
      <el-table-column
        label='操作'
        width="200"
        v-if="showOperation"
      >
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
      :page-size="this.queryData.pageSize"
      :pager-count="11"
      layout="prev, pager, next"
      :total="total"
    >
    </el-pagination>
    <el-dialog
      v-model="dialogVisible"
      title="修改器械名称"
      width="30%"
    >
      <el-form :inline="true" :rules='deviceNameFormRules' ref="deviceNameFormRef" :model="deviceNameForm"
               class="demo-form-inline">
        <el-form-item label="器械名称名称" prop="deviceNameName">
          <el-input v-model="deviceNameForm.deviceNameName" placeholder="器械名称名称"></el-input>
        </el-form-item>
        <el-form-item label="所属供应商" prop="categoryId">
          <el-select v-model="deviceNameForm.supplierId" placeholder="请选择分类">
            <el-option v-for="item in supplierList" :key="item.supplier_id"
                       :label="item.supplier_name"
                       :value="item.supplier_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="器械名称作用" prop="deviceNameEffect">
          <el-input v-model="deviceNameForm.deviceNameEffect" placeholder="器械名称作用"></el-input>
        </el-form-item>
        <el-form-item label="器械名称注意事项" prop="deviceNameMattersNeedingAttention">
          <el-input v-model="deviceNameForm.deviceNameMattersNeedingAttention" placeholder="器械名称注意事项"></el-input>
        </el-form-item>
        <el-form-item label="器械名称使用寿命" prop="deviceNameServiceLife">
          <el-input-number v-model="deviceNameForm.deviceNameServiceLife" :step="12" placeholder="器械名称使用寿命"
                           min="12"></el-input-number>
        </el-form-item>
        <el-form-item label="器械名称使用周期" prop="deviceNameServiceCycle">
          <el-input-number v-model="deviceNameForm.deviceNameServiceCycle" placeholder="器械名称使用周期" :step='1'
                           min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="生产日期" prop="deviceNameDateOfManufacture">
          <el-date-picker
            v-model="deviceNameForm.deviceNameDateOfManufacture"
            type="date"
            placeholder="请选择结束时间"
            value-format="YYYY-MM-DD"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="所属分类" prop="categoryId">
          <el-select v-model="deviceNameForm.categoryId" placeholder="请选择分类">
            <el-option v-for="item in categoryList" :key="item.category_id"
                       :label="item.category_name"
                       :value="item.category_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onDeviceNameSubmit" @reset="resetForm('deviceNameForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>
import {
  apiGetDeviceNameListByPagination,
  apiUpdateDeviceName,
  apiDeleteDeviceName,
  apiAddDeviceName
} from '@/request/api/deviceName'
import { apiGetCategory } from '../../request/api/category'
import { apiGetSuppliers } from '../../request/api/supplier'

export default {
  name: 'deviceName',
  data () {
    return {
      deviceNameList: [],
      deviceNameFormTitle: '',
      showOperation: true,
      queryData: {
        pageSize: 10,
        currentPage: 1,
        deviceNameName: '',
        categoryId: 6,
        deviceNameEffect: '',
        supplierId: 3
      },
      total: 0,
      dialogVisible: false,
      categoryList: [],
      supplierList: [],
      deviceNameForm: {
        deviceNameName: '',
        deviceNameId: 0,
        categoryId: 0,
        deviceNameEffect: '',
        supplierId: 0,
        deviceNameMattersNeedingAttention: '',
        deviceNameServiceCycle: 0,
        deviceNameDateOfManufacture: '',
        deviceNameServiceLife: 0
      },
      // 表单验证规则
      deviceNameFormRules: {
        // 器械名称名验证规则
        deviceNameName: [
          {
            required: true,
            message: '请输入器械名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        deviceNameEffect: [
          {
            required: true,
            message: '请输入器械作用',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        deviceNameMattersNeedingAttention: [
          {
            required: true,
            message: '请输入器械名称注意事项',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        deviceNameServiceCycle: [
          {
            required: true,
            message: '请输入器械使用周期',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '必须输入数字',
            trigger: 'blur'
          }
        ],
        deviceNameDateOfManufacture: [
          {
            required: true,
            message: '请选择器械生产日期',
            trigger: 'blur'
          }
        ],
        deviceNameServiceLife: [
          {
            required: true,
            message: '请输入器械名称使用寿命',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '必须输入数字',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    getDeviceNameList () {
      if (localStorage.getItem('token') === '2') this.showOperation = false
      apiGetDeviceNameListByPagination({
        currentPage: this.queryData.currentPage,
        pageSize: this.queryData.pageSize,
        device_name_name: this.queryData.deviceNameName,
        category_id: this.queryData.categoryId,
        device_name_effect: this.queryData.deviceNameEffect,
        supplier_id: this.queryData.supplierId
      }).then(res => {
        // console.log(res.data.data)
        // 将返回的器械名称数组存储
        this.deviceNameList = res.data.data
        // 将返回的总数存储
        this.total = res.data.total
      })
      apiGetCategory({}).then(res => {
        this.categoryList = res.data
      })
      apiGetSuppliers().then(res => {
        this.supplierList = res.data
      })
    },
    handleEdit (row) {
      this.dialogVisible = true
      this.deviceNameFormTitle = '修改'
      this.deviceNameForm.deviceNameId = row.device_name_id
      this.deviceNameForm.deviceNameName = row.device_name_name
      this.deviceNameForm.deviceNameServiceLife = row.device_name_service_life
      this.deviceNameForm.deviceNameDateOfManufacture = row.device_name_date_of_manufacture
      this.deviceNameForm.deviceNameServiceCycle = row.device_name_service_cycle
      this.deviceNameForm.deviceNameEffect = row.device_name_effect
      this.deviceNameForm.categoryId = row.category_id
      this.deviceNameForm.supplierId = row.supplier_id
      this.deviceNameForm.deviceNameMattersNeedingAttention = row.device_name_matters_needing_attention
    },
    openDeviceNameFromDialog () {
      this.dialogVisible = true
      this.deviceNameFormTitle = '添加'
      this.deviceNameForm.deviceNameName = ''
      this.deviceNameForm.deviceNameId = 0
      this.deviceNameForm.deviceNameServiceLife = 0
      this.deviceNameForm.deviceNameDateOfManufacture = ''
      this.deviceNameForm.deviceNameServiceCycle = 0
      this.deviceNameForm.deviceNameEffect = ''
      this.deviceNameForm.deviceNameMattersNeedingAttention = ''
      this.deviceNameForm.categoryId = 0
      this.deviceNameForm.supplierId = 0
    },
    onDeviceNameSubmit () {
      // 保存this
      const that = this
      // 初始化状态值
      let valid = false
      // 表单验证
      that.$refs.deviceNameFormRef.validate(v => {
        // 将验证结果保存
        valid = v
      })
      // 判断验证是否成功
      if (!valid) {
        this.$message.error('请输入正确内容')
        return
      }
      if (this.deviceNameForm.deviceNameId === 0) {
        apiAddDeviceName({
          device_name_name: this.deviceNameForm.deviceNameName,
          device_name_effect: this.deviceNameForm.deviceNameEffect,
          device_name_matters_needing_attention: this.deviceNameForm.deviceNameMattersNeedingAttention,
          device_name_service_cycle: this.deviceNameForm.deviceNameServiceCycle,
          device_name_date_of_manufacture: this.deviceNameForm.deviceNameDateOfManufacture,
          device_name_service_life: this.deviceNameForm.deviceNameServiceLife,
          supplier_id: this.deviceNameForm.supplierId,
          category_id: this.deviceNameForm.categoryId
        }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.getDeviceNameList()
          } else {
            this.$message.success(res.msg)
          }
        })
      } else {
        apiUpdateDeviceName({
          device_name_id: this.deviceNameForm.deviceNameId,
          device_name_name: this.deviceNameForm.deviceNameName
        }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.getDeviceNameList()
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
        apiDeleteDeviceName({
          device_name_id: row.device_name_id
        }).then(res => {
          this.$message.success(res.msg)
          this.getDeviceNameList()
        })
      })
    },
    changeCurrentPage (newPage) {
      this.currentPage = newPage
      this.getDeviceNameList()
    },
    resetForm (form) {
      this.$refs[form].resetFields()
    }
  },
  created () {
    // 执行获取器械名称数据
    this.getDeviceNameList()
  }
}
</script>

<style scoped>
.el-form-item {
  width: 350px;
}
</style>
