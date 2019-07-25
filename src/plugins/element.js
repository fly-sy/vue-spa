import Vue from 'vue'
import {
  Upload,
  CheckboxGroup,
  Checkbox,
  Steps,
  Step,
  Tabs,
  TabPane,
  Alert,
  Cascader,
  Select,
  Option,
  Tree,
  Tag,
  MessageBox,
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
  .use(Upload)
  .use(CheckboxGroup)
  .use(Checkbox)
  .use(Steps)
  .use(Step)
  .use(Tabs)
  .use(TabPane)
  .use(Alert)
  .use(Cascader)
  .use(Select)
  .use(Option)
  .use(Tree)
  .use(Tag)
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
Vue.prototype.$confirm = MessageBox.confirm



