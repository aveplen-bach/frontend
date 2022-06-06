<template>
  <div class="navbar_spacer"></div>

  <div class="container-fluid fs-5">
    <div class="row row-height">
      <div class="col-9 left">
        <pre>{{ statewatch }}</pre>
      </div>
      <div class="col-3 right">
        <div class="d-grid gap-2 border border-primary rounded inner-padding">
          <button class="btn btn-success" @click="hello">Hello</button>
          <button class="btn btn-danger" @click="rerender">Rerender</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { key } from "@/store";
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";

export default defineComponent({
  methods: {
    rerender() {
      this.$forceUpdate();
    },
  },
  setup() {
    const store = useStore(key);

    const statewatch = computed(() => store.state);

    const hello = () => store.dispatch("hello");

    return {
      statewatch,
      hello,
    };
  },
});
</script>

<style>
.inner-padding {
  box-sizing: border-box;
  padding: 4px;
}

.navbar_spacer {
  margin-top: 80px;
}

.row-height {
  height: calc(100vh - 80px);
}

.left {
  height: 100%;
  overflow-y: scroll;
}

.right {
  height: 100%;
  overflow-y: scroll;
}

/* ::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}

* {
  -ms-overflow-style: none !important;
} */
</style>
