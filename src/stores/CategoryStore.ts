import type { CategoryMajors } from '@/types'

const categoryMajorsR = shallowRef<CategoryMajors[]>()

const store = { categoryMajorsR }

export const useCategoryMajorsStore = () => store
