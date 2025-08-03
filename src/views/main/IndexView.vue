<script setup lang="ts">
import HeaderView from './header/IndexView.vue'
</script>
<template>
  <HeaderView />
  <RouterView :key="$route.fullPath" />
</template>
