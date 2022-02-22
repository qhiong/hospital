<template>
  <div>
    <el-row>
      <el-col :span='3'>
        <el-button type='primary' plain @click='openDeviceNumberFromDialog(-1)'>
          添加器械编号
        </el-button>
      </el-col>
      <el-col :span='4' :offset='10'>
        <el-input
          placeholder='请输入器械编号'
          v-model='deviceNumberId'
          clearable @change="getDeviceNumberList" suffix-icon='el-icon-search'>
        </el-input>
      </el-col>
      <el-col :span='2' :offset='1'>
        <el-select v-model="deviceNumberForm.deviceNameId" placeholder="请选择器械名称" filterable>
          <el-option v-for="item in deviceNameList" :key="item.device_name_id"
                     :label="item.device_name_name"
                     :value="item.device_name_id"></el-option>
        </el-select>
      </el-col>
      <el-col :span='2' :offset='1'>
        <el-button @click='getDeviceNumberByNameId' type="primary">查询</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="deviceNumberList"
      style="width: 100%;margin-top: 15px;"
      row-key="device_name_id"
      border
      lazy
      :tree-props="{ children: 'children' }"
    >
      <el-table-column
        type='index'
        label='序号' width='200'>
      </el-table-column>
      <el-table-column prop="device_number_id" label="器械编号" width="180"/>
      <el-table-column prop="device_name_name" label="器械名称" width="180"/>
      <el-table-column prop="category_name" label="所属类别" width="180"/>
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
      title="修改器械编号"
      width="30%"
    >
      <el-form :inline="true" :rules='deviceNumberFormRules' ref="deviceNumberFormRef" :model="deviceNumberForm"
               class="demo-form-inline">
        <el-form-item label="器械名称" prop="deviceNameName">
          <el-cascader
            v-model="value"
            filterable
            :options="options"
            :props="{value:'id',label:'name'}"
            @change="handleChangeSelect"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="器械编号" prop="deviceNumberName">
          <el-input v-model="deviceNumberForm.deviceNumberId" placeholder="输入器械编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onDeviceNumberSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>
import {
  apiGetDeviceNumberListByPagination,
  apiUpdateDeviceNumber,
  apiDeleteDeviceNumber,
  apiAddDeviceNumber,
  apiGetDeviceNumberAll
} from '@/request/api/deviceNumber'
import { apiGetDeviceName } from '../../request/api/deviceName'
import getOptions from '../../utils/selectDeviceNameInfo'

export default {
  name: 'deviceNumber',
  data () {
    return {
      deviceNumberList: [],
      deviceNumberFormTitle: '',
      pageSize: 10,
      currentPage: 1,
      deviceNumberId: '',
      total: 0,
      value: [],
      options: [],
      deviceClassificationList: [],
      categoryList: [],
      deviceNameList: [],
      dialogVisible: false,
      deviceNumberForm: {
        deviceNumberId: '',
        deviceNameId: 0,
        deviceNameName: '',
        id: 0
      },
      // 表单验证规则
      deviceNumberFormRules: {
        // 器械编号名验证规则
        deviceNumberId: [
          {
            required: true,
            message: '请输入器械编号名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            number: 'true',
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    async getDeviceNumberList () {
      apiGetDeviceNumberAll().then(ress => {
        this.pageSize = ress.data.length
        apiGetDeviceNumberListByPagination({
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          device_number_id: this.deviceNumberId
        }).then(res => {
        // 将返回的器械编号数组存储
          this.getList(res.data)
          // 将返回的总数存储
          this.total = this.deviceNumberList.length
        })
      })
      apiGetDeviceName().then(res => {
        this.deviceNameList = res.data
      })
      this.options = await getOptions(this.options)
    },
    getList (res) {
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
      this.deviceNumberList = list
    },
    getDeviceNumberByNameId () {
      apiGetDeviceNumberAll({}).then(res => {
        this.deviceNumberList = []
        if (res.code === 200) {
          if (res.data.length > 0) {
            res.data.forEach(item => {
              if (item.device_name_id === this.deviceNumberForm.deviceNameId) {
                this.deviceNameList.forEach(t => {
                  if (t.device_name_id === this.deviceNumberForm.deviceNameId) {
                    this.deviceNumberForm.deviceNameName = t.device_name_name
                    this.deviceNumberList.push({
                      device_number_id: item.device_number_id,
                      device_name_name: this.deviceNumberForm.deviceNameName
                    })
                  }
                })
              }
            })
          }
        }
      })
    },
    handleEdit (row) {
      this.dialogVisible = true
      this.deviceNumberFormTitle = '修改'
      this.deviceNumberForm.deviceNumberId = row.device_number_id
      this.deviceNumberForm.deviceNameId = row.device_name_id
      this.deviceNumberForm.id = 1
    },
    openDeviceNumberFromDialog () {
      this.dialogVisible = true
      this.deviceNumberFormTitle = '添加'
      this.deviceNumberForm.deviceNumberId = ''
      this.deviceNumberForm.deviceNameId = 0
      this.deviceNumberForm.id = 0
    },
    handleChangeSelect (value) {
      this.deviceNumberForm.deviceNameId = Number(value[value.length - 1])
    },
    onDeviceNumberSubmit () {
      // 保存this
      const that = this
      // 初始化状态值
      let valid = false
      // 表单验证
      that.$refs.deviceNumberFormRef.validate(v => {
        // 将验证结果保存
        valid = v
      })
      // 判断验证是否成功
      if (!valid) {
        this.$message.error('请输入正确内容')
        return
      }
      if (this.deviceNumberForm.id === 0) {
        apiAddDeviceNumber({
          device_number_id: this.deviceNumberForm.deviceNumberId,
          device_name_id: this.deviceNumberForm.deviceNameId
        }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.getDeviceNumberList()
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        apiUpdateDeviceNumber({
          device_number_id: this.deviceNumberForm.deviceNumberId
        }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.getDeviceNumberList()
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    handleDelete (row) {
      this.$confirm('是否删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(_ => {
        apiDeleteDeviceNumber({
          device_number_id: row.device_number_id
        }).then(res => {
          this.$message.success(res.msg)
          this.getDeviceNumberList()
        })
      })
    },
    changeCurrentPage (newPage) {
      this.currentPage = newPage
      this.getDeviceNumberList()
    }
  },
  created () {
    // 执行获取器械编号数据
    this.getDeviceNumberList()
  }
}
</script>

<style scoped>
.el-form-item {
  width: 350px;
}
</style>
