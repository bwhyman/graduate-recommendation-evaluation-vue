<script setup lang="ts">
import type { Item, StudentItem } from '@/types'

const props = defineProps<{
  items: Item[]
  studentitems: StudentItem[]
  getRootId?: (selectItem: Item) => void
}>()
const selectItemIdR = shallowRef('')
const selectItemR = shallowRef<Item>()
const childrenItemsR = shallowRef<Item[]>([])

const selectItemF = () => {
  const parentItemId = selectItemIdR.value
  selectItemR.value = props.items.find(ite => ite.id === parentItemId)
  childrenItemsR.value = props.items.find(ite => ite.id === parentItemId)?.items ?? []
  props.getRootId && props.getRootId(selectItemR.value!)
}
</script>
<template>
  <div>
    <el-form-item style="margin-bottom: 8px">
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
    <ItemNode
      v-if="childrenItemsR.length > 0"
      :items="childrenItemsR"
      :studentitems="props.studentitems"
      :key="selectItemIdR"
      :get-root-id="getRootId" />
  </div>
</template>
<style scoped>
.title {
  font-size: 16px;
  color: #409eff;
  margin-right: 8px;
}
</style>
