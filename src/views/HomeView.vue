<template>
  <pre>












.
</pre
  >
  <camera :resolution="{ width: 500, height: 500 }" ref="camera" autoplay>
  </camera>
  <input type="text" v-model="username" />
  <input type="password" v-model="password" />
  <button class="btn btn-danger" @click="snapshot">Try to send request</button>
</template>

<script lang="ts">
import { patch } from "@/tetatet/patch";
import { defineComponent, onMounted, ref } from "@vue/runtime-core";
import axios, { Axios } from "axios";
import { login } from "@/tetatet/login";
import Camera from "simple-vue-camera/dist";
import { pack } from "@/tetatet/pack";

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
        const file = new File([blob], "snapshot.jpg", {
          type: "image/jpeg",
          lastModified: Date.now(),
        });

        // const fr = new FileReader();
        // await fr.readAsBinaryString(blob);
        // if (fr.result) {
        login("http://192.168.10.105:8081/api/v1/login", {
          username: username.value,
          password: password.value,
          photo: blob,
        });
        // }
      }
    };

    return {
      username,
      password,
      preview,
      camera,
      snapshot,
    };
  },
});
</script>

<style>
</style>