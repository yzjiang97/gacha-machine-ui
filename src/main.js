/*
 * @Author: yz.jiang
 * @Date: 2025-03-28 10:26:18
 * @LastEditTime: 2025-03-28 11:30:18
 * @LastEditors: yz.jiang
 * @Description: 
 * @FilePath: /draw-lots-ui/src/main.js
 */
import Vue from 'vue'
import App from './App.vue'


import ElementUI from 'element-ui';
import router from './router'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css';

import '../src/assets/css/theme.css'
import '../src/assets/css/component.css'
import Component from './components'
import Modules from './modules/index'


Vue.use(ElementUI);
Vue.use(Component)
Vue.use(Modules)


Vue.config.productionTip = false

new Vue({
  router,store,
  render: h => h(App)
}).$mount('#app')
