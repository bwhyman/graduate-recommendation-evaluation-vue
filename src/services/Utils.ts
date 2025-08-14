import { STUDENT_ITEM_STATUS_MAP } from './Const'

export const getStatusUtil = (status: string) => STUDENT_ITEM_STATUS_MAP.get(status)

export const getFinalScoreUtil = (
  score: number,
  point: number,
  weighting: { id: string; score: number; compositeScore: number }
) =>
  (score * 100 * (weighting?.score ?? 0) + point * 100 * (weighting?.compositeScore ?? 0)) / 10000
