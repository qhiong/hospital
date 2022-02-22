import { apiGetCategory } from '../request/api/category'
import { apiGetDeviceName } from '../request/api/deviceName'
import { apiGetDeviceClassifications } from '../request/api/deviceClassification'
import { dataConversion } from './treeStructureDataConversion'
import { apiGetDeviceNumberAll } from '../request/api/deviceNumber'

const getOptionsNum = (options) => {
  return new Promise((resolve, reject) => {
    let categoryList = []
    let deviceNameList = []
    let deviceNumberList = []
    apiGetCategory().then(res => {
      categoryList = res.data
    })
    apiGetDeviceName().then(res => {
      deviceNameList = res.data
    })
    apiGetDeviceNumberAll().then(res => {
      deviceNumberList = res.data
    })
    apiGetDeviceClassifications().then(res => {
      options = res.data.reduce((value, item) => {
        item.children = []
        value.push(item)
        categoryList.reduce((v, t) => {
          if (item.device_classification_id === t.device_classification_id) {
            t.children = []
            item.children.push(t)
            v.push(t)
            deviceNameList.reduce((va, it) => {
              if (t.category_id === it.category_id) {
                it.children = []
                t.children.push(it)
                va.push(it)
                deviceNumberList.reduce((val, ite) => {
                  if (ite.device_name_id === it.device_name_id) {
                    it.children.push(ite)
                    val.push(ite)
                  }
                  return val
                }, [])
              }
              return va
            }, [])
          }
          return v
        }, [])
        return value
      }, [])
      options = dataConversion(options, [{
        id: 'device_classification_id',
        name: 'device_classification_name'
      }, {
        id: 'category_id',
        name: 'category_name'
      }, {
        id: 'device_name_id',
        name: 'device_name_name'
      }, {
        id: 'device_number_id',
        name: 'device_number_id'
      }])
      resolve(options)
    })
  })
}
export default getOptionsNum
