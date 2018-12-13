import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

import loginPage from '@/views/login/login.vue'
import mainPage from '@/views/main/main.vue'
import aboutPage from '@/views/about/about.vue'
import nopermissionPage from '@/views/no/nopermission.vue'
import errorPage from '@/views/no/404.vue'

import resourcePage from '@/views/publish/resource.vue'
import modelmanagePage from '@/views/publish/modelmanage.vue'
import programmanagePage from '@/views/publish/programmanage.vue'
import noticepublishPage from '@/views/publish/noticepublish.vue'
import mediapublishPage from '@/views/publish/mediapublish.vue'

import equiptypePage from '@/views/equipment/equiptype.vue'
import equipcontrolPage from '@/views/equipment/equipcontrol.vue'
import equipmanagePage from '@/views/equipment/equipmanage.vue'
import equipcountPage from '@/views/equipment/equipcount.vue'
import equipanalysisPage from '@/views/equipment/equipanalysis.vue'
import equipdetailPage from '@/views/equipment/equipdetail.vue'

import housemanagePage from '@/views/house/housemanage.vue'

import livemanagePage from '@/views/live/livemanage.vue'

import doormanagePage from '@/views/doorcard/doormanage.vue'
import dooropenPage from '@/views/doorcard/dooropen.vue'
import doordetailPage from '@/views/doorcard/doordetail.vue'
import doorauthorizePage from '@/views/doorcard/doorauthorize.vue'

import applicationPage from '@/views/version/application.vue'
import versionpublicPage from '@/views/version/versionpublic.vue'

import areamanagePage from '@/views/permission/areamanage.vue'
import areaadminPage from '@/views/permission/areaadmin.vue'
import twoplatformPage from '@/views/permission/twoplatform.vue'

// 模版
import topbottomlayoutPage from '@/views/model/topbottom.vue'
import topleftbottomlayoutPage from '@/views/model/topleftbottom.vue'

Vue.use(Router)

export const routeArray = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'loginPage',
    component: loginPage
  },
  {
    path: '/404',
    name: '404',
    component: errorPage
  },
  {
    path: '/',
    name: '发布系统',
    component: mainPage,
    meta: {
      icon: 'iconfont icon-xinxifabu'
    },
    children: [
      {
        path: '/resource',
        name: '资源管理',
        component: resourcePage,
      },
      {
        path: '/modelmanage',
        name: '版面模版管理',
        component: modelmanagePage
      },
      {
        path: '/programmanage',
        name: '节目单管理',
        component: programmanagePage,
      },
      {
        path: '/noticepublish',
        name: '公告发布',
        component: noticepublishPage
      },
      {
        path: '/mediapublish',
        name: '广告发布',
        component: mediapublishPage
      }
    ]
  },
  {
    path: '/',
    name: '设备',
    component: mainPage,
    meta: {
      icon: 'iconfont icon-shebeiguanli'
    },
    children: [
      {
        path: '/equiptype',
        name: '设备型号管理',
        component: equiptypePage
      },
      {
        path: '/equipmanage',
        name: '设备管理',
        component: equipmanagePage
      },
      {
        path: '/equipcontrol',
        name: '设备运行监控',
        component: equipcontrolPage
      },
      {
        path: '/equipcount',
        name: '设备离线情况统计',
        component: equipcountPage
      },
      {
        path: '/equipanalysis',
        name: '设备离线情况分析',
        component: equipanalysisPage
      },
      {
        path: '/equipdetail',
        name: '设备离线详情',
        component: equipdetailPage
      },
    ]
  },
  {
    path: '/',
    name: '房产',
    component: mainPage,
    meta: {
      icon: 'iconfont icon-fangchanguanli'
    },
    children: [
      {
        path: '/housemanage',
        name: '房产管理',
        component: housemanagePage
      }
    ]
  },
  {
    path: '/',
    name: '住户',
    component: mainPage,
    meta: {
      icon: 'iconfont icon-zhuhuguanli'
    },
    children: [
      {
        path: '/livemanage',
        name: '住户管理',
        component: livemanagePage
      }
    ]
  },
  {
    path: '/',
    name: '门禁卡',
    component: mainPage,
    meta: {
      icon: 'iconfont icon-menjinguanli'
    },
    children: [
      {
        path: '/doormanage',
        name: '门禁卡管理',
        component: doormanagePage
      },
      {
        path: '/doordetail/:id',
        name: '门禁卡详情',
        component: doordetailPage,
        meta: {
          breadNumber: 2,
        }
      },
      {
        path: '/doorauthorize/:id',
        name: '门禁卡授权',
        component: doorauthorizePage,
        meta: {
          breadNumber: 2,
        }
      },
      {
        path: '/dooropen',
        name: '门禁卡开卡',
        component: dooropenPage
      },
    ]
  },
  {
    path: '/',
    name: '版本管理',
    component: mainPage,
    meta: {
      icon: 'iconfont icon-banbenguanli'
    },
    children: [
      {
        path: '/application',
        name: '应用管理',
        component: applicationPage
      },
      {
        path: '/versionpublic',
        name: '版本发布',
        component: versionpublicPage
      },
    ]
  },
  {
    path: '/',
    name: '域权限',
    component: mainPage,
    meta: {
      icon: 'iconfont icon-quanxianguanli'
    },
    children: [
        {
            path: '/areamanage',
            name: '域管理',
            component: areamanagePage
        },
        {
            path: '/areaadmin',
            name: '域管理员',
            component: areaadminPage
        },
        {
            path: '/twoplatform',
            name: '二级平台管理员',
            component: twoplatformPage
        },
    ]
  },
  {
    path: '/',
    name: '前端开发模版',
    component: mainPage,
    meta: {
      icon: 'iconfont icon-xinxifabu1'
    },
    children: [
      {
        path: '/topbottomlayout',
        name: '上下标准结构',
        component: topbottomlayoutPage
      },
      {
        path: '/topleftbottomlayout',
        name: '有树状图结构',
        component: topleftbottomlayoutPage
      },
    ]
  },
  {
    path: '/',
    name: '开发调研',
    component: mainPage,
    
    meta: {
      icon: 'iconfont icon-zhanghaoguanli1'
    },
    children: [
      {
        path: '/about',
        name: '关于',
        component: aboutPage
      },
      {
        path: '/HelloWorld',
        name: '你好',
        component: HelloWorld
      },
    ]
  },
  // {
  //   path: '/',
  //   name: '导航导航导航导航导航',
  //   component: mainPage,
  //   meta: {
  //     icon: 'el-icon-menu'
  //   },
  //   children: [
  //     {
  //       path: '/about444',
  //       name: '关于',
  //       component: aboutPage
  //     },
  //     {
  //       path: '/HelloWorld555',
  //       name: '你好',
  //       component: HelloWorld
  //     },
  //   ]
  // },
  // {
  //   path: '/',
  //   name: '导航一',
  //   component: mainPage,
  //   meta: {
  //     icon: 'el-icon-location'
  //   },
  //   children: [
  //     {
  //       path: '/about2',
  //       name: '选项111',
  //       component: aboutPage
  //     },
  //     {
  //       path: '/HelloWorld2',
  //       name: '选项222',
  //       component: HelloWorld
  //     },
  //     {
  //       path: '/nopermission',
  //       name: '选项nopermissionPage',
  //       component: nopermissionPage
  //     },
  //     {
  //       path: '/about2',
  //       name: '选项111',
  //       component: aboutPage
  //     },
  //     {
  //       path: '/HelloWorld2',
  //       name: '选项222',
  //       component: HelloWorld
  //     },
  //     {
  //       path: '/nopermission',
  //       name: '选项nopermissionPage',
  //       component: nopermissionPage
  //     },
  //     {
  //       path: '/about2',
  //       name: '选项111',
  //       component: aboutPage
  //     },
  //     {
  //       path: '/HelloWorld2',
  //       name: '选项222',
  //       component: HelloWorld
  //     },
  //     {
  //       path: '/nopermission',
  //       name: '选项nopermissionPage',
  //       component: nopermissionPage
  //     },
  //     {
  //       path: '/about2',
  //       name: '选项111',
  //       component: aboutPage
  //     },
  //     {
  //       path: '/HelloWorld2',
  //       name: '选项222',
  //       component: HelloWorld
  //     },
  //     {
  //       path: '/nopermission',
  //       name: '选项nopermissionPage',
  //       component: nopermissionPage
  //     },
  //     {
  //       path: '/about2',
  //       name: '选项111',
  //       component: aboutPage
  //     },
  //     {
  //       path: '/HelloWorld2',
  //       name: '选项222',
  //       component: HelloWorld
  //     },
  //     {
  //       path: '/nopermission',
  //       name: '选项nopermissionPage',
  //       component: nopermissionPage
  //     },
  //     {
  //       path: '/about2',
  //       name: '选项111',
  //       component: aboutPage
  //     },
  //     {
  //       path: '/HelloWorld2',
  //       name: '选项222',
  //       component: HelloWorld
  //     },
  //     {
  //       path: '/nopermission',
  //       name: '选项nopermissionPage',
  //       component: nopermissionPage
  //     },
  //   ]
  // },

]

export default new Router({
  routes: routeArray
})
