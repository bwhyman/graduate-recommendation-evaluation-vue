import { STUDENT_ITEM_STATUS_MAP } from './Const'

export const getStatusUtil = (status: string) => STUDENT_ITEM_STATUS_MAP.get(status)
