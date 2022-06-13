<template>
  <div class="row justify-content-between mb-2">
    <h3 class="col-auto">Пользователи</h3>
    <div class="col-md-6 d-flex">
      <input
        class="form-control me-2"
        placeholder="Поиск"
        aria-label="Search"
        v-model="search"
      />
      <button class="btn btn-outline-success">Найти</button>
    </div>
  </div>

  <div class="accordion" id="users-accordion-list">
    <users-register />
    <div v-for="user in searchFound" :key="user.id" class="accordion-item">
      <h2 class="accordion-header" :id="`accordion-header-${user.userId}`">
        <button
          class="accordion-button"
          type="button"
          data-bs-toggle="collapse"
          :data-bs-target="`#accordion-${user.userId}`"
          aria-expanded="false"
          :aria-controls="`accordion-${user.userId}`"
        >
          {{ user.userId }}. {{ user.username }}
        </button>
      </h2>
      <div
        :id="`accordion-${user.userId}`"
        class="accordion-collapse collapse"
        :aria-labelledby="`accordion-header-${user.userId}`"
        data-bs-parent="#users-accordion-list"
      >
        <div class="accordion-body">
          <table class="table table-light">
            <tbody>
              <tr>
                <th scope="row">Идентификатор</th>
                <td>{{ user.userId }}</td>
              </tr>
              <tr>
                <th scope="row">Имя пользователя</th>
                <td>{{ user.username }}</td>
              </tr>
              <tr>
                <th scope="row">Создан</th>
                <td>{{ user.createdAt }}</td>
              </tr>
              <tr>
                <th scope="row">Изменен</th>
                <td>{{ user.updatedAt }}</td>
              </tr>
              <tr>
                <th scope="row">Администратор</th>
                <td>{{ user.admin }}</td>
              </tr>
            </tbody>
          </table>
          <button class="btn btn-danger">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import UsersRegister from "@/dashboard/UsersRegister.vue";
import { key } from "@/_store";
import { ref, onMounted, computed, Ref } from "vue";
import { useStore } from "vuex";
const store = useStore(key);

// onMounted(() => {
//   store.dispatch("adminUsers");
// });

const search = ref("");
const searchFound = computed(() => store.state.users?.users);

const regUsername = ref("");
const regPassword = ref("");
const regRepeat = ref("");
const regAdmin = ref(false);
const regPhotos: Ref = ref(null);

const register = async () => {
  const fr = new FileReader();
  fr.onload = (e: ProgressEvent<FileReader>) => {
    store.dispatch("adminRegister", {
      username: regUsername.value,
      password: regPassword.value,
      repeat: regRepeat.value,
      admin: regAdmin.value,
      photo: e.target?.result,
    });
  };

  try {
    fr.readAsArrayBuffer(regPhotos.value.files[0]);
  } catch (e) {
    store.commit("DASHBOARD_SET_ERROR", { error: "необходимо выбрать файл" });
  }
};
</script>
