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
      <el-radio :label="-1">未批准</el-radio>
      <el-radio :label="0">已领取</el-radio>
      <el-radio :label="1">已归还</el-radio>
      <el-radio :label="2">不用归还</el-radio>
    </el-radio-group>
    <el-table
      :data="receiveList"
      style="width: 100%"
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
      <el-table-column prop="receive_return_time" label="归还时间" width="180"/>
      <el-table-column
        label='操作'
      >
        <template #default="scope">
          <el-button
            size="mini"
            type="danger"
            v-if="exitReveive"
            @click="handleDelete(scope.row)"
          >取消
          </el-button
          >
          <el-button
            size="mini"
            type="danger"
            v-if="scope.row.bool"
            @click="returnDevice(scope.row)"
          >归还
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { apiDeleteReceive, apiGetByState, apiUpdateReceive } from '@/request/api/receive'
import { apiGetAllUser } from '@/request/api/user'
import { apiGetDepartAll } from '@/request/api/administrativeOffice'
import { ref } from 'vue'

export default {
  name: 'Role',
  data () {
    return {
      receiveList: [],
      deviceNumberId: null,
      exitReveive: true,
      radio: ref(-1)
    }
  },
  methods: {
    async getReceiveList () {
      await apiGetByState({ receive_state: this.radio }).then(async res => {
        this.getList(res)
      })
    },
    async changeRadio (val) {
      if (val !== -1) {
        this.exitReveive = false
      } else {
        this.exitReveive = true
      }
      await apiGetByState({ receive_state: val }).then(async res => {
        this.getList(res)
      })
    },
    async getList (res) {
      await this.getOfficeId().then(ress => {
        const list = []
        res.data.forEach((item) => {
          if (item.administrative_office_id === ress) {
            if (list.length === 0) {
              list.push(item)
            } else {
              for (let i = 0; i < list.length; i++) {
                const itemL = list[i]
                if (itemL.device_name_id === item.device_name_id) {
                  if (!itemL.children) {
                    itemL.children = []
                  }
                  if (item.category_level === '二类') item.bool = true
                  itemL.children.push(item)
                  break
                } else if (i === list.length - 1) {
                  if (item.category_level === '二类') item.bool = true
                  list.push(item)
                  break
                }
              }
            }
          }
        })
        this.receiveList = list
      })
    },
    async getOfficeId () {
      let administrativeOfficeId = null
      const id = Number(localStorage.getItem('login'))
      await apiGetAllUser().then(async res => {
        const user = res.data.find(item => item.user_id === id)
        await apiGetDepartAll().then(res => {
          administrativeOfficeId = (res.data.find(t => t.user_id === user.user_id)).administrative_office_id
        })
      })
      return administrativeOfficeId
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
    returnDevice (row) {
      apiUpdateReceive({
        receive_id: row.receive_id,
        receive_state: 1,
        receive_liquidated_damages: 0
      }).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.getReceiveList()
        } else {
          this.$message.success(res.msg)
        }
      })
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
