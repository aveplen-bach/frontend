import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Camera from "simple-vue-camera";

createApp(App).component("camera", Camera).use(store).use(router).mount("#app");
