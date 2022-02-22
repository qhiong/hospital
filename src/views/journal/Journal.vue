<template>
  <div>
    <el-row>
      <!--      <el-col :span='3'>-->
      <!--        <el-button type='primary' plain @click='openJournalFromDialog(-1)'>添加日志-->
      <!--        </el-button>-->
      <!--      </el-col>-->
      <el-col :span='3'>
        <el-select :span='5' v-model="userId" placeholder="请选择日志用户" filterable>
          <el-option v-for="item in userList" :key="item.user_id"
                     :label="item.user_name"
                     :value="item.user_id"></el-option>
        </el-select>
      </el-col>
      <el-col :span='2' :offset='1'>
        <el-button @click='getJournalList' type="primary">查询</el-button>
      </el-col>
    </el-row>
    <el-table
      :data='journalList'
      style='width: 100%'>
      <el-table-column
        type='index'
        label='序号' width='200'>
      </el-table-column>
      <el-table-column
        prop='user_id'
        label='用户编号'
        width='200'>
      </el-table-column>
      <el-table-column
        prop='journal_time'
        label='时间'
        width='400'>
      </el-table-column>
      <el-table-column
        prop='journal_content'
        label='内容'
        width='400'>
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
  </div>

</template>

<script>
import { apiGetJournalListByPagination } from '@/request/api/journal'
import { apiGetAllUser } from '@/request/api/user'

export default {
  name: 'journal',
  data () {
    return {
      journalList: [],
      pageSize: 10,
      currentPage: 1,
      journalContent: '',
      total: 0,
      userId: null,
      userList: []
    }
  },
  methods: {
    getJournalList () {
      apiGetJournalListByPagination({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        user_id: this.userId
      }).then(res => {
        // 将返回的日志数组存储
        this.journalList = res.data.data
        // 将返回的总数存储
        this.total = res.data.total
      })
      apiGetAllUser().then(res => {
        this.userList = res.data
      })
    },
    changeCurrentPage (newPage) {
      this.currentPage = newPage
      this.getJournalList()
    }
  },
  created () {
    // 执行获取日志数据
    this.getJournalList()
  }
}
</script>

<style scoped>

</style>
