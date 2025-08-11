<script setup lang="ts">
import { createElNotificationSuccess } from '@/components/message'
import { CollegeService } from '@/services/CollegeService'
import { CommonService } from '@/services/CommonService'
import { CONFIRMED, PENDING_MODIFICATION, REJECTED } from '@/services/Const'
import type { StudentItem, StudentItemLog, StudentItemResp } from '@/types'
import { EditPen } from '@element-plus/icons-vue'

const dialogVisible = ref(true)
const props = defineProps<{ close: () => void; stuitem: StudentItemResp }>()
const pointR = ref(props.stuitem.point ?? 0)
const checkStatusR = ref()
const commentR = ref('')

const isConfirmC = computed(() => checkStatusR.value === 'confirm')

const disSubmitC = computed(
  () => !checkStatusR.value || (props.stuitem.maxPoints && pointR.value > props.stuitem.maxPoints)
)

const closeF = () => {
  props.close()
}

//
const adminUser = CommonService.getUserInfoService()
//

const { mutateAsync } = CollegeService.updateStudentItemSercice(props.stuitem.userId!)

const submitF = async () => {
  const stuItem: StudentItem = { id: props.stuitem.id }
  const log: StudentItemLog = { studentItemId: props.stuitem.id }

  if (checkStatusR.value === 'confirm') {
    if (!pointR.value) {
      throw '未声明分数'
    }
    if (props.stuitem.maxPoints && pointR.value > props.stuitem.maxPoints) {
      throw '认定分数不能大于项最高分数'
    }
    stuItem.point = pointR.value
    stuItem.status = CONFIRMED
    log.comment = `${adminUser.value?.name}，认定分数为${pointR.value}`
  }

  if (checkStatusR.value === 'reject') {
    stuItem.point = undefined
    stuItem.status = REJECTED
    log.comment = `${adminUser.value?.name}，驳回指标项，建议移除此项。${commentR.value}`
  }
  if (checkStatusR.value === 'modif') {
    stuItem.point = undefined
    stuItem.status = PENDING_MODIFICATION
    log.comment = `${adminUser.value?.name}，建议修改。${commentR.value}`
  }

  await mutateAsync({ sid: props.stuitem.userId!, stuItem, log })
  createElNotificationSuccess('审核成功')
  props.close()
}
</script>
<template>
  <el-dialog v-model="dialogVisible" destroy-on-close @close="closeF">
    <h3 style="margin-bottom: 8px">审核</h3>
    <el-row :gutter="10" class="row" align="middle">
      <el-col :span="2" class="col-title"></el-col>
      <el-col :span="6">
        <el-radio-group size="large" v-model="checkStatusR">
          <el-radio-button label="认定" value="confirm" class="custom-color-confirm" />
          <el-radio-button label="驳回" value="reject" class="custom-color-reject" />
          <el-radio-button label="修改" value="modif" class="custom-color-modif" />
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="row" align="middle">
      <el-col :span="2" class="col-title"></el-col>
      <el-col :span="6">
        <el-input-number
          :disabled="!isConfirmC"
          v-model="pointR"
          :max="props.stuitem.maxPoints"
          :min="0"
          :precision="2"
          size="large"
          placeholder="认定分数" />
      </el-col>
      <el-col :span="4">项最高分：{{ props.stuitem.maxPoints }}</el-col>
    </el-row>
    <el-row :gutter="10" class="row" align="middle" v-if="!isConfirmC">
      <el-col :span="2" class="col-title"></el-col>
      <el-col :span="10">
        <el-input
          v-model="commentR"
          type="textarea"
          :autosize="{ minRows: 4 }"
          placeholder="驳回/修改，信息说明" />
      </el-col>
    </el-row>
    <el-row :gutter="10" class="row" align="middle">
      <el-col :span="2" class="col-title"></el-col>
      <el-col :span="10">
        <el-button type="primary" :disabled="disSubmitC" @click="submitF">
          <el-icon><EditPen /></el-icon>
        </el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<style scoped>
/* 针对不同的选项设置不同的颜色 */
.custom-color-confirm.is-active {
  --el-radio-button-checked-bg-color: #67c23a;
}

.custom-color-reject.is-active {
  --el-radio-button-checked-bg-color: #f56c6c;
}

.custom-color-modif.is-active {
  --el-radio-button-checked-bg-color: #e6a23c;
}
</style>
