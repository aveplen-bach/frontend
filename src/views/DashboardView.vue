<template>
  <div class="container-fluid content">
    <div class="row">
      <nav
        id="sidebarMenu"
        class="col-md-3 col-lg-2 d-md-block bg-light collapse"
      >
        <div class="position-sticky pt-3">
          <ul class="nav flex-column">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">
                Пользователи
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Настройки</a>
            </li>
          </ul>
        </div>
      </nav>

      <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 pt-3 pb-3">
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
          <!-- ==================================== -->
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
                      v-model="regUsername"
                    />
                  </div>
                  <div class="mb-3">
                    <label for="exampleInputPassword1" class="form-label"
                      >Пароль</label
                    >
                    <input
                      type="password"
                      class="form-control"
                      id="exampleInputPassword11"
                      v-model="regPassword"
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
                      v-model="regRepeat"
                    />
                  </div>
                  <div class="mb-3 form-check">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      id="exampleCheck1"
                      v-model="regAdmin"
                    />
                    <label class="form-check-label" for="exampleCheck1"
                      >Администратор</label
                    >
                  </div>
                  <div class="mb-3">
                    <label for="formFile" class="form-label">Фото</label>
                    <input
                      class="form-control"
                      type="file"
                      id="formFile"
                      ref="regPhotos"
                    />
                  </div>
                  <button
                    type="submit"
                    class="btn btn-primary"
                    @click.prevent="register"
                  >
                    Добавить
                  </button>
                  <div class="text-danger" v-if="error">
                    {{ error }}
                  </div>
                </form>
              </div>
            </div>
          </div>
          <!-- ==================================== -->

          <div
            v-for="user in searchFound"
            :key="user.id"
            class="accordion-item"
          >
            <h2
              class="accordion-header"
              :id="`accordion-header-${user.userId}`"
            >
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
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { key } from "@/store";
import { ref, onMounted, computed, Ref } from "vue";
import { useStore } from "vuex";
const store = useStore(key);

onMounted(() => {
  store.dispatch("adminUsers");
});

const error = computed(() => store.state.dashboard.error);

const search = ref("");
const searchFound = computed(() =>
  store.state.dashboard.userList.users.filter((user) =>
    JSON.stringify(user).includes(search.value)
  )
);

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

<style lang="scss" scoped>
.content {
  min-height: calc(100vh - 150px);
}
</style>
