<script setup lang="ts">
import { createElNotificationSuccess } from '@/components/message'
import { CollegeService } from '@/services/CollegeService'
import type { RegisterUserDTO } from '@/types'
import { User as UserICO } from '@element-plus/icons-vue'
//const categoriesR = await CollegeService.listCategoryService()

const result = await CollegeService.listCategoryAdminsService()

const categoriesR = shallowRef(result.value.map(res => res.category))

const userR = ref<RegisterUserDTO>({})
const catidsR = ref<string[]>([])

const submitF = async () => {
  userR.value.catIds = catidsR.value
  await CollegeService.addAdminService(userR.value)
  createElNotificationSuccess('审核人添加成功')
  userR.value = {}
  catidsR.value = []
}
const submitC = computed(() => {
  return userR.value.name && userR.value.account && catidsR.value?.length > 0
})
</script>
<template>
  <el-row class="my-row">
    <el-col>
      <el-form label-width="80px" style="width: 400px">
        <el-form-item>
          <p v-for="catUser of result" :key="catUser.category?.id">
            {{ catUser.category?.name }}:
            <span v-for="user of catUser.users" :key="user.id">{{ user.name }};</span>
          </p>
        </el-form-item>
        <el-form-item>
          <el-input v-model="userR.name" placeholder="*姓名" size="large" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="userR.account" placeholder="*工号" size="large" />
        </el-form-item>
        <el-form-item>
          <el-checkbox-group v-model="catidsR">
            <el-checkbox
              v-for="cat in categoriesR"
              :key="cat?.id"
              :label="cat?.name"
              size="large"
              :value="cat?.id"
              border />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitF" :disabled="!submitC">
            <el-icon><UserICO /></el-icon>
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
