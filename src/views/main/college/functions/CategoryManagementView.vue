<script setup lang="ts">
import { createElNotificationSuccess } from '@/components/message'
import { CollegeService } from '@/services/CollegeService'
import type { Category, Major } from '@/types'
import { ArrowDown, ArrowUp, EditPen } from '@element-plus/icons-vue'
const categoriesMajorsR = await CollegeService.listcategoryMajorsService()
const cats: Category[] = []
watch(
  categoriesMajorsR,
  () => {
    cats.length = 0
    categoriesMajorsR.value.forEach(cm => cm.category && cats.push(cm.category))
  },
  { immediate: true }
)

const majorR = ref<Major>({})
const addMajorActiveR = ref(false)

const openAddF = () => {
  addMajorActiveR.value = !addMajorActiveR.value
  majorR.value = {}
}

const addMajorActiveF = async () => {
  await CollegeService.addMajorService(majorR.value)
  createElNotificationSuccess('专业添加成功')
  addMajorActiveR.value = false
  majorR.value = {}
}

const addMajorDisC = computed(() => majorR.value.name && majorR.value.catId)
</script>
<template>
  <el-row class="my-row">
    <el-col>
      <el-button type="primary" @click="openAddF" style="margin-bottom: 8px">
        <el-icon>
          <component :is="addMajorActiveR ? ArrowUp : ArrowDown" />
        </el-icon>
      </el-button>
      <br />

      <div class="flex" v-if="addMajorActiveR">
        <el-select
          value-key="id"
          v-model="majorR.catId"
          placeholder="类别"
          size="large"
          style="width: 200px; margin-right: 10px">
          <el-option v-for="(cat, index) of cats" :key="index" :label="cat.name" :value="cat.id" />
        </el-select>
        <el-input
          style="width: 240px; margin-right: 8px"
          v-model="majorR.name"
          placeholder="*专业名称" />
        <el-button type="primary" @click="addMajorActiveF" :disabled="!addMajorDisC">
          <el-icon><EditPen /></el-icon>
        </el-button>
      </div>

      <br />
      <div v-for="cat of categoriesMajorsR" :key="cat.category?.id" class="dashed">
        <span style="font-size: 18px; font-weight: bold">{{ cat.category?.name }}</span>
        :
        <span v-for="major of cat.majors" :key="major.id" style="margin-right: 8px">
          {{ major.name }};
        </span>
      </div>
    </el-col>
  </el-row>
</template>
<style scoped>
.dashed {
  border-top: 2px dashed #dcdfe6;
  margin: 8px;
  padding: 8px;
}
</style>
