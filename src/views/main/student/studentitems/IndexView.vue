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
    <el-col :span="2">
      <el-button type="primary" @click="activeItemDialogR = true">
        <el-icon><Plus /></el-icon>
      </el-button>
    </el-col>
    <el-col :span="18">
      <p>
        说明：1.添加全面发展成绩指标项；2.在创建的指标项，佐证条目中，选择上传指标项对应的
        <el-tag type="primary" style="vertical-align: middle">佐证材料</el-tag>
        ;
      </p>
    </el-col>
    <el-col>
      <SubmitList />
    </el-col>
  </el-row>
</template>
