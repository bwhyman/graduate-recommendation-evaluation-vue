<script setup lang="ts">
import FunctionTag from '@/views/main/components/FunctionTag.vue'

const components: { name: string; component: Component }[] = [
  {
    name: '类别专业',
    component: defineAsyncComponent(() => import('./CategoryManagementView.vue'))
  },
  {
    name: '项管理',
    component: defineAsyncComponent(() => import('./itemmanagement/IndexView.vue'))
  }
]

const componentsMap = new Map<string, Component>()
components.forEach(com => componentsMap.set(com.name, com.component))
</script>
<template>
  <FunctionTag :tagcoms="componentsMap" />
</template>
