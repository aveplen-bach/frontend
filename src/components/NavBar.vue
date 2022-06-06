<template>
  <div class="container-fluid">
    <nav
      class="navbar bg-light fixed-top text-decoration-none py-3 border-bottom"
    >
      <div class="container-fluid">
        <router-link to="/" custom v-slot="{ href, navigate }">
          <a
            class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark"
            :href="href"
            @click="navigate"
          >
            <span class="fs-4"
              >Tetatet ({{
                isAuthenticated ? "authenticated" : "not authenticated"
              }})</span
            >
          </a>
        </router-link>

        <ul class="nav nav-pills">
          <li class="nav-item">
            <router-link to="/" custom v-slot="{ href, navigate }">
              <a
                :href="href"
                @click="navigate"
                class="nav-link"
                :class="{ active: isHome }"
                >Home</a
              >
            </router-link>
          </li>

          <li class="nav-item">
            <router-link to="/about" custom v-slot="{ href, navigate }">
              <a
                :href="href"
                @click="navigate"
                class="nav-link"
                :class="{ active: isAbout }"
                >About</a
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
                >Dashboard</a
              >
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { key } from "@/store";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const store = useStore(key);

const isHome = computed(() => useRoute().name == "home");
const isAbout = computed(() => useRoute().name == "about");
const isDashboard = computed(() => useRoute().name == "dashboard");

const isAuthenticated = computed(() => store.state.protected.isAuthenticated);
</script>

<style>
body {
  font-size: 0.875rem;
}

.feather {
  width: 16px;
  height: 16px;
}

.sidebar {
  position: fixed;
  top: 70px;
  bottom: 0;
  /* rtl:remove */
  left: 0;
  z-index: 100;
  /* Behind the navbar */
  padding: 48px 0 0;
  /* Height of navbar */
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.1);
}

@media (max-width: 767.98px) {
  .sidebar {
    top: 5rem;
  }
}

.sidebar-sticky {
  position: relative;
  top: 0;
  height: calc(100vh - 48px);
  padding-top: 0.5rem;
  overflow-x: hidden;
  overflow-y: auto;
  /* Scrollable contents if viewport is shorter than content. */
}

.sidebar .nav-link {
  font-weight: 500;
  color: #333;
}

.sidebar .nav-link .feather {
  margin-right: 4px;
  color: #727272;
}

.sidebar .nav-link.active {
  color: #2470dc;
}

.sidebar .nav-link:hover .feather,
.sidebar .nav-link.active .feather {
  color: inherit;
}

.sidebar-heading {
  font-size: 0.75rem;
}

.navbar-brand {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  background-color: rgba(0, 0, 0, 0.25);
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.25);
}

.navbar .navbar-toggler {
  top: 0.25rem;
  right: 1rem;
}

.navbar .form-control {
  padding: 0.75rem 1rem;
}

.form-control-dark {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.1);
}

.form-control-dark:focus {
  border-color: transparent;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.25);
}

.bd-placeholder-img {
  font-size: 1.125rem;
  text-anchor: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

@media (min-width: 768px) {
  .bd-placeholder-img-lg {
    font-size: 3.5rem;
  }
}

.b-example-divider {
  height: 3rem;
  background-color: rgba(0, 0, 0, 0.1);
  border: solid rgba(0, 0, 0, 0.15);
  border-width: 1px 0;
  box-shadow: inset 0 0.5em 1.5em rgba(0, 0, 0, 0.1),
    inset 0 0.125em 0.5em rgba(0, 0, 0, 0.15);
}

.b-example-vr {
  flex-shrink: 0;
  width: 1.5rem;
  height: 100vh;
}

.bi {
  vertical-align: -0.125em;
  fill: currentColor;
}

.nav-scroller {
  position: relative;
  z-index: 2;
  height: 2.75rem;
  overflow-y: hidden;
}

.nav-scroller .nav {
  display: flex;
  flex-wrap: nowrap;
  padding-bottom: 1rem;
  margin-top: -1px;
  overflow-x: auto;
  text-align: center;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}
</style>
