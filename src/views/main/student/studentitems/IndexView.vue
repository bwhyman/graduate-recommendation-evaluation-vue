<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import SubmitList from './SubmitList.vue'

const itemDialog = defineAsyncComponent(() => import('../items/ItemDialog.vue'))
const activeItemDialogR = ref(false)

provide('callback', { activeItemDialogR })
</script>
<template>
  <itemDialog v-if="activeItemDialogR" />
  <el-row class="my-row">
    <el-col>
      <el-button type="primary" @click="activeItemDialogR = true">
        <el-icon><Plus /></el-icon>
      </el-button>
      <SubmitList />
    </el-col>
  </el-row>
</template>
