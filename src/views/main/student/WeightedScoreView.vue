<script setup lang="ts">
import { createElNotificationSuccess } from '@/components/message'
import { StudentService } from '@/services/StudentService'
import type { WeightedScore } from '@/types'
import { EditPen } from '@element-plus/icons-vue'

const weightScoreR = ref<WeightedScore>({})
const { data: result, suspense } = StudentService.getWeightedScoreService()
const { mutateAsync } = StudentService.addWeightedScoreService()
await suspense()

weightScoreR.value = { ...result.value }

const submitF = async () => {
  const score = weightScoreR.value.score
  const ranking = weightScoreR.value.ranking
  if (!score || score > 100) {
    throw '必须提供加权成绩，且必然大于0小于100分'
  }
  if (!ranking || ranking <= 0) {
    throw '必须提供专业排名，且必然大于0'
  }
  if (weightScoreR?.value.verified === 1) {
    throw '已认定，无法修改'
  }
  await mutateAsync(weightScoreR.value)
  createElNotificationSuccess('更新成绩成功')
}

const submitDisC = computed(() => {
  const score = weightScoreR.value.score
  const ranking = weightScoreR.value.ranking
  return score && score <= 100 && ranking && ranking > 0
})

const isVerified = () => weightScoreR.value.verified === 1
</script>
<template>
  <el-row class="my-row">
    <el-col>
      <p style="margin-bottom: 8px">成绩认定后将禁止修改。</p>
      <div style="margin-bottom: 8px" v-if="isVerified()">
        <p>
          加权成绩：
          <el-tag type="success">{{ weightScoreR.score }}</el-tag>
          ; 专业排名：
          <el-tag type="success">{{ weightScoreR.ranking }}</el-tag>
          ;
        </p>
      </div>

      <el-form label-width="80px" style="width: 500px" v-if="!isVerified()">
        <el-form-item label="加权成绩">
          <el-input-number
            v-model="weightScoreR.score"
            :max="100"
            :min="0"
            :precision="2"
            size="large"
            placeholder="加权成绩" />
        </el-form-item>
        <el-form-item label="专业排名">
          <el-input-number
            v-model="weightScoreR.ranking"
            :min="0"
            size="large"
            placeholder="专业排名" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitF" :disabled="!submitDisC">
            <el-icon><EditPen /></el-icon>
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
