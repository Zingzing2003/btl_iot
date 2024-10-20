<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style scoped>
#app {
  margin: 0;
  padding: 0;
  position: absolute;
  overflow-y: scroll;
  overflow-x: hidden;
  min-height: 100vh;
  height: 100vh;
  min-width: 100vw;
  width: 100vw;
  color: rgba(0, 0, 0, 0.8);
  font-size: 16px;
}

.active {
  color: #409eff;
}

</style>
