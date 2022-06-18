<template>
  <div class="content d-flex justify-content-center align-items-center">
    <div class="card shadow col-7 card-fixed-height">
      <div class="card-body container">
        <div class="row h-100">
          <form class="d-flex flex-column justify-content-center h-100">
            <div class="form-outline mb-4" for="token-form-control">
              <label class="form-label">Token</label>
              <input
                type="text"
                id="token-form-control"
                class="form-control form-control-lg"
                v-model="helloToken"
              />
            </div>

            <div class="form-outline mb-4" for="key-form-control">
              <label class="form-label">Key</label>
              <input
                type="text"
                id="key-form-control"
                class="form-control form-control-lg"
                v-model="helloKey"
              />
            </div>

            <div class="form-outline mb-4" for="iv-form-control">
              <label class="form-label">IV</label>
              <input
                type="text"
                id="iv-form-control"
                class="form-control form-control-lg"
                v-model="helloIv"
              />
            </div>

            <span class="text-center text-danger">{{ error }}</span>

            <div class="text-center">
              <button
                type="button"
                class="btn btn-primary btn-lg"
                style="padding-left: 2.5rem; padding-right: 2.5rem"
                :style="{ disabled: isSending }"
                @click="hello"
              >
                Вход
              </button>
            </div>
            <span v-if="isFailure">{{ error }}</span>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { key } from "@/_store";
import { HelloStatus } from "@/_store/hello.module";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore(key);

const isSending = computed(
  () => store.state?.hello?.status === HelloStatus.sending
);
const isSuccess = computed(
  () => store.state?.hello?.status === HelloStatus.success
);
const isFailure = computed(
  () => store.state?.hello?.status === HelloStatus.failure
);
const error = computed(() => store.state.hello?.error);

const helloToken = ref("");
const helloKey = ref("");
const helloIv = ref("");

const hello = () => {
  store.dispatch("hello/hello", {
    helloToken: helloToken.value,
    helloKey: helloKey.value,
    helloIv: helloIv.value,
  });
};
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
