<template>
  <pre>





    <button @click="token" class="btn btn-danger">Get token, key, iv</button>

    <button @click="open" class="btn btn-danger">Access open</button>

    <button @click="prot" class="btn btn-danger">Access protected</button>

    <button @click="admin" class="btn btn-danger">Access admin</button>






.
</pre>
  <!-- <camera :resolution="{ width: 500, height: 500 }" ref="camera" autoplay>
  </camera>
  <input type="text" v-model="username" />
  <input type="password" v-model="password" />
  <button class="btn btn-danger" @click="snapshot">Try to send request</button> -->
</template>

<script lang="ts">
// import { patch } from "@/tetatet/patch";
import { defineComponent, /*onMounted,*/ ref } from "@vue/runtime-core";
// import axios, { Axios } from "axios";
// import { login } from "@/tetatet/login";
import Camera from "simple-vue-camera/dist";
import TokenService from "@/tetatet/service/token";
import axios from "axios";
import { base64ToArrayBuffer, base64ToUtf8 } from "@/tetatet/cryptoutil";
import CryptoService from "@/tetatet/service/crypto";
import ProtectedService from "@/tetatet/service/protected";
import AdminService from "@/tetatet/service/admin";
import OpenService from "@/tetatet/service/open";
// import { pack } from "@/tetatet/pack";

export default defineComponent({
  setup() {
    const username = ref("username");
    const password = ref("password");

    // const preview = ref("");
    // const camera = ref<InstanceType<typeof Camera>>();

    // const snapshot = async () => {
    //   const blob = await camera.value?.snapshot(
    //     { width: 1920, height: 1080 },
    //     "image/jpeg",
    //     0.5
    //   );
    //   if (blob) {
    //     const fr = new FileReader();
    //     await fr.readAsBinaryString(blob);
    //     if (fr.result) {
    //       login("http://192.168.10.105:8081/api/v1/login", {
    //         username: username.value,
    //         password: password.value,
    //         photo: blob,
    //       });
    //     }
    //   }
    // };

    let ts: TokenService;
    let cs: CryptoService;
    let ps: ProtectedService;
    let as: AdminService;
    let os = new OpenService();

    const token = async () => {
      debugger;

      const res = await axios.post("http://localhost:8081/api/open/hello", {
        userId: new Date().getTime(),
      });

      const token = res.data?.token;
      const keyb = base64ToArrayBuffer(res.data?.key);
      const iv = base64ToArrayBuffer(res.data?.iv);

      const key = await window.crypto.subtle.importKey(
        "raw",
        keyb,
        "AES-CBC",
        true,
        ["encrypt", "decrypt"]
      );

      ts = new TokenService(token, key, iv);
      cs = new CryptoService(key, iv);
      ps = new ProtectedService(ts);
      as = new AdminService(ts, cs);
    };

    const open = async () => {
      debugger;
      os.about();
    };

    const prot = async () => {
      debugger;
      ps.isAuthenticated();
    };

    const admin = async () => {
      debugger;
      as.getUsers();
    };

    return {
      username,
      password,
      // preview,
      // camera,
      // snapshot,
      token,
      open,
      prot,
      admin,
    };
  },
});
</script>

<style></style>
