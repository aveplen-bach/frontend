import { createApp } from "vue";
import App from "@/app/App.vue";
import router from "@/_helpers/router";
import store, { key } from "@/_store";
import Camera from "simple-vue-camera";
import axios from "axios";
import { patchRequest, patchResponse } from "./_helpers/axios-patch";

axios.interceptors.request.use(patchRequest);
axios.interceptors.response.use(patchResponse);

createApp(App)
  .component("camera", Camera)
  .use(store, key)
  .use(router)
  .mount("#app");
