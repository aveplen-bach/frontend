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
              v-model="regUsername"
            />
          </div>
          <button
            type="submit"
            class="btn btn-success"
            @click.prevent="register"
          >
            Обновить параметры
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { key } from "@/_store";
import { useStore } from "vuex";

useStore(key);
</script>
