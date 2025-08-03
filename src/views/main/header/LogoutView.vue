<script setup lang="ts">
import { CommonService } from '@/services/CommonService'
import { SwitchButton } from '@element-plus/icons-vue'

const logoutF = () => {
  CommonService.clearLoginService()
}
</script>
<template>
  <el-icon id="switch" :size="32" color="red" @click="logoutF"><SwitchButton /></el-icon>
</template>
<style scoped>
#switch:hover {
  cursor: pointer;
}
</style>
