import Vue from 'vue'
import App from './App.vue'
import router from './router'
import tableTree from 'vue-table-with-tree-grid'
import {
  Button,
  Message,
  FormItem,
  Input,
  Form,
  Container,
  Header,
  Aside,
  Main,
  MenuItem,
  Menu,
  Submenu,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Pagination,
  Tag,
  MessageBox,
  Dialog,
  Tree,
  Cascader,
  Alert,
  Tabs,
  TabPane
} from 'element-ui'

import axios from 'axios'
import './assets/fonts/iconfont.css'
import './assets/css/gobal.css'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Button)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Form)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Header)
Vue.use(Main)
Vue.use(MenuItem)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Tag)
Vue.use(Dialog)
Vue.use(Tree)
Vue.use(Cascader)
Vue.use(Tabs)
Vue.use(Alert)
Vue.use(TabPane)
Vue.component('tableTree', tableTree)

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(function(config) {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
