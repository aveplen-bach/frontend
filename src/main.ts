import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store, { key } from "./store";
import Camera from "simple-vue-camera";

createApp(App)
  .component("camera", Camera)
  .use(store, key)
  .use(router)
  .mount("#app");
