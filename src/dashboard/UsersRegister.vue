<template>
  <div class="accordion-item">
    <h2 class="accordion-header" id="accordion-header-add">
      <button
        class="accordion-button"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#accordion-add"
        aria-expanded="false"
        aria-controls="accordion-add"
      >
        Добавить пользователя
      </button>
    </h2>
    <div
      id="accordion-add"
      class="accordion-collapse collapse"
      aria-labelledby="accordion-header-add"
      data-bs-parent="#users-accordion-list"
    >
      <div class="accordion-body">
        <form>
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label"
              >Имя пользователя</label
            >
            <input
              type="text"
              class="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              v-model="username"
            />
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Пароль</label>
            <input
              type="password"
              class="form-control"
              id="exampleInputPassword11"
              v-model="password"
            />
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label"
              >Повтор пароля</label
            >
            <input
              type="password"
              class="form-control"
              id="exampleInputPassword1"
              v-model="repeat"
            />
          </div>
          <div class="mb-3 form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="exampleCheck1"
              v-model="admin"
            />
            <label class="form-check-label" for="exampleCheck1"
              >Администратор</label
            >
          </div>
          <div class="mb-3">
            <label for="formFile" class="form-label">Фото</label>
            <input class="form-control" type="file" id="formFile" ref="photo" />
          </div>
          <button
            type="submit"
            class="btn btn-success"
            :class="{ disabled: isSending }"
            @click.prevent="register"
          >
            Добавить
          </button>
          <div v-if="isFailure" class="text-danger">{{ error }}</div>
          <div v-if="isSuccess" class="text-success">
            Пользователь {{ username.value }} добавлен
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { key } from "@/_store";
import { RegisterStatus } from "@/_store/register.module";
import { computed } from "@vue/runtime-core";
import { onMounted, ref, Ref } from "vue";
import { useStore } from "vuex";

const store = useStore(key);

onMounted(() => {
  store.dispatch("register/resetError");
});

const isSending = computed(
  () => store.state.register?.status === RegisterStatus.sending
);
const isSuccess = computed(
  () => store.state.register?.status === RegisterStatus.success
);
const isFailure = computed(
  () => store.state.register?.status === RegisterStatus.failure
);

const error = computed(() => store.state.register?.error);

const username = ref("");
const password = ref("");
const repeat = ref("");
const admin = ref(false);
const photo: Ref = ref(null);

const register = async () => {
  const fr = new FileReader();
  fr.onload = (e: ProgressEvent<FileReader>) => {
    store.dispatch("adminRegister", {
      username: username.value,
      password: password.value,
      repeat: repeat.value,
      admin: admin.value,
      photo: e.target?.result,
    });
  };

  try {
    fr.readAsArrayBuffer(photo.value.files[0]);
  } catch (e) {
    console.error("file is not selected");
    store.dispatch("setError", "необходимо выбрать файл");
  }
};
</script>
