<template>
  <div>
    <el-button type='info' style="margin-bottom: 10px"><a class="a-download" :href="href + this.importDataTypeList.downModelAddress" download="">下载模板</a></el-button>
    <el-upload
      class="upload-demo"
      accept='application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      drag
      ref="uploadRef"
      method="GET"
      :action='action'
      :on-change='uploadAnalysis'
      :auto-upload="false"
      :limit='1'
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        将文件拖到此处，或 <em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          只能上传 xlsx/xls 文件
        </div>
      </template>
    </el-upload>
    <el-dialog
      title='上传数据'
      v-model='isImportDataDialog'
      width='50%' top='25vh'>
      <el-table :data='importDataList' style='width: 100%'>
        <el-table-column v-for='(item, index) in importDataTypeList.fieldList' :key='index'
                         :prop='item.value' :label='item.name'></el-table-column>
      </el-table>
      <div class='dis_play'>
        <el-button type='primary' @click='confirmImport'>确定导入</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入vuex
import store from '@/store/index'
import { apiAddDeviceNumber } from '@/request/api/deviceNumber'
import XLSX from 'xlsx'
import { ref } from 'vue'

export default {
  data () {
    return {
      // 上传文件解析地址
      action: store.state.axiosHeaderPath,
      isImportDataDialog: ref(false),
      importDataList: [],
      importDataTypeList: {
        // 标签名
        name: '器械编号',
        // 上传地址
        uploadAddress: apiAddDeviceNumber,
        // 模板下载地址
        downModelAddress: 'DeviceNumberExcelModel.xls',
        // 字段列表
        fieldList: [
          {
            name: '器械名称编号',
            value: 'device_number_id'
          },
          {
            name: '器械名称',
            value: 'device_name_id'
          }
        ]
      },
      href: store.state.fileDownPath + 'model/'
    }
  },
  methods: {
    // 上传按钮事件
    uploadAnalysis (file) {
      var files = file.raw // 获取到文件流
      const fileReader = new FileReader()
      fileReader.onload = ev => {
        try {
          const data = ev.target.result
          const workbook = XLSX.read(data, {
            type: 'binary'
          })
          for (const sheet in workbook.Sheets) {
            // 循环读取每个文件
            const sheetArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
            // 若当前sheet没有数据，则continue
            if (sheetArray.length === 0) {
              continue
            }
            for (const item in sheetArray) {
              // console.log(sheetArray[item])
              const rowTable = {}
              // 这里的rowTable的属性名注意要与上面表格的prop一致
              // sheetArray的属性名与上传的表格的列名一致
              rowTable.device_name_id = sheetArray[item].device_name_id
              rowTable.device_number_id = sheetArray[item].device_number_id
              this.importDataList.push(rowTable)
            }
          }
        } catch (e) {
          this.$message.warning('文件类型不正确！')
        }
      }
      fileReader.readAsBinaryString(files)

      // 显示导入数据对话框
      this.isImportDataDialog = ref(true)
    },
    // 确认导入按钮
    confirmImport () {
      // 当前选中类型
      const importDataType = this.importDataTypeList
      // 执行上传
      this.importDataList.forEach(async (item) => {
        await importDataType.uploadAddress(item).then(res => {
          if (res.code === 500) {
            this.$message.error(res.msg)
          }
          if (res.code === 200) {
            // 提示信息
            this.$message.success(res.msg)
          }
        }).catch((err) => {
          console.log(err)
        })
      })
      // 清空上传列表文件
      this.$refs.uploadRef.clearFiles()
      // 导入数据列表清空
      this.importDataList = []
      // 不显示导入数据对话框
      this.isImportDataDialog = ref(false)
    }
  }
}

</script>

<style lang='less' scoped>
.a-download{
  color: #f5f2f0;
  text-decoration: none;
}
</style>
