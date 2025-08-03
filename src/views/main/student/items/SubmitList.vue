<script setup lang="ts">
import { createElNotificationSuccess, createMessageDialog } from '@/components/message'
import { StudentService } from '@/services/StudentService'
import { getStatusUtil } from '@/services/Utils'
import type { Item, StudentItem, StudentItemResp } from '@/types'

import { CirclePlusFilled, DeleteFilled, EditPen, UploadFilled } from '@element-plus/icons-vue'

const itemId = useRoute().params.itemid as string
const resultR = await StudentService.listStudentItemsService(itemId)

const selectedR = ref<{ item?: Item; sudentItem?: StudentItem }>({})

const downloadFileF = async (fileid: string, filename: string) => {
  await StudentService.downloadStudentItemFileService(fileid, fileid)
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

//
const activeF = () => {
  // 同步更新元素属性值
  nextTick(() => {
    fileInputR.value?.click()
  })
}

const fileInputR = ref<HTMLInputElement>()
const visableSubmitR = ref(false)
const fileR = ref<File>()

const changeF = (event: Event) => {
  const fileList = (event.target as HTMLInputElement).files
  if (!fileList) return
  visableSubmitR.value = true
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
  visableSubmitR.value = false
  // 再次选择时，需清空值
  ;(fileInputR.value as HTMLInputElement).value = ''
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
const StudentItemDialog = defineAsyncComponent(() => import('../StudentItemDialog.vue'))
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
    <el-table-column label="佐证" width="auto">
      <template #default="scope">
        <div>
          <input type="file" ref="fileInputR" hidden @change="changeF" />
          <el-icon color="#409EFF" style="cursor: pointer" size="large" @click="activeF">
            <CirclePlusFilled />
          </el-icon>
        </div>
        <div v-if="visableSubmitR">
          <el-button
            type="success"
            @click="uploadFileF(scope.row)"
            :icon="UploadFilled"
            style="margin-right: 10px; padding: 4px 10px; font-size: 22px" />
          <span>{{ fileR?.name }}</span>
        </div>
        <div v-for="file of (scope.row as StudentItemResp).files" :key="file.id">
          <el-tag size="large" style="margin-right: 8px">
            <span
              class="tag-ellipsis"
              type="primary"
              size="large"
              @click="downloadFileF(file.id!, file.filename!)">
              {{ file.filename }}
            </span>
          </el-tag>

          <el-icon
            color="#F56C6C"
            style="cursor: pointer; vertical-align: middle"
            size="large"
            @click="removeStudentItemFileF(file.id!, file.filename!)">
            <DeleteFilled />
          </el-icon>
        </div>
        <br />
      </template>
    </el-table-column>
    <el-table-column label="认定" width="120">
      <template #default="scope">
        <div>
          <el-tag type="success" size="large">{{ (scope.row as StudentItemResp).point }}ss</el-tag>
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
          color="#F56C6C"
          style="cursor: pointer; vertical-align: middle"
          size="large"
          @click="
            removeStudentItemF(
              (scope.row as StudentItemResp).id!,
              (scope.row as StudentItemResp).name!
            )
          ">
          <DeleteFilled />
        </el-icon>
        <el-icon
          style="cursor: pointer; vertical-align: middle"
          size="large"
          @click="activeEditF(scope.row as StudentItemResp)">
          <EditPen />
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
</template>
<style>
.tag-ellipsis {
  padding: 5px 0;
  cursor: pointer;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* 可能需要设置 display 来确保 max-width 生效 */
  display: inline-block;
}
</style>
