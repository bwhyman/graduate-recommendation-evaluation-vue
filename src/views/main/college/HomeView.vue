<script setup lang="ts">
import { CommonService } from '@/services/CommonService'

const userInfoR = CommonService.getUserInfoService()
</script>
<template>
  <el-row class="my-row">
    <el-col>
      <h3>{{ userInfoR?.name }}</h3>
      <h3>{{ userInfoR?.collName }}</h3>
      <h3>{{ userInfoR?.catNames }}</h3>
      <h3>{{ userInfoR?.majorName }}</h3>
    </el-col>
  </el-row>
</template>
