import axios from 'axios'

axios.defaults.baseURL = 'http://82.157.50.160:9002/index/'

const http = axios

// 请求响应拦截器
http.interceptors.response.use(
  config => {
    // eslint-disable-next-line eqeqeq
    return config
  }
)

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get (url, params) {
  return new Promise((resolve, reject) => {
    http
      .get(url, {
        params: params
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

/**
 * post方法，对应post请求
 **/
export function post (url, params) {
  return new Promise((resolve, reject) => {
    // indices false 将数组a[0]=1&a[1]=2 转换为 a=1&a=2
    axios
      .post(url, params)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}
