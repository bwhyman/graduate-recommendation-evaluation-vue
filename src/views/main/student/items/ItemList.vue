<script setup lang="ts">
import { StudentService } from '@/services/StudentService'
import type { Item } from '@/types'
import ItemNode from './ItemNode.vue'

const itemId = useRoute().params.itemid as string
// 第二级及以下
const allItemsR = await StudentService.listItemsService(itemId)
const childrenItemsR = shallowRef(allItemsR.value.filter(ite => ite.parentId === itemId))

const gradingDialogVisable = ref(false)
const callback = ref<{ item?: Item; addDialogV: Ref<boolean> }>({
  addDialogV: gradingDialogVisable
})
provide('callback', callback)

const StudentItemDialog = defineAsyncComponent(() => import('../StudentItemDialog.vue'))

const closeF = () => (gradingDialogVisable.value = false)
</script>
<template>
  <el-form>
    <ItemNode :items="childrenItemsR" :allitems="allItemsR" :key="itemId" />
  </el-form>

  <StudentItemDialog
    v-if="gradingDialogVisable"
    :rootitemid="itemId"
    :item="callback.item!"
    :close="closeF" />
</template>
