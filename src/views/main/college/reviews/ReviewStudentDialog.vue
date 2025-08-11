<script setup lang="ts">
import { CollegeService } from '@/services/CollegeService'
import { CommonService } from '@/services/CommonService'
import { querycachename } from '@/services/Const'
import { getStatusUtil } from '@/services/Utils'
import type { Item, StudentItemResp, StudentItemsStatusDO } from '@/types'
import { Odometer } from '@element-plus/icons-vue'
import { useQueryClient } from '@tanstack/vue-query'
import ItemNode from './ItemNode.vue'
import ReviewWeigthedScore from './ReviewWeigthedScore.vue'

const dialogVisible = ref(true)
const props = defineProps<{
  majorid: string
  studentstatus: StudentItemsStatusDO
  close: () => void
}>()
const adminR = CommonService.getUserInfoService()

const route = useRoute()
const catid = route.params.catid as string

const { data: studentItemsAllR, suspense: su1 } = CollegeService.listStudentItemsService(
  props.studentstatus.userId!
)
const { data: itemsR, suspense: su2 } = CollegeService.listCategoryItemsService(catid)
const studentItemOfItemR = ref<StudentItemResp[]>([])
await Promise.all([su1(), su2()])

studentItemOfItemR.value = [...studentItemsAllR.value!]

const qc = useQueryClient()
//
const closeF = async () => {
  dialogVisible.value = false
  //关闭，重新拉取专业学生全部状态
  await qc.refetchQueries({
    queryKey: [querycachename.college.majorstudentstatuses, props.majorid]
  })
  props.close()
}

//
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
    const stuitems = studentItemsAllR.value!.filter(stuitem => stuitem.itemId === chItem.id)
    studentItemOfItemR.value.push(...stuitems)
  }
}

const listStudentItemsAllF = () => {
  studentItemOfItemR.value = [...studentItemsAllR.value!]
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
  studentItemOfItemR.value = [...studentItemsAllR.value!]
}
</script>
<template>
  <el-dialog v-model="dialogVisible" @close="closeF" fullscreen>
    <div style="max-width: 1200px; margin: auto">
      <el-row>
        <el-col>
          <span class="title">基本信息数据</span>
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
      <ReviewWeigthedScore :sid="props.studentstatus.userId!" />
      <el-divider border-style="dashed" />
      <el-row>
        <el-col>
          <div>
            <span class="title">评定指标参考数据</span>
            说明：1.评定标准以学院文件要求为准；2.学生填报数是否超过限项，需人工审核；
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <ItemNode
            :items="itemsR!"
            :studentitems="studentItemsAllR!"
            :get-root-id="getLevelItemId" />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <span class="title">学生提交数据</span>
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
