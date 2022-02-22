// 定义修改之前属性名数组
let name = []
const ass = (data) => {
  // 返回数组
  const item = []
  // 将数据循环
  data.forEach(list => {
    // 添加对象
    const newData = {}
    // 循环属性名数组
    name.forEach(n => {
      // 判断是否存在这个属性
      if (typeof list[n.id] !== 'undefined') {
        // 存在赋值
        newData.id = list[n.id]
      }
      if (typeof list[n.name] !== 'undefined') {
        newData.name = list[n.name]
      }
    })
    let t = null
    if (list[name[name.length - 1].id] === list.id) {
      t = []
    }
    const hasChildren = Array.isArray(list.children) && list.children.length > 0
    if (hasChildren) newData.children = ass(list.children) // 如果还有子集，就再次调用自己
    else if (t) newData.disabled = 'true'
    item.push(newData)
  })
  return item
}
const dataConversion = (data, name1) => {
  // 将要修改属性名数组
  name = name1
  // 递归修改
  return ass(data)
}
// 导出将树形结构数据转化固定格式工具
export { dataConversion }
// 导出级联选择器数据处理工具类 转数值
export const arrayToNumeric = p => {
  p = p === '' || p === null ? 0 : p
  p = Array.isArray(p) ? p[p.length - 1] : p
  return p
}
// 导出级联选择器数据处理工具类 转字符串
export const arrayToString = p => {
  p = p === '' || p === null ? '' : p
  p = Array.isArray(p) ? p[p.length - 1] : p
  return p
}
