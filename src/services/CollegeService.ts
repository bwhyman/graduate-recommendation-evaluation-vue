import { useGet, usePost } from '@/axios'
import { useCategoryMajorsStore } from '@/stores/CategoryStore'
import { useItemStore } from '@/stores/ItemStore'
import type { CategoryMajors, Item, Major } from '@/types'
import { StoreCache, StoreMapCache } from './Decorators'

const addPreUrl = (url: string) => `college/${url}`

const categoryMajorsStore = useCategoryMajorsStore()
const itemStore = useItemStore()

export class CollegeService {
  //
  @StoreCache(categoryMajorsStore.categoryMajorsR)
  static async listcategoryMajorsService() {
    const result = await useGet<CategoryMajors[]>(addPreUrl('categories'))
    return shallowRef(result)
  }
  @StoreCache(categoryMajorsStore.categoryMajorsR, true)
  static async addMajorService(major: Major) {
    const result = await usePost(addPreUrl('majors'), major)
    return shallowRef(result)
  }

  @StoreMapCache(itemStore.catItemsMapR)
  static async listCategoryItemsService(catid: string) {
    const result = await useGet<Item[]>(addPreUrl(`categories/${catid}/items`))
    return shallowRef(result)
  }

  @StoreMapCache(itemStore.catItemsMapR, { replace: true, indexs: [0] })
  static async addItemService(catId: string, item: Item) {
    const result = await usePost<Item[]>(addPreUrl('items'), item)
    return shallowRef(result)
  }
}
