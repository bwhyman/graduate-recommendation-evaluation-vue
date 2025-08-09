<script setup lang="ts">
import { createElNotificationSuccess } from '@/components/message'
import { StudentService } from '@/services/StudentService'
import type { Item, StudentItem } from '@/types'
import { EditPen } from '@element-plus/icons-vue'

const props = defineProps<{ item: Item; close: () => void }>()
const rootitemid = useRoute().params.itemid as string
const studentItemR = ref<StudentItem>({})

const submitF = async () => {
  if (!studentItemR.value.name) {
    throw '必须添加标题'
  }

  //
  studentItemR.value.rootItemId = rootitemid
  studentItemR.value.itemId = props.item.id
  await StudentService.addStudentItemService(studentItemR.value)
  props.close()
  createElNotificationSuccess('指标项添加成功')
  studentItemR.value = {}
}
const submitDisabledC = computed(() => !studentItemR.value.name)
</script>
<template>
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
</template>
