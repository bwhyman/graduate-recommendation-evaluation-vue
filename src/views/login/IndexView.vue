<script lang="ts" setup>
import LoginView from './LoginView.vue'
const activeName = ref('Login')

const registerCom = defineAsyncComponent(() => import('./RegisterView.vue'))
</script>

<template>
  <el-row>
    <el-col :span="18" :offset="3" style="margin-top: 15px">
      <el-card class="box-card">
        <el-tabs v-model="activeName" class="demo-tabs">
          <el-tab-pane label="Login" name="Login">
            <LoginView />
          </el-tab-pane>
          <el-tab-pane label="Register" name="Register">
            <registerCom v-if="activeName === 'Register'" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
  </el-row>
</template>
