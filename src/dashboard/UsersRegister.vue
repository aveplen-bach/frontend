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
              v-model="regUsername"
            />
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Пароль</label>
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
            class="btn btn-success"
            @click.prevent="register"
          >
            Добавить
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>
