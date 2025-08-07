import { STUDENT_ITEM_STATUS_MAP } from './Const'

export const getStatusUtil = (status: string) => STUDENT_ITEM_STATUS_MAP.get(status)

export const getFinalScoreUtil = (score: number, point: number) =>
  (score * 100 * 85 + point * 100 * 15) / 10000
