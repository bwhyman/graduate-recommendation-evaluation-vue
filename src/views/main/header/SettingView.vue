<script setup lang="ts">
import { CommonService } from '@/services/CommonService'
import { Setting } from '@element-plus/icons-vue'

const userInfoR = CommonService.getUserInfoService()
</script>
<template>
  <el-button type="danger" :icon="Setting" @click="$router.push('/settings')" style="margin: 10px">
    {{ userInfoR?.name }}
  </el-button>
</template>
