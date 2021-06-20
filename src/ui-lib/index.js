import clickOutSide from "./directives/click-out-side";

export default {
  install(app) {
    app.use(clickOutSide)
  }
}