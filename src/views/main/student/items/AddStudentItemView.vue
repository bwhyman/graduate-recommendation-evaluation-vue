<script setup lang="ts">
import { StudentService } from '@/services/StudentService'
import type { Item, StudentItemResp } from '@/types'
import { Plus } from '@element-plus/icons-vue'
import type { ShallowRef } from 'vue'
import AddForm from './AddForm.vue'
import ItemNode from './ItemNode.vue'

const dialogVisible = ref(false)
const rootItemId = useRoute().params.itemid as string

let studentItemsR: ShallowRef<StudentItemResp[]>

const selectItemR = ref<Item>({})
const limitItemR = ref<Item>({})
const activeAddForm = ref(false)
const activeMaxItemR = ref(false)

// 第一级及以下
let rootItemR: ShallowRef<Item>
const activeF = async () => {
  const result = await Promise.all([
    StudentService.listStudentItemsService(rootItemId),
    StudentService.listItemsService(rootItemId)
  ])
  studentItemsR = result[0]
  rootItemR = result[1]
  dialogVisible.value = true
  activeMaxItemR.value = false
}
//

const selectItemCallback = (item: Item) => {
  activeMaxItemR.value = false
  selectItemR.value = item
  const rootItem = rootItemR.value

  // 查找从根到目标节点的路径
  function findPathToNode(item: Item[], targetId: string, path: Item[] = []): Item[] | null {
    for (const chitem of item) {
      const currentPath = [...path, chitem]
      if (chitem.id === targetId) return currentPath
      if (chitem.items?.length) {
        const result = findPathToNode(chitem.items, targetId, currentPath)
        if (result) return result
      }
    }
    return null
  }
  const nodePath = findPathToNode(rootItem.items!, item.id!) ?? []

  // 查找每个路径的全部叶子
  function findLeafs(item: Item[], leafItems: Item[] = []) {
    for (const path of item) {
      if (path.items && path.items.length > 0) {
        findLeafs(path.items, leafItems)
      } else {
        leafItems.push(path)
      }
    }
    return leafItems
  }
  // 路径节点为键，叶子数组为值
  const nodeMap = new Map<Item, Item[]>()
  for (const path of nodePath) {
    nodeMap.set(path, findLeafs(nodePath))
  }

  for (const node of nodeMap) {
    for (const sitem of node[1]) {
      const x = studentItemsR.value.filter(stu => stu.itemId === sitem.id)
      if (node[0].maxItems && x.length >= node[0]?.maxItems) {
        limitItemR.value = node[0]
        activeMaxItemR.value = true
        return
      }
    }
  }
}
//
provide('selectItemCallback', { selectItemCallback, activeAddForm })
//
const closeF = () => {
  activeAddForm.value = false
  dialogVisible.value = false
  activeMaxItemR.value = false
}

const addForm = defineAsyncComponent(() => import('./AddForm.vue'))
</script>
<template>
  <el-button type="primary" @click="activeF">
    <el-icon><Plus /></el-icon>
  </el-button>

  <el-dialog v-model="dialogVisible" title="添加项" @close="closeF">
    <div>
      <h3 class="title">
        {{ rootItemR?.name }} - 最高 {{ rootItemR?.maxPoints }} 分
        <span v-if="rootItemR?.maxItems">限项: {{ rootItemR?.maxItems }}</span>
      </h3>
      <p>
        {{ rootItemR?.comment }}
      </p>
    </div>

    <el-form v-if="dialogVisible">
      <ItemNode :items="rootItemR.items ?? []" :key="rootItemId" />
    </el-form>
    <div v-if="activeMaxItemR">
      <el-tag type="danger" size="large">{{ limitItemR.name }}：已达到限项数！</el-tag>
    </div>
    <addForm v-if="activeAddForm && !activeMaxItemR" :item="selectItemR" :close="closeF" />
  </el-dialog>
</template>
<style scoped>
.title {
  margin-bottom: 10px;

  color: #409eff;
}
</style>
