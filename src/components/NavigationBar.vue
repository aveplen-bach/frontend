<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark mb-4">
    <div class="container-fluid">
      <ul class="navbar-nav me-auto mb-2 mb-md-0">
        <li class="nav-item">
          <router-link to="/" class="nav-link">Home</router-link>
        </li>

        <li class="nav-item">
          <router-link to="/login" class="nav-link">Login</router-link>
        </li>

        <li class="nav-item">
          <router-link to="/sneaky-login" class="nav-link"
            >Sneaky login</router-link
          >
        </li>

        <li class="nav-item">
          <router-link to="/register" class="nav-link">Register</router-link>
        </li>

        <li class="nav-item">
          <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<<<<<<< HEAD
<script lang="ts" setup>
</script>
=======
<script>
export default {
  name: "NavigationBar",
};
</script>
>>>>>>> 3bb55435b6833e84bf372fba8a9b3015ad38092b
