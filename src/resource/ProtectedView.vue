<template>
  <div class="content d-flex justify-content-center align-items-center">
    <div class="card shadow col-6 card-fixed-height">
      <div class="card-body d-flex justify-content-center align-items-center">
        <h1 v-if="isLoading">Loading...</h1>
        <h1 class="text-success" v-else-if="isLoaded">Authenticated</h1>
        <h1 class="text-danger" v-else>Can't load resource</h1>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from "vuex";
import { key } from "@/_store";
import { computed, onMounted } from "@vue/runtime-core";
import { ResourceStatus } from "@/_store/resource.module";

const store = useStore(key);

onMounted(() => store.dispatch("resource/access"));

const authenticated = computed(() => store.state.resource?.authenticated);
const isLoading = computed(
  () => store.state.resource?.status === ResourceStatus.loading
);
const isLoaded = computed(
  () => store.state.resource?.status === ResourceStatus.loaded
);
</script>

<style lang="scss" scoped>
.card-fixed-height {
  height: 50vh;
}

.content {
  min-height: calc(100vh - 150px);
}
</style>
