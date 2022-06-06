<template>
  <component :is="NavigationBar" />
  <main>
    <router-view />
  </main>
  <component :is="FooterBar" />
</template>

<script lang="ts" setup>
import NavigationBar from "@/components/NavigationBar.vue";
import FooterBar from "@/components/FooterBar.vue";
</script>

<style lang="scss" scoped>
$bg-color: rgb(247, 245, 242);
$dot-color: rgb(141, 141, 170);

$dot-size: 1px;
$dot-space: 11px;

body {
  background: linear-gradient(
        90deg,
        $bg-color ($dot-space - $dot-size),
        transparent 1%
      )
      center,
    linear-gradient($bg-color ($dot-space - $dot-size), transparent 1%) center,
    $dot-color;
  background-size: $dot-space $dot-space;
}

main {
  margin-top: 73px;
  margin-bottom: 43px;
  min-height: calc(100vh - 116px);
}
</style>
