import Vue from 'vue'
import { Button,Form, FormItem,Input } from 'element-ui'
//导入信息提示框
import {Message} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
//挂载在vue的对象上，可以通过this访问
Vue.prototype.$message = Message
