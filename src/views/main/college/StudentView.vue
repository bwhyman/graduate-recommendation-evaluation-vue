<script setup lang="ts">
import { CollegeService } from '@/services/CollegeService'
import { SCORE_STATUS_MAP } from '@/services/Const'
import { getFinalScoreUtil } from '@/services/Utils'
import type { StudentItemsStatusDO } from '@/types'
import { PhoneFilled, Promotion } from '@element-plus/icons-vue'
const route = useRoute()
const activeRefechR = ref(false)
const majorIdR = ref('')

const { data: studentsR } = CollegeService.listStudentsStatusesService(majorIdR, activeRefechR)
watch(
  () => route.params.majorid,
  () => {
    const majorid = route.params.majorid as string
    majorIdR.value = majorid
    activeRefechR.value = true
  },
  { immediate: true }
)

//
const studentStatusR = ref<StudentItemsStatusDO>({})
const activeR = ref(false)
const closeF = () => {
  activeR.value = false
}
const reviewF = (student: StudentItemsStatusDO) => {
  studentStatusR.value = student
  activeR.value = true
}

const reviewdialog = defineAsyncComponent(() => import('./reviews/ReviewStudentDialog.vue'))
</script>
<template>
  <el-row class="my-row">
    <el-col>
      <el-table :data="studentsR as StudentItemsStatusDO" style="width: 100%">
        <el-table-column type="index" />
        <el-table-column label="姓名">
          <template #default="scope">
            <el-icon
              style="cursor: pointer; color: #409eff; font-size: 18px; vertical-align: middle"
              :title="(scope.row as StudentItemsStatusDO).mobile">
              <PhoneFilled />
            </el-icon>
            {{ (scope.row as StudentItemsStatusDO).userName }}
          </template>
        </el-table-column>

        <el-table-column label="待审核项数">
          <template #default="scope">
            {{ (scope.row as StudentItemsStatusDO).pendingReviewCount }}
          </template>
        </el-table-column>
        <el-table-column label="项数">
          <template #default="scope">
            <span>已认定:{{ (scope.row as StudentItemsStatusDO).confirmedCount }}</span>
            <br />
            <span>待修改:{{ (scope.row as StudentItemsStatusDO).pendingModificationCount }}</span>
            <br />
            <span>已驳回:{{ (scope.row as StudentItemsStatusDO).rejectedCount }}</span>
            <br />
            <span>总提交:{{ (scope.row as StudentItemsStatusDO).totalCount }}</span>
            <br />
          </template>
        </el-table-column>
        <el-table-column label="加权成绩">
          <template #default="scope">
            <el-tag
              :type="
                SCORE_STATUS_MAP.get((scope.row as StudentItemsStatusDO).verified ?? 0)?.color
              ">
              {{ (scope.row as StudentItemsStatusDO).score }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="已认定成绩">
          <template #default="scope">
            <el-tag
              :type="
                SCORE_STATUS_MAP.get((scope.row as StudentItemsStatusDO).verified ?? 0)?.color
              ">
              {{ (scope.row as StudentItemsStatusDO).totalPoint }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="最终成绩">
          <template #default="scope">
            <el-tag
              :type="
                SCORE_STATUS_MAP.get((scope.row as StudentItemsStatusDO).verified ?? 0)?.color
              ">
              {{
                getFinalScoreUtil(
                  (scope.row as StudentItemsStatusDO).score ?? 0,
                  (scope.row as StudentItemsStatusDO).totalPoint ?? 0
                )
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="" max-width="80">
          <template #default="scope">
            <el-button type="primary" @click="reviewF(scope.row as StudentItemsStatusDO)">
              <el-icon><Promotion /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
  <reviewdialog
    v-if="activeR"
    :studentstatus="studentStatusR"
    :close="closeF"
    :majorid="majorIdR" />
</template>
