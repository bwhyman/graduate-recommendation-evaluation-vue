import type { StudentItem, StudentItemsStatusDO, WeightedScore } from '@/types'
import type { ShallowRef } from 'vue'

const weightedScoreR = shallowRef<WeightedScore>()
const studentItemsMapR = shallowRef(new Map<string, ShallowRef<StudentItem[]>>())

const studentItemStatusR = shallowRef<StudentItemsStatusDO>()

const store = {
  weightedScoreR,
  studentItemsMapR,
  studentItemStatusR
}
export const useStudentScoreitemsStore = () => store
