<script setup lang="ts">
import type { Item } from '@/types'
//
const props = defineProps<{ items: Item[] }>()

const callback = inject('selectItemCallback') as {
  selectItemCallback: (item: Item) => void
  activeAddForm: Ref<boolean>
}

//el-radio-button，仅支持绑定ID，不支持直接传对象
const selectItemIdR = shallowRef()
const selectItemR = shallowRef<Item>()
//
const childrenItemsR = shallowRef<Item[]>([])

const selectItemF = () => {
  const parentItemId = selectItemIdR.value
  selectItemR.value = props.items.find(ite => ite.id === parentItemId)
  childrenItemsR.value = props.items.find(ite => ite.id === parentItemId)?.items ?? []
  callback.activeAddForm.value = childrenItemsR.value.length === 0
  callback.selectItemCallback(selectItemR.value!)
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
</template>
<style scoped>
.col-title {
  text-align: right;
}
</style>
