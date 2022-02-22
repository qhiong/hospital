import { createStore } from 'vuex'

export default createStore({
  state: {
    // 文件下载地址
    fileDownPath: 'http://localhost:8080/uploads/',
    // 文件上传地址
    fileUploadPath: 'http://localhost:8080/upload/singleUpload',
    // 网络请求地址
    axiosHeaderPath: 'http://localhost:8080'
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
