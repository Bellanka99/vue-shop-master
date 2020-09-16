import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
    //将message组件挂载到了原型上，通过this就可以访问
Vue.prototype.$message = Message