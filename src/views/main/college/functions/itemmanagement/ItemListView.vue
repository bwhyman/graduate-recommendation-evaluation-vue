<script setup lang="ts">
import { CollegeService } from '@/services/CollegeService'
import type { Category } from '@/types'
import { AddItemDialog } from './CreateItemDialog'
import ItemNode from './ItemNode.vue'

const props = defineProps<{ category: Category }>()
const { data: itemsR } = CollegeService.listCategoryItemsService(props.category.id ?? '')
const insinstance = getCurrentInstance()
const getTopItems = () => (itemsR.value ?? []).filter(i => !i.parentId)
</script>
<template>
  <div>
    <h3 @click="AddItemDialog(insinstance!, {}, props.category)" style="cursor: pointer">
      {{ props.category.name }}
    </h3>
    <ItemNode v-for="item of getTopItems()" :item="item" :key="item.id" />
  </div>
</template>
