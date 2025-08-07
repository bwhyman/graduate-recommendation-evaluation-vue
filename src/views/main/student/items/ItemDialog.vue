<script setup lang="ts">
import { StudentService } from '@/services/StudentService'
import ItemNode from './ItemNode.vue'

const dialogVisible = ref(true)
const itemId = useRoute().params.itemid as string

const callback = inject('callback') as { activeItemDialogR: Ref }

// 第一级及以下
const allItemsR = await StudentService.listItemsService(itemId)
const level1Item = allItemsR.value
const childrenItemsR = shallowRef(allItemsR.value.items ?? [])

const closeF = () => {
  callback.activeItemDialogR.value = false
}
</script>
<template>
  <el-dialog v-model="dialogVisible" title="添加项" @close="closeF">
    <div>
      <h3 class="title">
        {{ level1Item?.name }} - 最高 {{ level1Item?.maxPoints }} 分
        <span v-if="level1Item?.maxItems">限项: {{ level1Item?.maxItems }}</span>
      </h3>
      <p>
        {{ level1Item?.comment }}
      </p>
    </div>

    <el-form>
      <ItemNode :items="childrenItemsR" :key="itemId" />
    </el-form>
  </el-dialog>
</template>
<style scoped>
.title {
  margin-bottom: 10px;

  color: #409eff;
}
</style>
