<script setup lang="ts">
import { StudentService } from '@/services/StudentService'

const dialogVisible = ref(true)
const props = defineProps<{ close: () => void; stuItemId: string }>()

const { data: logsR, suspense } = StudentService.listStudentItemLogsService(props.stuItemId)
await suspense()
const closeF = () => {
  dialogVisible.value = false
  props.close()
}
</script>
<template>
  <el-dialog v-model="dialogVisible" title="日志" @close="closeF">
    <div>
      <p v-for="log of logsR" :key="log.id">{{ log.comment }}( {{ log.createTime }})</p>
    </div>
  </el-dialog>
</template>
