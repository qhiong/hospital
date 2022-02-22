<template>
  <div class="block">
    <el-timeline v-for="item in noticeList" :key="item.notice_id">
      <el-timeline-item :timestamp="item.notice_time" placement="top">
        <el-card>
          <h4>{{ item.notice_content }}</h4>
          <p>截止于 {{ item.notice_end_time }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { apiGetNotices } from '../../request/api/notice'

export default {
  name: 'DisplayNotice',
  data () {
    return {
      noticeList: []
    }
  },
  methods: {
    getNoticeList () {
      apiGetNotices().then(res => {
        this.noticeList = res.data
      })
    }
  },
  created () {
    this.getNoticeList()
  }
}
</script>

<style scoped>

</style>
