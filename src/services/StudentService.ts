import axios, { useDelete, useGet, usePatch, usePost } from '@/axios'
import { createProgressNotification } from '@/components/progress'
import { useCategoriesMajorsItemsStore } from '@/stores/CategoriesMajorsItemsStore'
import { useStudentScoreitemsStore } from '@/stores/StudentScoreItemsStore'
import type {
  Item,
  Progress,
  ResultVO,
  StudentItem,
  StudentItemLog,
  StudentItemResp,
  StudentItemsStatusDO,
  User,
  WeightedScore
} from '@/types'
import { CommonService } from './CommonService'
import { ELLoading, StoreCache, StoreClearObject, StoreMapCache } from './Decorators'

const addPreUrl = (url: string) => `student/${url}`

const scoreItemsStore = useStudentScoreitemsStore()
const categoryMajorsStore = useCategoriesMajorsItemsStore()

export class StudentService {
  static async registerService(user: User) {
    await usePost('open/register', user)
  }

  static async listLevel1ItemsService() {
    const result = await useGet<Item[]>(addPreUrl('topitems'))
    return shallowRef(result)
  }

  @StoreMapCache(categoryMajorsStore.itemsMapR)
  @ELLoading()
  static async listItemsService(itemid: string) {
    const result = await useGet<Item>(addPreUrl(`items/${itemid}`))
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

  private static async _listStudentItemsService(rootitemid: string) {
    const result = await useGet<StudentItemResp[]>(addPreUrl(`studentitems/${rootitemid}`))
    return shallowRef(result)
  }

  @StoreMapCache(scoreItemsStore.studentItemsMapR)
  static async listStudentItemsService(rootitemid: string) {
    return StudentService._listStudentItemsService(rootitemid)
  }

  @StoreMapCache(scoreItemsStore.studentItemsMapR, { replace: true })
  static async listStudentItemsServiceRaw(rootitemid: string) {
    return StudentService._listStudentItemsService(rootitemid)
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

  static async addStudentItemService(stuItem: StudentItem) {
    const resp = await usePost<StudentItemResp[]>(addPreUrl(`studentitems`), stuItem)
  }
  //
  @StoreMapCache(scoreItemsStore.studentItemsMapR, { replace: true, indexs: [2] })
  static async uploadStudentItemFileService(
    fdata: FormData,
    stuitemid: string,
    rootitemid: string
  ) {
    const uploadFile = fdata.get('uploadFile')
    const fileName = uploadFile instanceof File ? uploadFile.name : ''
    const progressR = ref<{ progress: Progress }>({
      progress: { percentage: 0, title: fileName, rate: 0, total: 0, loaded: 0 }
    })

    const progNotif = createProgressNotification(progressR.value)
    const resp = await axios.post<ResultVO<StudentItemResp[]>>(
      addPreUrl(`studentitems/${stuitemid}/files/rootitems/${rootitemid}`),
      fdata,
      {
        onUploadProgress(ProgressEvent) {
          if (!ProgressEvent) return
          progressR.value.progress.percentage = ProgressEvent.progress ?? 0
          progressR.value.progress.rate = ProgressEvent.rate ?? 0
          progressR.value.progress.loaded = ProgressEvent.loaded ?? 0
          progressR.value.progress.total = ProgressEvent.total ?? 0
        }
      }
    )
    progNotif.close()
    return shallowRef(resp.data.data)
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

  @StoreCache(scoreItemsStore.studentItemStatusR)
  static async getStudentItemStatusesService() {
    const result = await useGet<StudentItemsStatusDO>(addPreUrl('statuses'))
    return shallowRef(result)
  }

  static async listStudentItemLogsService(id: string) {
    const result = await useGet<StudentItemLog[]>(addPreUrl(`logs/${id}`))
    return shallowRef(result)
  }
}
