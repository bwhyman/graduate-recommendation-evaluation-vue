import type { Item } from '@/types'
import type { ShallowRef } from 'vue'

const itemsR = shallowRef<Item[]>()
const catItemsMapR = shallowRef(new Map<string, ShallowRef<Item[]>>())

const clear = () => {
  itemsR.value = undefined
  catItemsMapR.value.clear()
}
const store = {
  itemsR,
  catItemsMapR,
  clear
}
export const useItemStore = () => store
