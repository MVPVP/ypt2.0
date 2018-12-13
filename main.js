// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex/store'

import { get, post } from '@/utils/axios.js'
Vue.prototype.$get = get;
Vue.prototype.$post = post;

import './utils/common'
import './utils/permission'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);

import echarts from 'echarts'
Vue.prototype.$echarts = echarts

import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'v5MOhIsz4tPIROKshVmD4WC9UFH5UFcX'
})

Vue.config.productionTip = false

import '@/styles/common.scss'
import '@/styles/pagecommon.scss'

import {dragFunc} from './utils/directive'
Vue.directive('drag', {bind:dragFunc})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
