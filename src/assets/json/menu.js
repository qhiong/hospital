const DATA = [
  {
    menuAddress: '/Role',
    menuId: 5,
    menuName: '角色管理',
    authority: ['1']
  },
  {
    menuAddress: '/user',
    menuId: 2,
    menuName: '用户管理',
    authority: ['1']
  },
  {
    menuAddress: '/administrativeOffice',
    menuId: 1,
    menuName: '科室管理',
    authority: ['1']
  },
  {
    menuAddress: '/department',
    menuId: 3,
    menuName: '部门管理',
    authority: ['1']
  },
  {
    menuAddress: '/supplier',
    menuId: 4,
    menuName: '供应商管理',
    authority: ['1']
  },
  {
    menuAddress: '/journal',
    menuId: 7,
    menuName: '日志管理',
    authority: ['1']
  },
  {
    children: [
      {
        menuAddress: '/deviceClassification',
        menuId: 9,
        menuName: '器械分类管理',
        authority: ['1', '3']
      },
      {
        menuAddress: '/category',
        menuId: 10,
        menuName: '器械类别管理',
        authority: ['1', '3']
      },
      {
        menuAddress: '/deviceName',
        menuId: 11,
        menuName: '器械名称管理',
        authority: ['3']
      }
    ],
    menuId: 99,
    menuName: '器械管理',
    authority: ['3', '1']
  },
  {
    menuAddress: '/deviceName',
    menuId: 20,
    menuName: '器械名称查看',
    authority: ['2']
  },
  {
    children: [
      {
        menuAddress: '/deviceNumber',
        menuId: 12,
        menuName: '器械编号管理',
        authority: ['3']
      },
      {
        menuAddress: '/importDevice',
        menuId: 13,
        menuName: '器械编号导入',
        authority: ['3']
      }
    ],
    menuId: 14,
    menuName: '器械入库',
    authority: ['3']
  },
  {
    menuAddress: '/receive',
    menuId: 15,
    menuName: '申请领取',
    authority: ['2']
  },
  {
    menuAddress: '/receiveAllD',
    menuId: 16,
    menuName: '查看领取记录',
    authority: ['2']
  },
  {
    menuAddress: '/receiveAllA',
    menuId: 17,
    menuName: '审批领取申请',
    authority: ['3']
  },
  {
    menuAddress: '/receiveCount',
    menuId: 26,
    menuName: '科室领取统计',
    authority: ['3']
  },
  {
    menuAddress: '/repair',
    menuId: 18,
    menuName: '申请报修',
    authority: ['2']
  },
  {
    menuAddress: '/reportRepair',
    menuId: 21,
    menuName: '报修审核',
    authority: ['3']
  },
  {
    menuAddress: '/departReceive',
    menuId: 22,
    menuName: '部门领取',
    authority: ['2']
  },
  {
    menuAddress: '/interCount',
    menuId: 23,
    menuName: '内部领取统计',
    authority: ['2']
  },
  {
    menuAddress: '/standard',
    menuId: 24,
    menuName: '器械领取标准管理',
    authority: ['1']
  },
  {
    menuAddress: '/displayNotice',
    menuId: 25,
    menuName: '查看公告',
    authority: ['2']
  },
  {
    menuAddress: '/notice',
    menuId: 6,
    menuName: '公告管理',
    authority: ['1', '3']
  }
]
export default DATA
