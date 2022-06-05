<template>
  <pre>





    <button @click="test">
      Can't miss very big button
    </button>






.
</pre>
  <camera :resolution="{ width: 500, height: 500 }" ref="camera" autoplay>
  </camera>
  <input type="text" v-model="username" />
  <input type="password" v-model="password" />
  <button class="btn btn-danger" @click="snapshot">Try to send request</button>
</template>

<script lang="ts">
// import { patch } from "@/tetatet/patch";
import { defineComponent, /*onMounted,*/ ref } from "@vue/runtime-core";
// import axios, { Axios } from "axios";
import { login } from "@/tetatet/login";
import Camera from "simple-vue-camera/dist";
import TokenService from "@/tetatet/token_service";
import axios from "axios";
// import { pack } from "@/tetatet/pack";

export default defineComponent({
  setup() {
    const username = ref("username");
    const password = ref("password");

    const preview = ref("");
    const camera = ref<InstanceType<typeof Camera>>();

    const snapshot = async () => {
      const blob = await camera.value?.snapshot(
        { width: 1920, height: 1080 },
        "image/jpeg",
        0.5
      );

      if (blob) {
        const fr = new FileReader();
        await fr.readAsBinaryString(blob);
        if (fr.result) {
          login("http://192.168.10.105:8081/api/v1/login", {
            username: username.value,
            password: password.value,
            photo: blob,
          });
        }
      }
    };

    const test = async () => {
      const res = await axios.post("http://localhost:8081/api/open/hello", {
        userId: 1,
      });

      function _base64ToArrayBuffer(base64: string) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
      }

      const keyBytes = _base64ToArrayBuffer(res.data?.key);
      const iv = _base64ToArrayBuffer(res.data?.iv);

      const key = await window.crypto.subtle.importKey(
        "raw",
        keyBytes,
        "AES-CBC",
        true,
        ["encrypt", "decrypt"]
      );

      const ts = new TokenService(key, iv);

      ts.NextToken(res.data?.token);
    };

    return {
      username,
      password,
      preview,
      camera,
      snapshot,
      test,
    };
  },
});
</script>

<style></style>
