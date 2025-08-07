<script setup lang="ts">
import { CollegeService } from '@/services/CollegeService'
import { CommonService } from '@/services/CommonService'
import { getStatusUtil } from '@/services/Utils'
import type {
  ComfirmWeightedScoreReq,
  Item,
  StudentItemResp,
  StudentItemsStatusDO,
  WeightedScoreLog
} from '@/types'
import { EditPen, Odometer } from '@element-plus/icons-vue'
import ItemNode from './ItemNode.vue'

const dialogVisible = ref(true)
const props = defineProps<{ studentstatus: StudentItemsStatusDO; close: () => void }>()
const adminR = CommonService.getUserInfoService()

const route = useRoute()
const catid = route.params.catid as string

const result = await Promise.all([
  CollegeService.getStudentWeightedScoreService(props.studentstatus.userId!),
  CollegeService.listStudentItemsService(props.studentstatus.userId!),
  CollegeService.listCategoryItemsService(catid)
])

const weightScoreR = result[0]
const studentItemsAllR = result[1]
const itemsR = result[2]

const closeF = async () => {
  props.close()
  dialogVisible.value = true
}

//
const studentItemOfItemR = ref<StudentItemResp[]>(studentItemsAllR.value)

const getLevelItemId = (selectItem: Item) => {
  studentItemOfItemR.value = []
  const childItems: Item[] = []

  const rect = (item: Item) => {
    if (item.items && item.items.length > 0) {
      for (const citem of item.items) {
        rect(citem)
      }
    } else {
      childItems.push(item)
    }
  }

  rect(selectItem)

  for (const chItem of childItems) {
    const stuitems = studentItemsAllR.value.filter(stuitem => stuitem.itemId === chItem.id)
    studentItemOfItemR.value.push(...stuitems)
  }
}

//

const submitWeightedScoreF = async () => {
  const comment = `${adminR.value?.name}认定加权成绩：${weightScoreR.value?.score}；排名：${weightScoreR.value?.ranking}`
  const log: WeightedScoreLog = { studentId: props.studentstatus.userId!, comment: comment }
  const req: ComfirmWeightedScoreReq = { weightedScore: weightScoreR.value, log: log }
  const result = await CollegeService.updateStudentWeightedScoreService(
    req,
    props.studentstatus.userId!
  )
  weightScoreR.value = result.value
}

const listStudentItemsAllF = () => {
  studentItemOfItemR.value = studentItemsAllR.value
}

const downloadFileF = async (fileid: string, filename: string) => {
  await CollegeService.downloadFileService(fileid, filename)
}

//
const activeConfirmDialogR = ref(false)
const selectStudentItemR = ref<StudentItemResp>()
const confirmDialog = defineAsyncComponent(() => import('./ConfirmDialog.vue'))

const confirmF = (stuItem: StudentItemResp) => {
  activeConfirmDialogR.value = true
  selectStudentItemR.value = stuItem
}
const closeconfirmDialog = async () => {
  activeConfirmDialogR.value = false
  studentItemOfItemR.value = studentItemsAllR.value
}
</script>
<template>
  <el-dialog v-model="dialogVisible" @close="closeF" fullscreen>
    <div style="max-width: 1200px; margin: auto">
      <el-row>
        <el-col>
          <p class="title">基本信息数据</p>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <h3>审核：{{ adminR?.name }}</h3>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <h3>学生：{{ props.studentstatus.userName }}</h3>
        </el-col>
      </el-row>
      <el-divider border-style="dashed" />
      <el-row>
        <el-col>
          <p class="title">加权成绩数据</p>
        </el-col>
      </el-row>

      <el-row align="middle">
        <el-col :span="6">
          <el-input-number
            v-model="weightScoreR.score"
            :max="100"
            :min="0"
            :precision="2"
            size="large"
            placeholder="加权成绩" />
        </el-col>
        <el-col :span="6">
          <el-input-number
            v-model="weightScoreR.ranking"
            :min="0"
            size="large"
            placeholder="专业排名" />
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="submitWeightedScoreF">
            <el-icon><EditPen /></el-icon>
          </el-button>
          <span v-if="weightScoreR?.verified">已认定</span>
        </el-col>
      </el-row>
      <el-divider border-style="dashed" />
      <el-row>
        <el-col>
          <p class="title">评定指标参考数据(以文件为准!)</p>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <ItemNode
            :items="itemsR"
            :studentitems="studentItemsAllR"
            :get-root-id="getLevelItemId" />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <p class="title">学生提交数据</p>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="listStudentItemsAllF" style="margin-right: 8px">
            加载全部
          </el-button>
          默认按先择指标参考数据联动过滤
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-col>
            <el-table :data="studentItemOfItemR as StudentItemResp" style="width: 100%">
              <el-table-column type="index" width="50" />
              <el-table-column prop="itemName" label="指标点">
                <template #default="scope">
                  {{ (scope.row as StudentItemResp).itemName }}
                </template>
              </el-table-column>
              <el-table-column label="内容">
                <template #default="scope">
                  {{ (scope.row as StudentItemResp).name }}
                  <br />
                  {{ (scope.row as StudentItemResp).comment }}
                </template>
              </el-table-column>
              <el-table-column label="佐证">
                <template #default="scope">
                  <div v-for="file of (scope.row as StudentItemResp).files" :key="file.id">
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      :content="file.filename"
                      placement="top"
                      :hide-after="0">
                      <el-tag size="large" style="margin-right: 8px" disable-transitions>
                        <span
                          class="tag-ellipsis"
                          type="primary"
                          size="large"
                          @click="downloadFileF(file.id!, file.filename!)">
                          {{ file.filename }}
                        </span>
                      </el-tag>
                    </el-tooltip>
                  </div>
                  <br />
                </template>
              </el-table-column>
              <el-table-column label="认定" width="120">
                <template #default="scope">
                  <div>
                    <el-tag type="success" size="large">
                      {{ (scope.row as StudentItemResp).point ?? 0 }}
                    </el-tag>
                    <span style="vertical-align: middle">
                      / {{ (scope.row as StudentItemResp).maxPoints }}
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="状态" width="80">
                <template #default="scope">
                  <el-tag :type="getStatusUtil((scope.row as StudentItemResp).status ?? '')?.color">
                    {{ getStatusUtil((scope.row as StudentItemResp).status ?? '')?.name }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80">
                <template #default="scope">
                  <el-icon
                    class="my-action-icon"
                    color="#409EFF"
                    @click="confirmF(scope.row as StudentItemResp)">
                    <Odometer />
                  </el-icon>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
  <confirmDialog
    v-if="activeConfirmDialogR"
    :close="closeconfirmDialog"
    :stuitem="selectStudentItemR!" />
</template>
<style scoped>
.title {
  margin-bottom: 10px;
  font-size: 18px;
  color: #409eff;
}
.col-title {
  text-align: right;
}
.info-tag {
  width: 50px;
}

.tag-ellipsis {
  padding: 5px 0;
  cursor: pointer;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* 可能需要设置 display 来确保 max-width 生效 */
  display: inline-block;
}
</style>
