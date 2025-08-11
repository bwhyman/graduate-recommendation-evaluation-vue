import type { Category, Item } from '@/types'
import { render, type ComponentInternalInstance } from 'vue'

export const AddItemDialog = (
  instance: ComponentInternalInstance,
  item: Item,
  category?: Category
) => {
  const node = h(
    defineAsyncComponent(() => import('./ItemDialog.vue')),
    { parentItem: item, category }
  )
  node.appContext = instance?.appContext || null

  render(node, document.body)
}
