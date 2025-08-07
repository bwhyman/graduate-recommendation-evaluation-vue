<script setup lang="ts">
import { createElNotificationSuccess, createMessageDialog } from '@/components/message'
import { CONFIRMED } from '@/services/Const'
import { StudentService } from '@/services/StudentService'
import { getStatusUtil } from '@/services/Utils'
import type { Item, StudentItem, StudentItemLog, StudentItemResp } from '@/types'

import {
  CirclePlusFilled,
  DeleteFilled,
  EditPen,
  UploadFilled,
  View
} from '@element-plus/icons-vue'

const itemId = useRoute().params.itemid as string
const resultR = await StudentService.listStudentItemsService(itemId)

const selectedR = ref<{ item?: Item; sudentItem?: StudentItem }>({})

const downloadFileF = async (fileid: string, filename: string) => {
  await StudentService.downloadStudentItemFileService(fileid, filename)
}

const removeStudentItemF = (id: string, name: string) => {
  ElMessageBox.confirm(`确定移除，${name}，提交条目？`, 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(async () => {
    await StudentService.removeStudentItemService(id, itemId)
    createElNotificationSuccess('条目已移除')
  })
}

const removeStudentItemFileF = async (id: string, name: string) => {
  ElMessageBox.confirm(`确定移除，${name}，文件？`, 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(async () => {
    await StudentService.removeStudentItemFileService(id, itemId)
    createElNotificationSuccess('文件已移除')
  })
}

//
const fileR = ref<File>()
const fileInputR = ref<HTMLInputElement>()
const submitIndexR = ref(-1)
const activeF = (index: number) => {
  // 同步更新元素属性值
  nextTick(() => {
    fileInputR.value?.click()
    fileR.value = undefined
    ;(fileInputR.value as HTMLInputElement).value = ''
  })
  submitIndexR.value = index
}

const activeUploadC = computed(() => (index: number) => index === submitIndexR.value && fileR.value)

const changeF = (event: Event) => {
  const fileList = (event.target as HTMLInputElement).files
  if (!fileList) return
  fileR.value = fileList[0]
}

const uploadFileF = async (studentItem: StudentItemResp) => {
  if (!fileR.value) {
    createMessageDialog(`请选择上传文件`)
    return
  }
  const fName = fileR.value.name
  const fdata = new FormData()
  fdata.append('uploadFile', fileR.value, `${studentItem.itemName}-${fName}`)

  await StudentService.uploadStudentItemFileService(fdata, studentItem.id!, itemId)
  createElNotificationSuccess('佐证文件上传成功')
  // 再次选择时，需清空值
  ;(fileInputR.value as HTMLInputElement).value = ''
  fileR.value = undefined
}

const gradingDialogVisable = ref(false)

const activeEditF = (stud: StudentItemResp) => {
  selectedR.value.item = {
    id: stud.id,
    name: stud.itemName,
    maxPoints: stud.maxPoints,
    maxItems: stud.maxItems
  }
  selectedR.value.sudentItem = {
    id: stud.id,
    name: stud.name,
    comment: stud.comment,
    rootItemId: stud.rootItemId,
    itemId: stud.itemId
  }
  gradingDialogVisable.value = true
}

const closeF = () => (gradingDialogVisable.value = false)
const StudentItemDialog = defineAsyncComponent(() => import('./EditDialog.vue'))

const allowUpdate = (stuItem: StudentItemResp) => stuItem.status !== CONFIRMED

//
const logsR = shallowRef<StudentItemLog[]>([])
const getLogsF = async (itemid: string) => {
  const result = await StudentService.listStudentItemLogsService(itemid)
  logsR.value = result.value ?? []
  logActiveR.value = true
}

const logActiveR = ref(false)
const logdialog = defineAsyncComponent(() => import('./LogDialog.vue'))
const closeLogDialF = () => {
  logActiveR.value = false
}
</script>
<template>
  <el-table :data="resultR as StudentItemResp" style="width: 100%">
    <el-table-column type="index" width="50" />
    <el-table-column prop="itemName" label="指标点" width="180">
      <template #default="scope">
        {{ (scope.row as StudentItemResp).itemName }}
      </template>
    </el-table-column>
    <el-table-column label="标题" width="180">
      <template #default="scope">
        {{ (scope.row as StudentItemResp).name }}
      </template>
    </el-table-column>
    <el-table-column label="佐证" min-width="240">
      <template #default="scope">
        <div v-if="allowUpdate(scope.row as StudentItemResp)">
          <input type="file" ref="fileInputR" hidden @change="changeF" />
          <el-icon
            color="#409EFF"
            style="cursor: pointer"
            size="large"
            @click="activeF(scope.$index)">
            <CirclePlusFilled />
          </el-icon>
        </div>
        <div v-if="activeUploadC(scope.$index)">
          <el-button
            v-if="allowUpdate(scope.row as StudentItemResp)"
            type="success"
            @click="uploadFileF(scope.row)"
            :icon="UploadFilled" />
          <span>{{ fileR?.name }}</span>
        </div>
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

          <el-icon
            v-if="allowUpdate(scope.row as StudentItemResp)"
            color="#F56C6C"
            class="my-action-icon"
            @click="removeStudentItemFileF(file.id!, file.filename!)">
            <DeleteFilled />
          </el-icon>
        </div>
        <br />
      </template>
    </el-table-column>
    <el-table-column label="认定">
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
    <el-table-column label="状态">
      <template #default="scope">
        <el-tag :type="getStatusUtil((scope.row as StudentItemResp).status ?? '')?.color">
          {{ getStatusUtil((scope.row as StudentItemResp).status ?? '')?.name }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="日志">
      <template #default="scope">
        <el-icon class="my-action-icon" color="#409EFF" @click="getLogsF(scope.row.id)">
          <View />
        </el-icon>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="80">
      <template #default="scope">
        <el-icon
          v-if="allowUpdate(scope.row as StudentItemResp)"
          class="my-action-icon"
          color="#409EFF"
          @click="activeEditF(scope.row as StudentItemResp)">
          <EditPen />
        </el-icon>
        <el-icon
          v-if="allowUpdate(scope.row as StudentItemResp)"
          class="my-action-icon"
          color="#F56C6C"
          @click="
            removeStudentItemF(
              (scope.row as StudentItemResp).id!,
              (scope.row as StudentItemResp).name!
            )
          ">
          <DeleteFilled />
        </el-icon>
      </template>
    </el-table-column>
  </el-table>
  <StudentItemDialog
    v-if="gradingDialogVisable"
    :item="selectedR.item!"
    :studentitem="selectedR.sudentItem!"
    :rootitemid="itemId"
    :close="closeF" />

  <logdialog :logs="logsR" :close="closeLogDialF" v-if="logActiveR" />
</template>
<style scoped>
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
