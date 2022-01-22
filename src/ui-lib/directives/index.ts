import { App as Application }  from 'vue'
import clickOutSide from './click-out-side'
import focus from './focus'

export default {
  install(app: Application) {
    app.use(clickOutSide)
    app.use(focus)
  },
}
