import { useGet, usePost, usePut } from '@/axios'
import { createElLoading } from '@/components/loading'
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { CommonService } from './CommonService'
import { CATEGORY_ADMIN, COLLEGE_ADMIN, querycachename } from './Const'
import { getFinalScoreUtil } from './Utils'
//
const addPreUrl = (url: string) => `college/${url}`

export class CollegeService {
  //
  static listCategoryService(role: Ref<string>) {
    return useQuery({
      queryKey: [querycachename.college.categories],
      queryFn: () => useGet<Category[]>(addPreUrl('categories')),
      enabled: role.value === CATEGORY_ADMIN || role.value === COLLEGE_ADMIN
    })
  }

  // 仅用于collegeadmin，添加专业
  static listcategoryMajorsService() {
    return useQuery({
      queryKey: [querycachename.college.categoriesmajors],
      queryFn: () => useGet<CategoryMajors[]>(addPreUrl('categories/majors'))
    })
  }

  //
  static addMajorService() {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: (major: Major) => usePost(addPreUrl('majors'), major),
      onSuccess: () =>
        qc.refetchQueries({
          queryKey: [querycachename.college.categoriesmajors]
        })
    })
  }

  //
  static listCategoryItemsService(catid: string) {
    return useQuery({
      queryKey: [querycachename.college.categoryitems, catid],
      queryFn: () => createElLoading(useGet<Item[]>(addPreUrl(`categories/${catid}/items`)))
    })
  }

  //
  static addItemService(catid: string) {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: (item: Item) => usePost<Item[]>(addPreUrl('items'), item),
      onSuccess: () =>
        qc.refetchQueries({ queryKey: [querycachename.college.categoryitems, catid] })
    })
  }

  // 基于类别，加载全专业
  static listMajorsService(catidR: Ref<string>) {
    return useQuery({
      queryKey: [querycachename.college.majors, catidR],
      queryFn: () => useGet<Major[]>(addPreUrl(`categories/${catidR.value}/majors`))
    })
  }

  static listStudentsStatusesService(majorid: Ref<string>) {
    return useQuery({
      queryKey: [querycachename.college.majorstudentstatuses, majorid],
      queryFn: () =>
        createElLoading(
          useGet<StudentItemsStatusDO[]>(addPreUrl(`majors/${majorid.value}/students/statuses`))
        ),
      enabled: computed(() => !!majorid.value),
      select: data =>
        data.sort((a, b) => {
          const finalA = getFinalScoreUtil(a.score ?? 0, a.totalPoint ?? 0)
          const finalB = getFinalScoreUtil(b.score ?? 0, b.totalPoint ?? 0)
          return finalB - finalA // 降序
        })
    })
  }

  static getStudentWeightedScoreService(sid: string) {
    return useQuery({
      queryKey: [querycachename.college.studentweightedscores, sid],
      queryFn: () => useGet<WeightedScore>(addPreUrl(`students/${sid}/weightedscore`))
    })
  }

  static updateStudentWeightedScoreService(sid: string) {
    const qc = useQueryClient()
    return useMutation({
      mutationKey: [querycachename.college.studentweightedscores, sid],
      mutationFn: ({ sid, req }: { sid: string; req: ComfirmWeightedScoreReq }) =>
        usePost<WeightedScore>(addPreUrl(`students/${sid}/weightedscore`), req),
      onSuccess: () =>
        qc.refetchQueries({ queryKey: [querycachename.college.studentweightedscores, sid] })
    })
  }

  //
  static listStudentItemsService(sid: string) {
    return useQuery({
      queryKey: [querycachename.college.studentitems, sid],
      queryFn: () =>
        createElLoading(useGet<StudentItemResp[]>(addPreUrl(`students/${sid}/studentitems`)))
    })
  }

  //
  static updateStudentItemSercice(sid: string) {
    const qc = useQueryClient()
    return useMutation({
      mutationKey: [querycachename.college.studentitems, sid],
      mutationFn: ({
        sid,
        stuItem,
        log
      }: {
        sid: string
        stuItem: StudentItem
        log: StudentItemLog
      }) => {
        return usePost<StudentItemResp[]>(addPreUrl(`students/${sid}/studentitems`), {
          studentItem: stuItem,
          log
        })
      },
      onSuccess: () =>
        qc.refetchQueries({
          queryKey: [querycachename.college.studentitems, sid]
        })
    })
  }

  static async downloadFileService(sfile: string, fileName: string) {
    const result = CommonService.downloadFile(addPreUrl(`studentitems/files/${sfile}`), fileName)
  }

  //
  static addAdminService() {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: (user: RegisterUserDTO) => usePost(addPreUrl('users'), user),
      onSuccess: () => qc.refetchQueries({ queryKey: [querycachename.college.categoryadmins] })
    })
  }

  static listCategoryAdminsService() {
    return useQuery({
      queryKey: [querycachename.college.categoryadmins],
      queryFn: () =>
        useGet<
          {
            category?: Category
            users?: User[]
          }[]
        >(addPreUrl('categories/users'))
    })
  }

  static async updatePasswordService(account: string) {
    await usePut(addPreUrl(`passwords/${account}`))
  }
}
