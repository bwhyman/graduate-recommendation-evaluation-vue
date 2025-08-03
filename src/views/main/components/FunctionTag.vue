<script setup lang="ts">
const props = defineProps<{ tagcoms: Map<string, Component> }>()
const curComNameR = ref('')
const componentsMap = props.tagcoms
const getCurComF = () => componentsMap.get(curComNameR.value)
const typeF = (name: string) => (name == curComNameR.value ? 'danger' : 'primary')
</script>
<template>
  <el-row class="my-row">
    <el-col>
      <el-check-tag
        checked
        v-for="(com, index) of componentsMap"
        :type="typeF(com[0])"
        :key="index"
        @click="curComNameR = com[0]"
        style="margin-right: 10px">
        {{ com[0] }}
      </el-check-tag>
    </el-col>
  </el-row>
  <template v-if="curComNameR">
    <component :is="getCurComF()" />
  </template>
</template>
