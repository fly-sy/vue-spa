import Vue from 'vue'
import {
  Dialog,
  Pagination,
  Tooltip,
  Switch,
  Table,
  TableColumn,
  Row,
  Col,
  Card,
  Breadcrumb,
  BreadcrumbItem,
  Menu,
  Submenu,
  MenuItem,
  Button,
  Form, FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main

} from 'element-ui'

Vue
  .use(Dialog)
  .use(Pagination)
  .use(Tooltip)
  .use(Switch)
  .use(Table)
  .use(TableColumn)
  .use(Row)
  .use(Col)
  .use(Card)
  .use(Breadcrumb)
  .use(BreadcrumbItem)
  .use(Menu)
  .use(Submenu)
  .use(MenuItem)
  .use(Button)
  .use(Form).use(FormItem)
  .use(Input)
  .use(Container)
  .use(Header)
  .use(Aside)
  .use(Main)


Vue.prototype.$message = Message


