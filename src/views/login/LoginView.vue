<script lang="ts" setup>
import { CommonService } from '@/services/CommonService'
import type { User } from '@/types'
import { Lock, SwitchButton, User as UserIco } from '@element-plus/icons-vue'

const user = ref<User>({})

const loginF = async () => {
  const account = user.value.account
  const password = user.value.password
  await CommonService.loginService({
    account: account,
    password: password
  })
  user.value.account = ''
  user.value.password = ''
}
</script>

<template>
  <el-row>
    <el-col :span="10" style="margin-top: 15px" @keyup.enter="loginF">
      <div style="margin-bottom: 15px">
        <el-input
          size="large"
          v-model="user.account"
          placeholder="账号"
          :prefix-icon="UserIco"
          style="margin-bottom: 10px" />
        <el-input
          type="password"
          size="large"
          v-model="user.password"
          placeholder="密码"
          :prefix-icon="Lock" />
      </div>

      <el-button type="primary" @click="loginF" :disabled="!user.account || !user.password">
        <el-icon><SwitchButton /></el-icon>
      </el-button>
      1000002720; 2022223893
    </el-col>
  </el-row>
</template>
