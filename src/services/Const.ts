export const STUDENT = 'lM53x'
export const COLLEGE_ADMIN = 'a2Pvd'
export const CATEGORY_ADMIN = 'Rcz9N'
export const ADMIN = 'Oi7yT'

export const PENDING_REVIEW = 'av8c'
export const REJECTED = 'ciG1'
export const PENDING_MODIFICATION = 'EmBq'
export const CONFIRMED = 'yJ3C'

export const STUDENT_ITEM_STATUS_MAP = new Map<string, { name: string; color: string }>()
STUDENT_ITEM_STATUS_MAP.set(PENDING_REVIEW, {
  name: '待审核',
  color: 'info'
})
STUDENT_ITEM_STATUS_MAP.set(REJECTED, {
  name: '已驳回',
  color: 'danger'
})
STUDENT_ITEM_STATUS_MAP.set(PENDING_MODIFICATION, {
  name: '待修改',
  color: 'warning'
})
STUDENT_ITEM_STATUS_MAP.set(CONFIRMED, {
  name: '已认定',
  color: 'success'
})

export const VERIFIED = 1
export const UNVERIFIED = 0

export const SCORE_STATUS_MAP = new Map<number, { name: string; color: string }>()
SCORE_STATUS_MAP.set(UNVERIFIED, { name: '待审核', color: 'info' })
SCORE_STATUS_MAP.set(VERIFIED, { name: '已认定', color: 'success' })
