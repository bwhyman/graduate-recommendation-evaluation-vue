<script setup lang="ts">
import { CommonService } from '@/services/CommonService'
import { CONFIRMED, PENDING_REVIEW, REJECTED, SCORE_STATUS_MAP } from '@/services/Const'
import { StudentService } from '@/services/StudentService'
import { getFinalScoreUtil, getStatusUtil } from '@/services/Utils'
import { Ship } from '@element-plus/icons-vue'

const statusR = await StudentService.getStudentItemStatusesService()
const userInfo = CommonService.getUserInfoService()

const colspan = 3

const finalScore = getFinalScoreUtil(statusR.value?.score ?? 0, statusR.value?.totalPoint ?? 0)
</script>
<template>
  <el-row class="my-row">
    <el-col>
      <p class="title">基本信息数据</p>
      <div>
        {{ userInfo?.name }} - {{ userInfo?.collName }} - {{ userInfo?.catNames?.join(';') }} -
        {{ userInfo?.majorName }}
      </div>

      <div>
        <p class="title">加权成绩数据</p>
        <el-row :gutter="10" class="row">
          <el-col :span="colspan" class="col-title">加权成绩：</el-col>
          <el-col :span="12">
            <el-tag
              size="large"
              :type="SCORE_STATUS_MAP.get(statusR.verified ?? 0)?.color"
              class="info-tag">
              {{ statusR?.score }}
            </el-tag>
          </el-col>
        </el-row>

        <el-row :gutter="10" class="row">
          <el-col :span="colspan" class="col-title">专业排名：</el-col>
          <el-col :span="12">
            <el-tag
              size="large"
              :type="!statusR.verified || statusR.verified === 0 ? 'info' : 'success'"
              class="info-tag">
              {{ statusR?.ranking }}
            </el-tag>
          </el-col>
        </el-row>
      </div>

      <div>
        <p class="title">全面发展成绩评定数据</p>
        <el-row :gutter="10" class="row">
          <el-col :span="colspan" class="col-title">已认定成绩：</el-col>
          <el-col :span="12">
            <el-tag size="large" :type="getStatusUtil(CONFIRMED)?.color" class="info-tag">
              {{ statusR?.totalPoint }}
            </el-tag>
          </el-col>
        </el-row>

        <el-row :gutter="10" class="row">
          <el-col :span="colspan" class="col-title">已认定项：</el-col>
          <el-col :span="12">
            <el-tag size="large" :type="getStatusUtil(CONFIRMED)?.color" class="info-tag">
              {{ statusR?.confirmedCount }}
            </el-tag>
          </el-col>
        </el-row>

        <el-row :gutter="10" class="row">
          <el-col :span="colspan" class="col-title">待审核项：</el-col>
          <el-col :span="12">
            <el-tag size="large" :type="getStatusUtil(PENDING_REVIEW)?.color" class="info-tag">
              {{ statusR?.pendingReviewCount }}
            </el-tag>
          </el-col>
        </el-row>

        <el-row :gutter="10" class="row">
          <el-col :span="colspan" class="col-title">待修改项：</el-col>
          <el-col :span="12">
            <el-tag size="large" :type="getStatusUtil(PENDING_REVIEW)?.color" class="info-tag">
              {{ statusR?.pendingModificationCount }}
            </el-tag>
          </el-col>
        </el-row>

        <el-row :gutter="10" class="row">
          <el-col :span="colspan" class="col-title">已驳回项：</el-col>
          <el-col :span="12">
            <el-tag size="large" :type="getStatusUtil(REJECTED)?.color" class="info-tag">
              {{ statusR?.rejectedCount }}
            </el-tag>
          </el-col>
        </el-row>

        <el-row :gutter="10" class="row">
          <el-col :span="colspan" class="col-title">总提交项：</el-col>
          <el-col :span="12">
            <el-tag size="large" class="info-tag">
              {{ statusR?.totalCount }}
            </el-tag>
          </el-col>
        </el-row>

        <div>
          <p class="title">最终成绩数据</p>
          <el-row :gutter="10" class="row">
            <el-col :span="colspan" class="col-title">
              <el-icon style="vertical-align: middle" color="#F56C6C"><Ship /></el-icon>
              总成绩 ：
            </el-col>
            <el-col :span="12">
              <span>
                <el-tag size="large" type="success" class="info-tag">{{ finalScore }}</el-tag>
                = 加权成绩({{ statusR?.score }} ) * 85% + 全面发展成绩({{ statusR?.totalPoint }}
                ) * 15%
              </span>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-col>
  </el-row>
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
</style>
