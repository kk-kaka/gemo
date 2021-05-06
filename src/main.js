import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { Button, Message, FormItem, Input, Form } from 'element-ui'

import axios from 'axios'
import './assets/fonts/iconfont.css'
import './assets/css/gobal.css'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Button)
Vue.use(Message)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Form)
Vue.config.productionTip = false
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

Vue.prototype.$message = Message
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
