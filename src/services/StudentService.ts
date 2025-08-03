import { useDelete, useGet, usePatch, usePost } from '@/axios'
import { useScoreitemsStore } from '@/stores/ScoreItemsStore'
import type {
  College,
  Item,
  Major,
  StudentItem,
  StudentItemResp,
  User,
  WeightedScore
} from '@/types'
import { CommonService } from './CommonService'
import { ELLoading, StoreCache, StoreClearObject, StoreMapCache } from './Decorators'

const addPreUrl = (url: string) => `student/${url}`

const scoreItemsStore = useScoreitemsStore()

export class StudentService {
  static async registerService(user: User) {
    await usePost('open/register', user)
  }

  static async listLevel1ItemsService() {
    const result = await useGet<Item[]>(addPreUrl('topitems'))
    return shallowRef(result)
  }

  @StoreMapCache(scoreItemsStore.ItemsMapR)
  @ELLoading()
  static async listItemsService(itemid: string) {
    const result = await useGet<Item[]>(addPreUrl(`items/${itemid}`))
    return shallowRef(result)
  }

  @StoreCache(scoreItemsStore.weightedScoreR)
  static async getWeightedScoreService() {
    const weightedScore = await useGet<WeightedScore>(addPreUrl('weightedscores'))
    return shallowRef(weightedScore)
  }

  @StoreClearObject(scoreItemsStore.weightedScoreR)
  static async addWeightedScoreService(score: WeightedScore) {
    const result = await usePost<WeightedScore>(addPreUrl('weightedscores'), score)
  }

  static async listCollegesService() {
    return await useGet<{ college: College; majors: Major[] }[]>('open/colleges')
  }

  @StoreMapCache(scoreItemsStore.studentItemsMapR)
  static async listStudentItemsService(rootitemid: string) {
    const result = await useGet<StudentItemResp[]>(addPreUrl(`studentitems/${rootitemid}`))
    return shallowRef(result)
  }

  //
  static async downloadStudentItemFileService(id: string, name: string) {
    const resp = await CommonService.downloadFile(addPreUrl(`studentitems/files/${id}`), name)
  }

  // 之前按rootitemid为键缓存的
  @StoreMapCache(scoreItemsStore.studentItemsMapR, { replace: true, indexs: [1] })
  static async removeStudentItemFileService(fileid: string, rootitemid: string) {
    const resp = await useDelete<StudentItemResp[]>(
      addPreUrl(`studentitems/${rootitemid}/files/${fileid}`)
    )
    return shallowRef(resp)
  }
  //
  @StoreMapCache(scoreItemsStore.studentItemsMapR, { replace: true, indexs: [1] })
  static async removeStudentItemService(id: string, rootitemid: string) {
    const resp = await useDelete<StudentItemResp[]>(
      addPreUrl(`studentitems/${rootitemid}/sitems/${id}`)
    )
    return shallowRef(resp)
  }

  @StoreMapCache(scoreItemsStore.studentItemsMapR, { replace: true, indexs: [1] })
  static async addStudentItemService(stuItem: StudentItem, rootitemid: string) {
    const resp = await usePost<StudentItemResp[]>(addPreUrl('studentitems'), stuItem)
    return shallowRef(resp)
  }
  //
  @StoreMapCache(scoreItemsStore.studentItemsMapR, { replace: true, indexs: [2] })
  static async uploadStudentItemFileService(
    fdata: FormData,
    stuitemid: string,
    rootitemid: string
  ) {
    const resp = await usePost<StudentItemResp[]>(
      addPreUrl(`studentitems/${stuitemid}/files/rootitems/${rootitemid}`),
      fdata
    )
    return shallowRef(resp)
  }

  @StoreMapCache(scoreItemsStore.studentItemsMapR, { replace: true, indexs: [1] })
  static async updateStudentItemService(
    stuItem: StudentItem,
    rootitemid: string,
    studentItemId: string
  ) {
    const resp = await usePatch<StudentItemResp[]>(
      addPreUrl(`studentitems/${rootitemid}/sitems/${studentItemId}`),
      stuItem
    )
    return shallowRef(resp)
  }
}
