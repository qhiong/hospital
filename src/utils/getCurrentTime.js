const getCurrentTime = () => {
  // 获取当前时间并打印
  var _this = this
  const yy = new Date().getFullYear()
  const mm = new Date().getMonth() + 1
  const dd = new Date().getDate()
  const hh = new Date().getHours()
  const mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
  const ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
  _this.gettime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
  return _this.gettime
}
export default getCurrentTime
