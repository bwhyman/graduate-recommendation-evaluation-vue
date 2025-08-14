export interface User {
  id?: string
  name?: string
  account?: string
  password?: string
  mobile?: string
  collId?: string
  catId?: string
  catIds?: string[]
  majorId?: string
}

export interface RegisterUserDTO {
  name?: string
  account?: string
  mobile?: string
  catIds?: string[]
}

export interface UserInfo {
  name: string
  collName?: string
  majorName?: string
  categories?: CategoryInfo[]
}

export interface CategoryInfo {
  id: string
  name: string
  score: number
  compositeScore: number
}

export interface College {
  id?: string
  name?: string
}

export interface Category {
  id?: string
  name?: string
  collId?: string
  comment?: string
  dueTime: Date
}

export interface Major {
  id?: string
  name?: string
  catId?: string
}

export interface CategoryMajors {
  category?: Category
  majors?: Major[]
}

export interface WeightedScore {
  id?: string
  score?: number
  ranking?: number
  comment?: string
  verified?: number
}

export interface WeightedScoreLog {
  id?: string
  studentId?: string
  userId?: string
  userName?: string
  comment?: string
}

export interface ComfirmWeightedScoreReq {
  weightedScore?: WeightedScore
  log?: WeightedScoreLog
}

export interface Item {
  id?: string
  name?: string
  catId?: string
  maxPoints?: number
  maxItems?: number
  parentId?: string
  comment?: string

  items?: Item[]
}

export interface StudentItem {
  id?: string
  userId?: string
  rootItemId?: string
  itemId?: string
  name?: string
  point?: number
  comment?: string
  status?: string
  files?: StudentItemFile[]
}

export interface StudentItemFile {
  id?: string
  studentItemId?: string
  path?: string
  filename?: string
}

export interface StudentItemResp {
  id?: string
  userId?: string
  rootItemId?: string
  itemId?: string
  name?: string
  point?: number
  comment?: string
  status?: string
  itemName?: string
  maxPoints?: number
  maxItems?: number
  itemParentId?: string
  itemComment?: string
  files?: StudentItemFile[]
}

export interface StudentItemsStatusDO {
  userId?: string
  userName?: string
  mobile?: string
  score?: number
  ranking?: number
  verified?: number
  totalPoint?: number
  totalCount?: number
  pendingReviewCount?: number
  rejectedCount?: number
  pendingModificationCount?: number
  confirmedCount?: number
}

export interface StudentItemLog {
  id?: string
  studentItemId?: string
  userId?: string
  comment?: string
  createTime?: string
}

export interface ResultVO<T> {
  code: number
  message?: string
  data: T
}
export interface Progress {
  percentage: number
  rate: number
  total: number
  loaded: number
  title: string
}
