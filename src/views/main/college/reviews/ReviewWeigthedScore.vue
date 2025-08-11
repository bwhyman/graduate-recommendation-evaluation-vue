<script setup lang="ts">
import { createElNotificationSuccess } from '@/components/message'
import { CollegeService } from '@/services/CollegeService'
import { CommonService } from '@/services/CommonService'
import type { ComfirmWeightedScoreReq, WeightedScore, WeightedScoreLog } from '@/types'
import { EditPen } from '@element-plus/icons-vue'
//
const props = defineProps<{ sid: string }>()

const adminR = CommonService.getUserInfoService()
const weightedScoreR = ref<WeightedScore>({})

const { data: dataweightedScoreR, suspense } = CollegeService.getStudentWeightedScoreService(
  props.sid
)
await suspense()
weightedScoreR.value = { ...dataweightedScoreR.value }
//

const { mutateAsync } = CollegeService.updateStudentWeightedScoreService(props.sid)

const submitWeightedScoreF = async () => {
  const comment = `${adminR.value?.name}，认定加权成绩：${dataweightedScoreR.value?.score}；排名：${dataweightedScoreR.value?.ranking}`
  const log: WeightedScoreLog = { studentId: props.sid, comment: comment }
  const req: ComfirmWeightedScoreReq = { weightedScore: weightedScoreR.value, log: log }
  await mutateAsync({ sid: props.sid, req: req })
  createElNotificationSuccess('加权成绩数据已更新')
}
</script>
<template>
  <el-row>
    <el-col>
      <span class="title">
        加权成绩数据
        <span v-if="dataweightedScoreR?.verified" style="color: green; font-weight: bold">
          已认定
        </span>
        <span v-else style="color: red; font-weight: bold">未认定</span>
      </span>
    </el-col>
  </el-row>

  <el-row align="middle">
    <el-col :span="6">
      <el-input-number
        v-model="weightedScoreR.score"
        :max="100"
        :min="0"
        :precision="2"
        size="large"
        placeholder="加权成绩" />
    </el-col>
    <el-col :span="6">
      <el-input-number
        v-model="weightedScoreR.ranking"
        :min="0"
        size="large"
        placeholder="专业排名" />
    </el-col>
    <el-col :span="6">
      <el-button type="primary" @click="submitWeightedScoreF">
        <el-icon><EditPen /></el-icon>
      </el-button>
    </el-col>
  </el-row>
</template>
<style scoped>
.title {
  margin-bottom: 10px;
  font-size: 18px;
  color: #409eff;
}
.col-title {
  text-align: right;
}
.info-tag {
  width: 50px;
}
</style>
