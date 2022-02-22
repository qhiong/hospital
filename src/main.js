import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import 'dayjs/locale/zh-cn'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import 'element-plus/lib/utils/icon'
import './assets/icon/iconfont.css'
import 'echarts/lib/chart/line'
import * as ElIcons from '@element-plus/icons'

const app = createApp(App)
for (const name in ElIcons) {
  app.component(name, (ElIcons)[name])
}

app.use(Element, { locale })
app
  .use(store)
  .use(router)
  .mount('#app')
