<template>
  <div class="outer">
    <div class="middle">
      <div class="inner">
        <main class="form-signin w-100 m-auto">
          <form @submit.prevent="submit">
            <div class="form-floating">
              <input
                v-model="data.email"
                type="email"
                class="form-control"
                id="floatingInput"
                placeholder="name@example.com"
              />
              <label for="floatingInput"> Email address </label>
            </div>

            <div class="form-floating">
              <input
                v-model="data.password"
                type="password"
                class="form-control"
                id="floatingPassword"
                placeholder="Password"
              />
              <label for="floatingPassword"> Password </label>
            </div>

            <div class="camera-container">
              <camera
                :resolution="{ width: 300, height: 300 }"
                autoplay
                mirrored
              >
                <button>I'm on top of the video</button>
              </camera>
            </div>

            <button class="w-100 btn btn-lg btn-primary" type="submit">
              Sign in
            </button>
          </form>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import { find, head } from "lodash";
import { computed } from "@vue/reactivity";
import { reactive } from "vue";
import { useStore } from "vuex";

export default {
  name: "LoginView",

  components: {},

  setup() {
    const store = useStore();
    const auth = computed(() => store.getters.isAuthenticated);
    const data = reactive({
      email: "",
      password: "",
    });

    const submit = async () => {
      try {
        await fetch("http://localhost:8081/api/v1/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        });

        await store.dispatch("setAuthenticated", true);
      } catch (e) {
        await store.dispatch("setAuthenticated", false);
      }
    };

    return {
      data,
      submit,
      auth,
    };
  },

  data() {
    return {
      img: null,
      camera: null,
      deviceId: null,
      devices: [],
    };
  },
  computed: {
    device() {
      return find(this.devices, (n) => n.deviceId == this.deviceId);
    },
  },
  watch: {
    camera: function (id) {
      this.deviceId = id;
    },
    devices: function () {
      // Once we have a list select the first one
      let first = head(this.devices);
      if (first) {
        this.camera = first.deviceId;
        this.deviceId = first.deviceId;
      }
    },
  },
  methods: {
    onCapture() {
      this.img = this.$refs.webcam.capture();
    },
    onStarted(stream) {
      console.log("On Started Event", stream);
    },
    onStopped(stream) {
      console.log("On Stopped Event", stream);
    },
    onStop() {
      this.$refs.webcam.stop();
    },
    onStart() {
      this.$refs.webcam.start();
    },
    onError(error) {
      console.log("On Error Event", error);
    },
    onCameras(cameras) {
      this.devices = cameras;
      console.log("On Cameras Event", cameras);
    },
    onCameraChange(deviceId) {
      this.deviceId = deviceId;
      this.camera = deviceId;
      console.log("On Camera Change Event", deviceId);
    },
  },
};
</script>

<style>
.camera-container {
  max-width: 300px;
  max-height: 300px;
}
</style>
