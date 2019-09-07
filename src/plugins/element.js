import Vue from 'vue'
import {
  Dialog,
  Autocomplete,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  MenuItem,
  Input,
  Button,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Icon,
  Notification,
} from 'element-ui'

Vue.use(Dialog)
Vue.use(Autocomplete)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Icon)

Vue.prototype.$notify = Notification
