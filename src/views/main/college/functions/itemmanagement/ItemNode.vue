<script setup lang="ts">
import type { Item } from '@/types'
import { AddItemDialog } from './CreateItemDialog'

const props = defineProps<{ item: Item; allitems: Item[] }>()
const childrenItemsR = shallowRef<Item[]>([])
// 添加后，返回新数据，更新，但组件不会重新创建，通过监听数据实现重新聚合
watch(
  () => props.allitems,
  () => {
    childrenItemsR.value = props.allitems.filter(item => item.parentId === props.item.id)
  },
  { immediate: true }
)
</script>
<template>
  <ul>
    <li>
      <el-text
        type="primary"
        size="large"
        @click="AddItemDialog(props.item)"
        style="cursor: pointer">
        {{ props.item.name }} - {{ props.item.maxPoints }}
      </el-text>

      <template v-if="childrenItemsR.length > 0">
        <ItemNode v-for="ch of childrenItemsR" :key="ch.id" :item="ch" :allitems="props.allitems" />
      </template>
    </li>
  </ul>
</template>
<style scoped>
ul {
  padding-left: 20px;
}
</style>
