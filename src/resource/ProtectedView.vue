<template>
  <div class="content d-flex justify-content-center align-items-center">
    <div class="card shadow col-6 card-fixed-height">
      <div class="card-body d-flex justify-content-center align-items-center">
        <h1 class="text-success" v-if="authenticated">Авторизован</h1>
        <h1 class="text-danger" v-else>Не авторизован</h1>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from "vuex";
import { key } from "@/_store";
import { computed } from "@vue/runtime-core";

const store = useStore(key);

const authenticated = computed(() => store.state.protected.isAuthenticated);
</script>

<style lang="scss" scoped>
.card-fixed-height {
  height: 50vh;
}

.content {
  min-height: calc(100vh - 150px);
}
</style>
