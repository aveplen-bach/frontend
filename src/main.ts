import { createApp } from "vue";
import App from "@/app/App.vue";
import router from "@/_helpers/router";
import store, { key } from "@/_store";
import Camera from "simple-vue-camera";
import axios, { AxiosRequestConfig } from "axios";
import { Authentication } from "./_services/model/auth";
import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  encryptAesCbc,
  importKey,
  utf8ToArrayBuffer,
} from "./_helpers/crypto";
import { pack, protect } from "./_helpers/token";

axios.interceptors.request.use(async (config: AxiosRequestConfig) => {
  config.url = config.url || "";

  const protd = config.url.indexOf("protd") > 0;
  const admin = config.url.indexOf("admin") > 0;

  if (!(admin || protd)) {
    return config;
  }

  const user = localStorage.getItem("user");
  if (!user) {
    throw "not authenticated";
  }

  const userp: Authentication = JSON.parse(user);
  const key = await importKey(userp.key);
  const iv = base64ToArrayBuffer(userp.iv);

  userp.raw.Synchronization.syn += userp.raw.Synchronization.inc
  userp.raw.Synchronization.inc = Math.random() % 1000;

  const protectedd = await protect(userp.raw, key, iv);
  const packed = pack(protectedd);

  config.headers = config.headers || {};
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${packed}`,
  };

  if (admin && config.data) {
    config.data = arrayBufferToBase64(
      await encryptAesCbc(
        utf8ToArrayBuffer(JSON.stringify(config.data)),
        key,
        iv
      )
    );
  }

  return config;
});

axios.interceptors.response.use(async (config) => {

})

createApp(App)
  .component("camera", Camera)
  .use(store, key)
  .use(router)
  .mount("#app");
