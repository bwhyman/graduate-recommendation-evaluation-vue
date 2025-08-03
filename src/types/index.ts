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

export interface UserInfo {
  name: string
  collName?: string
  catNames?: string[]
  majorName?: string
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
  weighting?: { score: number; compositeScore: number }
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
  logs?: { name: string; comment: string }[]
}

export interface Item {
  id?: string
  name?: string
  catId?: string
  maxPoints?: number
  maxItems?: number
  parentId?: string
  comment?: string
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
  parentId?: string
  itemComment?: string
  files?: StudentItemFile[]
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
