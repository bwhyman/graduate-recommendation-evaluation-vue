<script setup lang="ts">
import { createElNotificationSuccess } from '@/components/message'
import { CollegeService } from '@/services/CollegeService'
import { User as UserICO } from '@element-plus/icons-vue'
const accountR = ref('')

const submitF = async () => {
  if (!accountR.value || accountR.value.length == 0) {
    throw '请输入账号'
  }
  await CollegeService.updatePasswordService(accountR.value)
  createElNotificationSuccess('重置成功')
  accountR.value = ''
}
</script>
<template>
  <el-row class="my-row">
    <el-col>
      <el-form label-width="80px" style="width: 400px">
        <el-form-item>
          <el-input v-model="accountR" placeholder="账号" size="large" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitF" :disabled="!accountR">
            <el-icon><UserICO /></el-icon>
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
