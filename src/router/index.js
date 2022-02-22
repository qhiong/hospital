import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    // 首页路径
    path: '/',
    redirect: '/index'
  },
  {
    path: '/login',
    name: 'Login',
    component: import('@/views/user/Login')
  },
  {
    path: '/index',
    name: 'Index',
    component: import('@/views/Home'),
    children: [
      // 首页
      {
        path: '/index',
        component: () => import('@/views/index/Index')
      },
      {
        path: '/personalInfo',
        component: () => import('@/views/user/PersonalInfo')
      },
      {
        path: '/role',
        component: () => import('@/views/role/Role')
      },
      {
        path: '/user',
        component: () => import('@/views/user/User')
      },
      {
        path: '/administrativeOffice',
        component: () => import('@/views/administrativeOffice/administrativeOffice')
      },
      {
        path: '/department',
        component: () => import('@/views/department/Department')
      },
      {
        path: '/supplier',
        component: () => import('@/views/supplier/Supplier')
      },
      {
        path: '/notice',
        component: () => import('@/views/notice/Notice')
      },
      {
        path: '/journal',
        component: () => import('@/views/journal/Journal')
      },
      {
        path: '/deviceClassification',
        component: () => import('@/views/deviceClassification/DeviceClassification')
      },
      {
        path: '/category',
        component: () => import('@/views/category/Category')
      },
      {
        path: '/deviceName',
        component: () => import('@/views/deviceName/DeviceName')
      },
      {
        path: '/deviceNumber',
        component: () => import('@/views/deviceNumber/DeviceNumber')
      },
      {
        path: '/warehousing',
        component: () => import('@/views/warehousing/Warehousing')
      },
      {
        path: '/receive',
        component: () => import('@/views/receive/Receive')
      },
      {
        path: '/receiveAllD',
        component: () => import('@/views/receiveAllD/ReceiveAllD')
      },
      {
        path: '/receiveAllA',
        component: () => import('@/views/receiveAllA/ReceiveAllA')
      },
      {
        path: '/repair',
        component: () => import('@/views/repair/Repair')
      },
      {
        path: '/reportRepair',
        component: () => import('@/views/reportRepair/ReportRepair')
      },
      {
        path: '/departReceive',
        component: () => import('@/views/departReceive/DepartReceive')
      },
      {
        path: '/interCount',
        component: () => import('@/views/interCount/InterCount')
      },
      {
        path: '/standard',
        component: () => import('@/views/standard/Standard')
      },
      {
        path: '/displayNotice',
        component: () => import('@/views/displayNotice/DisplayNotice')
      }
    ]
  },
  {
    path: '/index',
    name: 'Index',
    component: import('@/views/Home'),
    children: [
      // 首页
      {
        path: '/index',
        component: () => import('@/views/index/Index')
      },
      {
        path: '/personalInfo',
        component: () => import('@/views/user/PersonalInfo')
      },
      {
        path: '/role',
        component: () => import('@/views/role/Role')
      },
      {
        path: '/user',
        component: () => import('@/views/user/User')
      },
      {
        path: '/administrativeOffice',
        component: () => import('@/views/administrativeOffice/administrativeOffice')
      },
      {
        path: '/department',
        component: () => import('@/views/department/Department')
      },
      {
        path: '/supplier',
        component: () => import('@/views/supplier/Supplier')
      },
      {
        path: '/notice',
        component: () => import('@/views/notice/Notice')
      },
      {
        path: '/journal',
        component: () => import('@/views/journal/Journal')
      },
      {
        path: '/deviceClassification',
        component: () => import('@/views/deviceClassification/DeviceClassification')
      },
      {
        path: '/category',
        component: () => import('@/views/category/Category')
      },
      {
        path: '/deviceName',
        component: () => import('@/views/deviceName/DeviceName')
      },
      {
        path: '/deviceNumber',
        component: () => import('@/views/deviceNumber/DeviceNumber')
      },
      {
        path: '/warehousing',
        component: () => import('@/views/warehousing/Warehousing')
      },
      {
        path: '/receive',
        component: () => import('@/views/receive/Receive')
      },
      {
        path: '/receiveAllD',
        component: () => import('@/views/receiveAllD/ReceiveAllD')
      },
      {
        path: '/receiveAllA',
        component: () => import('@/views/receiveAllA/ReceiveAllA')
      },
      {
        path: '/repair',
        component: () => import('@/views/repair/Repair')
      },
      {
        path: '/reportRepair',
        component: () => import('@/views/reportRepair/ReportRepair')
      },
      {
        path: '/departReceive',
        component: () => import('@/views/departReceive/DepartReceive')
      },
      {
        path: '/interCount',
        component: () => import('@/views/interCount/InterCount')
      },
      {
        path: '/standard',
        component: () => import('@/views/standard/Standard')
      },
      {
        path: '/displayNotice',
        component: () => import('@/views/displayNotice/DisplayNotice')
      }
    ]
  },
  {
    path: '/index',
    name: 'Index',
    component: import('@/views/Home'),
    children: [
      // 首页
      {
        path: '/index',
        component: () => import('@/views/index/Index')
      },
      {
        path: '/personalInfo',
        component: () => import('@/views/user/PersonalInfo')
      },
      {
        path: '/role',
        component: () => import('@/views/role/Role')
      },
      {
        path: '/user',
        component: () => import('@/views/user/User')
      },
      {
        path: '/administrativeOffice',
        component: () => import('@/views/administrativeOffice/administrativeOffice')
      },
      {
        path: '/department',
        component: () => import('@/views/department/Department')
      },
      {
        path: '/supplier',
        component: () => import('@/views/supplier/Supplier')
      },
      {
        path: '/notice',
        component: () => import('@/views/notice/Notice')
      },
      {
        path: '/journal',
        component: () => import('@/views/journal/Journal')
      },
      {
        path: '/deviceClassification',
        component: () => import('@/views/deviceClassification/DeviceClassification')
      },
      {
        path: '/category',
        component: () => import('@/views/category/Category')
      },
      {
        path: '/deviceName',
        component: () => import('@/views/deviceName/DeviceName')
      },
      {
        path: '/deviceNumber',
        component: () => import('@/views/deviceNumber/DeviceNumber')
      },
      {
        path: '/warehousing',
        component: () => import('@/views/warehousing/Warehousing')
      },
      {
        path: '/receive',
        component: () => import('@/views/receive/Receive')
      },
      {
        path: '/receiveAllD',
        component: () => import('@/views/receiveAllD/ReceiveAllD')
      },
      {
        path: '/receiveAllA',
        component: () => import('@/views/receiveAllA/ReceiveAllA')
      },
      {
        path: '/repair',
        component: () => import('@/views/repair/Repair')
      },
      {
        path: '/reportRepair',
        component: () => import('@/views/reportRepair/ReportRepair')
      },
      {
        path: '/departReceive',
        component: () => import('@/views/departReceive/DepartReceive')
      },
      {
        path: '/interCount',
        component: () => import('@/views/interCount/InterCount')
      },
      {
        path: '/standard',
        component: () => import('@/views/standard/Standard')
      },
      {
        path: '/displayNotice',
        component: () => import('@/views/displayNotice/DisplayNotice')
      }
    ]
  },
  {
    path: '/index',
    name: 'Index',
    component: import('@/views/Home'),
    children: [
      // 首页
      {
        path: '/index',
        component: () => import('@/views/index/Index')
      },
      {
        path: '/personalInfo',
        component: () => import('@/views/user/PersonalInfo')
      },
      {
        path: '/role',
        component: () => import('@/views/role/Role')
      },
      {
        path: '/user',
        component: () => import('@/views/user/User')
      },
      {
        path: '/administrativeOffice',
        component: () => import('@/views/administrativeOffice/administrativeOffice')
      },
      {
        path: '/department',
        component: () => import('@/views/department/Department')
      },
      {
        path: '/supplier',
        component: () => import('@/views/supplier/Supplier')
      },
      {
        path: '/notice',
        component: () => import('@/views/notice/Notice')
      },
      {
        path: '/journal',
        component: () => import('@/views/journal/Journal')
      },
      {
        path: '/deviceClassification',
        component: () => import('@/views/deviceClassification/DeviceClassification')
      },
      {
        path: '/category',
        component: () => import('@/views/category/Category')
      },
      {
        path: '/deviceName',
        component: () => import('@/views/deviceName/DeviceName')
      },
      {
        path: '/deviceNumber',
        component: () => import('@/views/deviceNumber/DeviceNumber')
      },
      {
        path: '/warehousing',
        component: () => import('@/views/warehousing/Warehousing')
      },
      {
        path: '/receive',
        component: () => import('@/views/receive/Receive')
      },
      {
        path: '/receiveAllD',
        component: () => import('@/views/receiveAllD/ReceiveAllD')
      },
      {
        path: '/receiveAllA',
        component: () => import('@/views/receiveAllA/ReceiveAllA')
      },
      {
        path: '/repair',
        component: () => import('@/views/repair/Repair')
      },
      {
        path: '/reportRepair',
        component: () => import('@/views/reportRepair/ReportRepair')
      },
      {
        path: '/departReceive',
        component: () => import('@/views/departReceive/DepartReceive')
      },
      {
        path: '/interCount',
        component: () => import('@/views/interCount/InterCount')
      },
      {
        path: '/standard',
        component: () => import('@/views/standard/Standard')
      },
      {
        path: '/displayNotice',
        component: () => import('@/views/displayNotice/DisplayNotice')
      },
      {
        path: '/receiveCount',
        component: () => import('@/views/receiveCount/ReceiveCount')
      },
      {
        path: '/importDevice',
        component: () => import('@/views/importDevice/ImportDevice')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
