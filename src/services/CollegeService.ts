import { useGet, usePost, usePut } from '@/axios'
import { useCategoriesMajorsItemsStore } from '@/stores/CategoriesMajorsItemsStore'
import { useStudentScoreitemsStore } from '@/stores/StudentScoreItemsStore'
import type {
  Category,
  CategoryMajors,
  ComfirmWeightedScoreReq,
  Item,
  Major,
  RegisterUserDTO,
  StudentItem,
  StudentItemLog,
  StudentItemResp,
  StudentItemsStatusDO,
  User,
  WeightedScore
} from '@/types'
import { CommonService } from './CommonService'
import { ELLoading, StoreCache, StoreMapCache } from './Decorators'

const addPreUrl = (url: string) => `college/${url}`

const categoryMajorsStore = useCategoriesMajorsItemsStore()
const studentItemsStore = useStudentScoreitemsStore()

export class CollegeService {
  static async listCategoryService() {
    const result = await useGet<Category[]>(addPreUrl('categories'))
    return shallowRef(result)
  }

  // 仅用于collegeadmin，修改
  @StoreCache(categoryMajorsStore.categoryMajorsR)
  static async listcategoryMajorsService() {
    const result = await useGet<CategoryMajors[]>(addPreUrl('categories/majors'))
    return shallowRef(result)
  }
  @StoreCache(categoryMajorsStore.categoryMajorsR, true)
  static async addMajorService(major: Major) {
    const result = await usePost(addPreUrl('majors'), major)
    return shallowRef(result)
  }

  @StoreMapCache(categoryMajorsStore.catItemsMapR)
  static async listCategoryItemsService(catid: string) {
    const result = await useGet<Item[]>(addPreUrl(`categories/${catid}/items`))
    return shallowRef(result)
  }

  @StoreMapCache(categoryMajorsStore.catItemsMapR, { replace: true, indexs: [0] })
  static async addItemService(catId: string, item: Item) {
    const result = await usePost<Item[]>(addPreUrl('items'), item)
    return shallowRef(result)
  }

  @StoreMapCache(categoryMajorsStore.majorsMapR)
  static async listMajorsService(catid: string) {
    const result = await useGet<Major[]>(addPreUrl(`categories/${catid}/majors`))
    return shallowRef(result)
  }

  @StoreMapCache(categoryMajorsStore.majorsMapR)
  @ELLoading()
  static async listStudentsStatusesService(majorid: string) {
    const result = await useGet<StudentItemsStatusDO[]>(
      addPreUrl(`majors/${majorid}/students/statuses`)
    )
    return shallowRef(result)
  }

  static async getStudentWeightedScoreService(sid: string) {
    const result = await useGet<WeightedScore>(addPreUrl(`students/${sid}/weightedscore`))
    return shallowRef(result)
  }

  static async updateStudentWeightedScoreService(req: ComfirmWeightedScoreReq, sid: string) {
    const result = await usePost<WeightedScore>(addPreUrl(`students/${sid}/weightedscore`), req)
    return shallowRef(result)
  }

  @StoreMapCache(studentItemsStore.studentItemsMapR)
  static async listStudentItemsService(sid: string) {
    const result = await useGet<StudentItemResp[]>(addPreUrl(`students/${sid}/studentitems`))
    return shallowRef(result)
  }

  @StoreMapCache(studentItemsStore.studentItemsMapR, { replace: true, indexs: [0] })
  static async updateStudentItemSercice(sid: string, stuItem: StudentItem, log: StudentItemLog) {
    const result = await usePost<StudentItemResp[]>(addPreUrl(`students/${sid}/studentitems`), {
      studentItem: stuItem,
      log
    })
    return shallowRef(result)
  }

  static async downloadFileService(sfile: string, fileName: string) {
    const result = CommonService.downloadFile(addPreUrl(`studentitems/files/${sfile}`), fileName)
  }

  //
  static async addAdminService(user: RegisterUserDTO) {
    const result = await usePost(addPreUrl('users'), user)
  }

  static async listCategoryAdminsService() {
    const result = await useGet<
      {
        category?: Category
        users?: User[]
      }[]
    >(addPreUrl('categories/users'))
    return shallowRef(result)
  }

  static async updatePasswordService(account: string) {
    await usePut(addPreUrl(`passwords/${account}`))
  }
}
