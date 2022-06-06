<template>
  <pre>

    .
  </pre>

  <button class="btn btn-danger" @click="hello">Hello</button>

  <pre>{{ stateWatch }}</pre>
  <camera :resolution="{ width: 500, height: 500 }" ref="camera" autoplay>
  </camera>
  <input type="text" v-model="username" />
  <input type="password" v-model="password" />
  <button class="btn btn-danger" @click="snapshot">Try to send request</button>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "@vue/runtime-core";
import Camera from "simple-vue-camera/dist";
import { useStore } from "vuex";
import { key } from "@/store";

export default defineComponent({
  setup() {
    const username = ref("username");
    const password = ref("password");
    const preview = ref("");
    const camera = ref<InstanceType<typeof Camera>>();
    const store = useStore(key);
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
          store.dispatch("hello");
        }
      }
    };
    const stateWatch = computed(() => store.state);

    const hello = () => {
      store.dispatch("hello");
    };

    return {
      username,
      password,
      preview,
      camera,
      snapshot,
      stateWatch,
      hello,
    };
  },
});
</script>

<style></style>
