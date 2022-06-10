import { createApp } from "vue";
import App from "@/app/App.vue";
import router from "@/_helpers/router";
import store, { key } from "@/_store";
import Camera from "simple-vue-camera";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Authentication } from "./_services/model/auth";
import {
  arrayBufferToBase64,
  arrayBufferToUtf8,
  base64ToArrayBuffer,
  decryptAesCbc,
  encryptAesCbc,
  importKey,
  utf8ToArrayBuffer,
} from "./_helpers/crypto";
import { pack, protect, unpack, unprotect } from "./_helpers/token";

axios.interceptors.request.use(async (config: AxiosRequestConfig) => {
  console.log(config);

  config.url = config.url || "";

  const protd = config.url.indexOf("/protected") > 0;
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

  userp.raw.Synchronization.syn += userp.raw.Synchronization.inc;
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

axios.interceptors.response.use(async (response: AxiosResponse) => {
  console.log(response);

  response.config = response.config || {};

  if (!response.config.url) {
    console.error("no url in response config");
    throw "no url in response config";
  }

  const protd = response.config.url.indexOf("/protected") > 0;
  const admin = response.config.url.indexOf("/admin") > 0;

  if (!(admin || protd)) {
    return response;
  }

  const user = localStorage.getItem("user");
  if (!user) {
    throw "not authenticated";
  }

  const userp: Authentication = JSON.parse(user);
  const key = await importKey(userp.key);
  const iv = base64ToArrayBuffer(userp.iv);

  const next = response.data?.next;
  if (!next) {
    throw "server did not return new token";
  }

  const unpacked = unpack(next);
  const unprotected = await unprotect(unpacked, key, iv);

  if (
    unprotected.Synchronization.syn !==
    userp.raw.Synchronization.syn + userp.raw.Synchronization.inc
  ) {
    throw "server returned incorrect syn";
  }

  userp.raw.Synchronization = unprotected.Synchronization;

  response.data = JSON.parse(
    arrayBufferToUtf8(
      await decryptAesCbc(base64ToArrayBuffer(response.data?.data), key, iv)
    )
  );

  return response;
});

createApp(App)
  .component("camera", Camera)
  .use(store, key)
  .use(router)
  .mount("#app");
