<script setup lang="ts">
import type { StudentItemLog } from '@/types'

const dialogVisible = ref(true)
const props = defineProps<{ close: () => void; logs: StudentItemLog[] }>()
const closeF = () => {
  dialogVisible.value = false
  props.close()
}
</script>
<template>
  <el-dialog v-model="dialogVisible" title="日志" @close="closeF">
    <div>
      <p v-for="log of props.logs" :key="log.id">{{ log.comment }}( {{ log.createTime }})</p>
    </div>
  </el-dialog>
</template>
