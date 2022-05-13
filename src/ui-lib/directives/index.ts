import { App as Application }  from 'vue'
import clickOutSide from './click-out-side'
import focus from './focus'
import drag from './drag'

export default {
  install(app: Application) {
    app.use(clickOutSide)
    app.use(focus)
    app.use(drag)
  },
}
