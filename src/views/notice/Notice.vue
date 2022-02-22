<template>
  <div>
    <el-row>
      <el-col :span='3'>
        <el-button type='primary' plain @click='opennoticeFromDialog(-1)'>添加公告
        </el-button>
      </el-col>
      <el-col :span='6' :offset='14'>
        <el-input
          placeholder='请输入内容'
          v-model='noticeContent'
          clearable @change='getnoticeList' suffix-icon='el-icon-search'>
        </el-input>
      </el-col>
    </el-row>
    <el-table
      :data='noticeList'
      style='width: 100%'>
      <el-table-column
        type='index'
        label='序号' width='200'>
      </el-table-column>
      <el-table-column
        prop='notice_time'
        label='开始时间'
        width='200'>
      </el-table-column>
      <el-table-column
        prop='notice_end_time'
        label='结束时间'
        width='200'>
      </el-table-column>
      <el-table-column
        prop='notice_content'
        label='内容'
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
      title="修改公告"
      width="30%"
    >
      <el-form :inline="true" :rules='noticeFormRules' ref="noticeFormRef" :model="noticeForm" class="demo-form-inline">
        <el-form-item label="开始时间" prop="noticeTime">
          <el-date-picker
            v-model="noticeForm.noticeTime"
            type="datetime"
            placeholder="请选择开始时间"
            :disabled="timeShow"
            value-format="YYYY-MM-DD HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="noticeEndTime">
          <el-date-picker
            v-model="noticeForm.noticeEndTime"
            type="datetime"
            placeholder="请选择结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="公告名称" prop="noticeContent">
          <el-input v-model="noticeForm.noticeContent"
                    type="textarea"
                    placeholder="公告内容"
                    :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onNoticeSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>
import { apiGetNoticeListByPagination, apiUpdateNotice, apiDeleteNotice, apiAddNotice } from '@/request/api/notice'

export default {
  name: 'notice',
  data () {
    return {
      noticeList: [],
      noticeFormTitle: '',
      pageSize: 10,
      currentPage: 1,
      noticeContent: '',
      timeShow: false,
      total: 0,
      dialogVisible: false,
      noticeForm: {
        noticeContent: '',
        noticeTime: '',
        noticeEndTime: '',
        noticeId: 0
      },
      // 表单验证规则
      noticeFormRules: {
        // 公告名验证规则
        noticeContent: [
          {
            required: true,
            message: '请输入公告内容',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 50 个字符',
            trigger: 'blur'
          }
        ],
        noticeEndTime: [
          {
            required: true,
            message: '请选择结束时间',
            trigger: 'blur'
          }
        ],
        noticeTime: [
          {
            required: true,
            message: '请选择开始时间',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    getnoticeList () {
      apiGetNoticeListByPagination({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        notice_content: this.noticeContent
      }).then(res => {
        // 将返回的公告数组存储
        this.noticeList = res.data.data
        // 将返回的总数存储
        this.total = res.data.total
      })
    },
    handleEdit (row) {
      this.dialogVisible = true
      this.timeShow = true
      this.noticeForm.noticeId = row.notice_id
      this.noticeForm.noticeContent = row.notice_content
      this.noticeForm.noticeTime = row.notice_time
      this.noticeForm.noticeEndTime = row.notice_end_time
    },
    opennoticeFromDialog () {
      this.timeShow = false
      this.dialogVisible = true
      this.noticeForm.noticeContent = ''
      this.noticeForm.noticeEndTime = ''
      this.noticeForm.noticeTime = ''
      this.noticeForm.noticeId = 0
    },
    onNoticeSubmit () {
      // 保存this
      const that = this
      // 初始化状态值
      let valid = false
      // 表单验证
      that.$refs.noticeFormRef.validate(v => {
        // 将验证结果保存
        valid = v
      })
      // 判断验证是否成功
      if (!valid) {
        this.$message.error('请输入正确内容')
        return
      }
      if (this.noticeForm.noticeId === 0) {
        if (!this.judgeTime()) {
          this.$message.error('时间选择错误')
        } else {
          apiAddNotice({
            notice_content: this.noticeForm.noticeContent,
            notice_time: this.noticeForm.noticeTime,
            notice_end_time: this.noticeForm.noticeEndTime
          }).then(res => {
            if (res.code === 200) {
              this.$message.success(res.msg)
              this.dialogVisible = false
              this.getnoticeList()
            } else {
              this.$message.success(res.msg)
            }
          })
        }
      } else {
        apiUpdateNotice({
          notice_id: this.noticeForm.noticeId,
          notice_content: this.noticeForm.noticeContent,
          notice_time: this.noticeForm.noticeTime,
          notice_end_time: this.noticeForm.noticeEndTime
        }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.getnoticeList()
          } else {
            this.$message.success(res.msg)
          }
        })
      }
    },
    judgeTime () {
      if (this.noticeForm.noticeEndTime <= this.noticeForm.noticeTime) {
        return false
      }
      return true
    },
    handleDelete (row) {
      this.$confirm('是否删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(_ => {
        apiDeleteNotice({
          notice_id: row.notice_id
        }).then(res => {
          this.$message.success(res.msg)
          this.getnoticeList()
        })
      })
    },
    changeCurrentPage (newPage) {
      this.currentPage = newPage
      this.getnoticeList()
    }
  },
  created () {
    // 执行获取公告数据
    this.getnoticeList()
  }
}
</script>

<style scoped>

</style>
