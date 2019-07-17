import Vue from 'vue'
import {
  Button,
  Form, FormItem,
  Input,
  Message
} from 'element-ui'

Vue
  .use(Button)
  .use(Form).use(FormItem)
  .use(Input)


Vue.prototype.$message = Message


