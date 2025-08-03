import type { Category, Item } from '@/types'
import { render } from 'vue'

export const AddItemDialog = (item: Item, category?: Category) => {
  const node = h(
    defineAsyncComponent(() => import('./ItemDialog.vue')),
    { parentItem: item, category }
  )
  render(node, document.body)
}
