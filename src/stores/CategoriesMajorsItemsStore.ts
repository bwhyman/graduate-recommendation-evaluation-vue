import type { CategoryMajors, Item, Major } from '@/types'
import type { ShallowRef } from 'vue'

const categoryMajorsR = shallowRef<CategoryMajors[]>()
const majorsMapR = shallowRef(new Map<string, ShallowRef<Major[]>>())

// cat下的所有items
const catItemsMapR = shallowRef(new Map<string, ShallowRef<Item[]>>())

// item下的所有items
const itemsMapR = shallowRef(new Map<string, ShallowRef<Item[]>>())

const store = { categoryMajorsR, majorsMapR, catItemsMapR, itemsMapR }

export const useCategoriesMajorsItemsStore = () => store
