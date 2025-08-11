<script setup lang="ts">
import { createElNotificationSuccess } from '@/components/message'
import { StudentService } from '@/services/StudentService'
import type { Item, StudentItem } from '@/types'
import { EditPen } from '@element-plus/icons-vue'

const dialogVisible = ref(true)
const studentItemR = ref<StudentItem>({})
interface Props {
  item: Item
  rootitemid: string
  close: () => void
  studentitem?: StudentItem
}

const props = defineProps<Props>()

props.studentitem && (studentItemR.value = props.studentitem)

//
const { mutate, isSuccess } = StudentService.updateStudentItemService(props.rootitemid)

const submitF = () => {
  if (!studentItemR.value.name) {
    throw '必须添加标题'
  }
  if (!props.studentitem || !props.studentitem.id) {
    throw '读取错误'
  }
  mutate({ studentItemId: studentItemR.value.id!, stuItem: studentItemR.value })
  watch(isSuccess, () => {
    createElNotificationSuccess('指标项更新成功')
    props.close()
  })
}
const submitDisabledC = computed(() => !studentItemR.value.name)

const wWidth = ref(window.innerWidth)
const widthC = computed(() => {
  return wWidth.value < 768 ? '80%' : '50%'
})
</script>
<template>
  <el-dialog v-model="dialogVisible" title="添加项" :width="widthC" @close="props.close">
    <el-row :gutter="10" class="row">
      <el-col :span="2" class="col-title"></el-col>
      <el-col :span="10">
        {{ props.item.name }}； 总分：
        <el-tag type="success">{{ props.item.maxPoints }}</el-tag>
        分;
        <span v-if="props.item?.maxItems">
          限项：
          <el-tag type="success">{{ props.item?.maxItems }}</el-tag>
          项；
        </span>
      </el-col>
    </el-row>

    <el-row :gutter="10" class="row">
      <el-col :span="2" class="col-title">*标题</el-col>
      <el-col :span="10">
        <el-input
          v-model="studentItemR.name"
          placeholder="项名称描述，例如：2046年度软件杯国赛一等奖" />
      </el-col>
    </el-row>
    <el-row :gutter="10" class="row">
      <el-col :span="2" class="col-title">说明</el-col>
      <el-col :span="10">
        <el-input
          v-model="studentItemR.comment"
          type="textarea"
          :autosize="{ minRows: 4 }"
          placeholder="详尽描述，例如：本人为作品第三作者... ..." />
      </el-col>
    </el-row>
    <el-row :gutter="10" class="row">
      <el-col :span="2"></el-col>
      <el-col :span="12">
        <el-button type="primary" @click="submitF" :disabled="submitDisabledC">
          <el-icon><EditPen /></el-icon>
        </el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<style scoped>
.col-title {
  text-align: right;
}
</style>
