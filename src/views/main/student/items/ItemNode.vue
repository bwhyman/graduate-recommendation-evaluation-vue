<script setup lang="ts">
import type { Item } from '@/types'

const props = defineProps<{
  items: Item[]
  allitems: Item[]
}>()

const selectItemIdR = shallowRef()
const selectItemR = shallowRef<Item>()
const childrenItemsR = shallowRef<Item[]>([])

const callback = inject('callback') as Ref<{
  item?: Item
  addDialogV: boolean
}>

const selectItemF = () => {
  const parentItemId = selectItemIdR.value
  selectItemR.value = props.items.find(ite => ite.id === parentItemId)
  childrenItemsR.value = props.allitems.filter(ite => ite.parentId === parentItemId)
  //
  selectItemR.value && (callback.value.item = selectItemR.value)
  callback.value.addDialogV = childrenItemsR.value.length === 0
}
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

  <el-divider border-style="dashed" />
  <ItemNode
    v-if="childrenItemsR.length > 0"
    :items="childrenItemsR"
    :allitems="props.allitems"
    :key="selectItemIdR" />
</template>
