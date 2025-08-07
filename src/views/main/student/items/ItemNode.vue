<script setup lang="ts">
import { createElNotificationSuccess } from '@/components/message'
import { StudentService } from '@/services/StudentService'
import type { Item, StudentItem } from '@/types'
import { EditPen } from '@element-plus/icons-vue'
const props = defineProps<{
  items: Item[]
}>()
//
const rootitemid = useRoute().params.itemid as string
const selectItemIdR = shallowRef()
const selectItemR = shallowRef<Item>()
const childrenItemsR = shallowRef<Item[]>([])
const studentItemR = ref<StudentItem>({})

const activeF = ref(false)

const selectItemF = () => {
  const parentItemId = selectItemIdR.value
  selectItemR.value = props.items.find(ite => ite.id === parentItemId)
  childrenItemsR.value = props.items.find(ite => ite.id === parentItemId)?.items ?? []
  activeF.value = childrenItemsR.value.length === 0
}
const callback = inject('callback') as { activeItemDialogR: Ref }
const submitF = async () => {
  if (!studentItemR.value.name) {
    throw '必须添加标题'
  }

  //
  studentItemR.value.rootItemId = rootitemid
  studentItemR.value.itemId = selectItemR.value?.id
  await StudentService.addStudentItemService(studentItemR.value, rootitemid)
  createElNotificationSuccess('指标项添加成功')
  callback.activeItemDialogR.value = false
  studentItemR.value = {}
}
const submitDisabledC = computed(() => !studentItemR.value.name)
</script>
<template>
  <el-form-item>
    <el-radio-group size="large" v-model="selectItemIdR" @change="selectItemF">
      <el-radio-button
        v-for="item of props.items"
        :key="item.id"
        :label="item.name"
        :value="item.id" />
    </el-radio-group>
  </el-form-item>

  <div v-if="selectItemR" style="white-space: pre-wrap">
    <p>
      {{ selectItemR?.name }}； 总分：
      <el-tag type="success">{{ selectItemR?.maxPoints }}</el-tag>
      分;
      <span v-if="selectItemR?.maxItems">
        限项：
        <el-tag type="success">{{ selectItemR?.maxItems }}</el-tag>
        项；
      </span>
    </p>
    <p>
      {{ selectItemR.comment }}
    </p>
  </div>

  <el-divider border-style="dashed" />
  <ItemNode v-if="childrenItemsR.length > 0" :items="childrenItemsR" :key="selectItemIdR" />

  <div v-if="activeF">
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
  </div>
</template>
<style scoped>
.col-title {
  text-align: right;
}
</style>
