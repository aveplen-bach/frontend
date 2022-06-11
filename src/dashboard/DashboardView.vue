<template>
  <div class="container-fluid content">
    <div class="row">
      <nav
        id="sidebarMenu"
        class="col-md-3 col-lg-2 d-md-block bg-light collapse"
      >
        <div class="position-sticky pt-3">
          <ul class="nav nav-pills flex-column">
            <li class="nav-item">
              <a
                class="nav-link"
                :class="{ active: isUsers }"
                aria-current="page"
                href="#"
                @click.prevent="gotoUsers"
              >
                Пользователи
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                :class="{ active: !isUsers }"
                href="#"
                @click.prevent="gotoSettings"
              >
                Параметры
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 pt-3 pb-3">
        <component :is="DashboardUsers" v-if="isUsers" />
        <component :is="DashboardSettings" v-else />
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DashboardSettings from "@/dashboard/DashboardSettings.vue";
import DashboardUsers from "@/dashboard/DashboardUsers.vue";
import { ref } from "@vue/reactivity";
import { computed } from "@vue/runtime-core";

const tab = ref("users");
const isUsers = computed(() => tab.value === "users");
const gotoUsers = () => (tab.value = "users");
const gotoSettings = () => (tab.value = "settings");
</script>

<style lang="scss" scoped>
.content {
  min-height: calc(100vh - 150px);
}
</style>
