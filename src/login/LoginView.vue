<template>
  <div class="content d-flex justify-content-center align-items-center">
    <div class="card shadow col-7 card-fixed-height">
      <div class="card-body container">
        <div class="row h-100">
          <div class="col-6">
            <div style="width: 100%; height: 100%; overflow: hidden">
              <camera
                :resolution="{ width: 1000, height: 1000 }"
                ref="camera"
                autoplay
                @started="cameraStarted"
              >
                <div
                  class="d-flex justify-content-center align-items-center"
                  style="width: 100%; height: 100%"
                  v-if="provided"
                >
                  <div
                    class="w-100 h-100 rounded"
                    style="border: 100px solid rgba(0, 0, 0, 0.5)"
                  >
                    <div
                      class="w-100 h-100 rounded"
                      style="border: 3px solid rgba(255, 255, 255, 0.6)"
                    ></div>
                  </div>
                </div>
                <div
                  v-else
                  :class="` w-100
                    h-100
                    rounded
                    d-flex
                    justify-content-center
                    align-items-center`"
                  style="background-color: rgba(0, 0, 0, 0.2)"
                >
                  Вы должны дать доступ к камере, чтобы войти.
                </div>
              </camera>
            </div>
          </div>
          <div class="col-6">
            <form class="d-flex flex-column justify-content-center h-100">
              <div class="form-outline mb-4" for="username-form-control">
                <label class="form-label">Имя пользователя</label>
                <input
                  id="username-form-control"
                  type="text"
                  class="form-control form-control-lg"
                  v-model="username"
                  placeholder=""
                />
              </div>

              <div class="form-outline mb-3" for="password-form-control">
                <label class="form-label">Пароль</label>
                <input
                  id="password-form-control"
                  type="password"
                  class="form-control form-control-lg"
                  v-model="password"
                  placeholder=""
                />
              </div>

              <select
                class="form-select"
                aria-label="Default select example"
                @change="changeDevice"
                v-model="k"
              >
                <option selected>Open this select menu</option>
                <option
                  v-for="d in nonBlankDevices"
                  :key="d.deviceId"
                  :value="d.label"
                  :style="{ selected: d.deviceId == device }"
                >
                  {{ d.label }}
                </option>
              </select>

              <label class="form-label"></label>
              <div class="text-center">
                <button
                  type="button"
                  class="btn btn-primary btn-lg"
                  style="padding-left: 2.5rem; padding-right: 2.5rem"
                  @click="login"
                >
                  Вход
                </button>
              </div>
              <!-- <div class="text-danger text-center">
                {{ error }}
              </div> -->
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { key } from "@/_store";
import Camera from "simple-vue-camera";
import { computed, defineComponent, onMounted, ref } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  setup() {
    const store = useStore(key);
    // const error = computed(() => store.state.login.error);
    const provided = ref(false);
    const cameraStarted = () => {
      provided.value = true;
    };

    const camera = ref<InstanceType<typeof Camera>>();
    const devices = ref<MediaDeviceInfo[]>([]);
    const device = ref(camera.value?.currentDeviceID);
    const k = ref("");

    const nonBlankDevices = computed(() =>
      devices.value.filter((d) => d.label != "")
    );

    onMounted(() => {
      navigator.mediaDevices.enumerateDevices().then((ds) => {
        ds.forEach((d) => {
          devices.value.push(d);
        });
      });
    });

    const changeDevice = (event: any) => {
      for (let test of devices.value) {
        if (test.label === event.target.value) {
          camera.value?.changeCamera(test.deviceId);
          return;
        }
      }
    };

    const username = ref("");
    const password = ref("");
    const login = async () => {
      try {
        const blob = await camera.value?.snapshot(
          { width: 800, height: 600 },
          "image/jpeg",
          1
        );

        if (!blob) {
          store.commit("LOGIN_SET_ERROR", {
            error: "ошибка при получении фото",
          });
        }

        store.dispatch("auth/login", {
          username: username.value,
          password: password.value,
          photo: blob,
        });
      } catch (err) {
        console.error(err);
      }
    };

    return {
      camera,
      login,
      username,
      password,
      cameraStarted,
      provided,
      devices,
      device,
      nonBlankDevices,
      changeDevice,
      k,
      //   error,
    };
  },
});
</script>

<style lang="scss" scoped>
.card-fixed-height {
  height: 50vh;
}

.content {
  min-height: calc(100vh - 150px);
}

.camera-container {
  height: 50px;
}
</style>
