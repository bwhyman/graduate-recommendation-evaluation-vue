import type { Item, StudentItem, WeightedScore } from '@/types'
import type { ShallowRef } from 'vue'

const ItemsMapR = shallowRef(new Map<string, ShallowRef<Item[]>>())
const weightedScoreR = shallowRef<WeightedScore>()

const studentItemsMapR = shallowRef(new Map<string, ShallowRef<StudentItem[]>>())

const clear = () => {
  ItemsMapR.value.clear()
}

const store = {
  ItemsMapR,
  weightedScoreR,
  studentItemsMapR,
  clear
}
export const useScoreitemsStore = () => store
