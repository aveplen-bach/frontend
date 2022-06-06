<template>
  <nav
    class="navbar bg-light fixed-top text-decoration-none py-3 border-bottom"
  >
    <div class="container-fluid">
      <router-link to="/about" custom v-slot="{ href, navigate }">
        <a
          class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark"
          :href="href"
          @click="navigate"
        >
          <span class="fs-4"
            >Тетатет ({{
              isAuthenticated ? "authenticated" : "not authenticated"
            }})</span
          >
        </a>
      </router-link>

      <ul class="nav nav-pills">
        <li class="nav-item">
          <router-link to="/about" custom v-slot="{ href, navigate }">
            <a
              :href="href"
              @click="navigate"
              class="nav-link"
              :class="{ active: isAbout }"
              >О приложении</a
            >
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/protected" custom v-slot="{ href, navigate }">
            <a
              :href="href"
              @click="navigate"
              class="nav-link"
              :class="{ active: isProtected }"
              >Защищенный ресурс</a
            >
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/dashboard" custom v-slot="{ href, navigate }">
            <a
              :href="href"
              @click="navigate"
              class="nav-link"
              :class="{ active: isDashboard }"
              >Дашборд</a
            >
          </router-link>
        </li>

        <li class="nav-item" v-if="!isAuthenticated">
          <router-link to="/login" custom v-slot="{ href, navigate }">
            <a
              :href="href"
              @click="navigate"
              class="nav-link"
              :class="{ active: isLogin }"
              >Вход</a
            >
          </router-link>
        </li>

        <li class="nav-item" v-if="isAuthenticated">
          <a href="#" class="nav-link" @click.prevent="logout">Выход</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { key } from "@/store";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const store = useStore(key);

const isAbout = computed(() => useRoute().name == "about");
const isProtected = computed(() => useRoute().name == "protected");
const isLogin = computed(() => useRoute().name == "login");
const isDashboard = computed(() => useRoute().name == "dashboard");

const isAuthenticated = computed(() => store.state.protected.isAuthenticated);

const logout = () => store.dispatch("logout");
</script>
