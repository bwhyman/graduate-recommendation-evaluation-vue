<script setup lang="ts">
import { CollegeService } from '@/services/CollegeService'
import type { Category } from '@/types'
import { AddItemDialog } from './CreateItemDialog'
import ItemNode from './ItemNode.vue'

const props = defineProps<{ category: Category }>()
const itemsR = await CollegeService.listCategoryItemsService(props.category.id ?? '')
const getTopItems = () => itemsR.value.filter(i => !i.parentId)
</script>
<template>
  <div>
    <h3 @click="AddItemDialog({}, props.category)" style="cursor: pointer">
      {{ props.category.name }}
    </h3>
    <ItemNode v-for="item of getTopItems()" :item="item" :allitems="itemsR" :key="item.id" />
  </div>
</template>
