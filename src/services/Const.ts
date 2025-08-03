export const STUDENT = 'lM53x'
export const COLLEGE_ADMIN = 'a2Pvd'
export const CATEGORY_ADMIN = 'Rcz9N'
export const ADMIN = 'Oi7yT'

export const SUBMITTED = 'av8c'
export const REJECTED = 'ciG1'
export const PENDING = 'EmBq'
export const CONFIRMED = 'yJ3C'

export const STUDENT_ITEM_STATUS_MAP = new Map<string, { name: string; color: string }>()
STUDENT_ITEM_STATUS_MAP.set(SUBMITTED, {
  name: '已提交',
  color: 'primary'
})
STUDENT_ITEM_STATUS_MAP.set(REJECTED, {
  name: '已驳回',
  color: 'danger'
})
STUDENT_ITEM_STATUS_MAP.set(PENDING, {
  name: '待修改',
  color: 'warning'
})
STUDENT_ITEM_STATUS_MAP.set(CONFIRMED, {
  name: '已认定',
  color: 'success'
})
