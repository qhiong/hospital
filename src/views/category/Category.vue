<template>
  <div>
    <el-row>
      <el-col :span='5'>
        <el-input
          placeholder='请输入名称'
          v-model='queryObject.categoryName'
          clearable>
        </el-input>
      </el-col>
      <el-col :span='5' :offset='1'>
        <el-select v-model="queryObject.deviceClassificationId" placeholder="请选择分类" filterable>
          <el-option v-for="item in deviceClassificationList" :key="item.device_classification_id"
                     :label="item.device_classification_name"
                     :value="item.device_classification_id"></el-option>
        </el-select>
      </el-col>
      <el-col :span='5' :offset='1'>
        <el-select :span='5' v-model="queryObject.categoryLevel" placeholder="请选择分类" filterable>
          <el-option v-for="(item,index) in deviceLevelList" :key="index"
                     :label="item"
                     :value="item"></el-option>
        </el-select>
      </el-col>
      <el-col :span='2'>
        <el-button @click='getCategoryList' type="primary">查询</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px;">
      <el-col :span='3'>
        <el-button type='primary' plain @click='openCategoryFromDialog(-1)'>添加类别
        </el-button>
      </el-col>
    </el-row>
    <el-table
      :data='categoryList'
      style='width: 100%'>
      <el-table-column
        type='index'
        label='序号' width='200'>
      </el-table-column>
      <el-table-column
        prop='category_name'
        label='名称'
        width='300'>
      </el-table-column>
      <el-table-column
        prop='device_classification_name'
        label='所属分类'
        width='300'>
      </el-table-column>
      <el-table-column
        prop='category_level'
        label='类别级别'
        width='300'>
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
      :page-size="queryObject.pageSize"
      :pager-count="11"
      layout="prev, pager, next"
      :total="total"
    >
    </el-pagination>
    <el-dialog
      v-model="dialogVisible"
      title="修改类别"
      width="30%"
    >
      <el-form :inline="true" :rules='categoryFormRules' ref="categoryFormRef" :model="categoryForm"
               class="demo-form-inline">
        <el-form-item label="类别名称" prop="categoryName">
          <el-input v-model="categoryForm.categoryName" placeholder="类别名称"></el-input>
        </el-form-item>
        <el-form-item label="所属分类" prop="deviceClassificationId">
          <el-select v-model="categoryForm.deviceClassificationId" placeholder="请选择分类" filterable>
            <el-option v-for="item in deviceClassificationList" :key="item.device_classification_id"
                       :label="item.device_classification_name"
                       :value="item.device_classification_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属分类" prop="deviceClassificationId">
          <el-select v-model="categoryForm.categoryLevel" placeholder="请选择分类" filterable>
            <el-option v-for="(item,index) in deviceLevelList" :key="index"
                       :label="item"
                       :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onCategorySubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>
import {
  apiGetCategoryListByPagination,
  apiUpdateCategory,
  apiDeleteCategory,
  apiAddCategory
} from '@/request/api/category'
import { apiGetDeviceClassifications } from '@/request/api/deviceClassification'

export default {
  name: 'category',
  data () {
    return {
      categoryList: [],
      categoryFormTitle: '',
      queryObject: {
        pageSize: 10,
        currentPage: 1,
        categoryName: '',
        deviceClassificationId: 5,
        categoryLevel: '一类'
      },
      total: 0,
      dialogVisible: false,
      deviceClassificationList: [],
      deviceLevelList: {
        1: '一类',
        2: '二类',
        3: '三类'
      },
      categoryForm: {
        categoryName: '',
        categoryId: 0,
        deviceClassificationId: 0,
        categoryLevel: ''
      },
      // 表单验证规则
      categoryFormRules: {
        // 类别名验证规则
        categoryName: [
          {
            required: true,
            message: '请输入类别名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        deviceClassificationId: [
          {
            required: true,
            message: '请选择分类',
            trigger: 'blur'
          }
        ],
        categoryLevel: [
          {
            required: true,
            message: '请选择类别级别',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    getCategoryList () {
      apiGetCategoryListByPagination({
        currentPage: this.queryObject.currentPage,
        pageSize: this.queryObject.pageSize,
        category_name: this.queryObject.categoryName,
        device_classification_id: this.queryObject.deviceClassificationId,
        category_level: this.queryObject.categoryLevel
      }).then(res => {
        // 将返回的类别数组存储
        this.categoryList = res.data.data
        // 将返回的总数存储
        this.total = res.data.total
      })
    },
    getDeviceClassificationsList () {
      apiGetDeviceClassifications({}).then(res => {
        this.deviceClassificationList = res.data
      })
    },
    handleEdit (row) {
      this.dialogVisible = true
      this.categoryForm.categoryId = row.category_id
      this.categoryForm.categoryName = row.category_name
      this.categoryForm.deviceClassificationId = row.device_classification_id
      this.categoryForm.categoryLevel = row.category_level
    },
    openCategoryFromDialog () {
      this.dialogVisible = true
      this.categoryForm.categoryName = ''
      this.categoryForm.categoryId = 0
      this.categoryForm.deviceClassificationId = 0
      this.categoryForm.categoryLevel = ''
    },
    onCategorySubmit () {
      // 保存this
      const that = this
      // 初始化状态值
      let valid = false
      // 表单验证
      that.$refs.categoryFormRef.validate(v => {
        // 将验证结果保存
        valid = v
      })
      // 判断验证是否成功
      if (!valid) {
        this.$message.error('请输入正确内容')
        return
      }
      if (this.categoryForm.categoryId === 0) {
        apiAddCategory({
          category_name: this.categoryForm.categoryName,
          device_classification_id: this.categoryForm.deviceClassificationId,
          category_level: this.categoryForm.categoryLevel
        }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.getCategoryList()
          } else {
            this.$message.success(res.msg)
          }
        })
      } else {
        apiUpdateCategory({
          category_name: this.categoryForm.categoryName,
          device_classification_id: this.categoryForm.deviceClassificationId,
          category_level: this.categoryForm.categoryLevel,
          category_id: this.categoryForm.categoryId
        }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.getCategoryList()
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
        apiDeleteCategory({
          category_id: row.category_id
        }).then(res => {
          this.$message.success(res.msg)
          this.getCategoryList()
        })
      })
    },
    changeCurrentPage (newPage) {
      this.queryObject.currentPage = newPage
      this.getCategoryList()
    }
  },
  created () {
    // 执行获取类别数据
    this.getCategoryList()
    this.getDeviceClassificationsList()
  }
}
</script>

<style scoped>

</style>
