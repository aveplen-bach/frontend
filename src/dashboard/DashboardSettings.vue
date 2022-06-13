<template>
  <div class="row justify-content-between mb-2">
    <h3 class="col-auto">Параметры</h3>
  </div>

  <div class="card">
    <div class="card-body">
      <h5 class="card-title">Сравнение векторов</h5>
      <div class="card-text">
        <form>
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label"
              >Пороговое значение расстояния Евклида</label
            >
            <input
              type="text"
              class="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              v-model="distance"
            />
          </div>
          <button
            type="submit"
            class="btn btn-success"
            :class="{ disabled: isSending }"
            @click.prevent="update"
          >
            Обновить параметры
          </button>
          <div v-if="isFailure" class="text-danger">{{ error }}</div>
          <div v-if="isSuccess" class="text-success"></div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { key } from "@/_store";
import { ConfigStatus } from "@/_store/config.module";
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";

const store = useStore(key);

onMounted(() => {
  store.dispatch("config/resetError");
});

const isSending = computed(
  () => store.state.config?.status === ConfigStatus.sending
);
const isSuccess = computed(
  () => store.state.config?.status === ConfigStatus.success
);
const isFailure = computed(
  () => store.state.config?.status === ConfigStatus.failure
);

const error = computed(() => store.state.config?.error);

const distance = ref("");

const update = () => {
  store.dispatch("config/updateFacerecConfig", distance.value);
};
</script>
