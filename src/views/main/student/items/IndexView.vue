<script setup lang="ts">
import { List, Promotion } from '@element-plus/icons-vue'
import ItemList from './ItemList.vue'
import SubmitList from './SubmitList.vue'

const changeF = () => {}
</script>
<template>
  <el-row class="my-row">
    <el-col>
      <el-tabs tab-position="top" class="demo-tabs" @tab-click="changeF">
        <el-tab-pane>
          <template #label>
            <span class="custom-tabs-label">
              <el-icon size="large"><Promotion /></el-icon>
              <span>我的提交</span>
            </span>
          </template>
          <SubmitList />
        </el-tab-pane>
        <el-tab-pane>
          <template #label>
            <span class="custom-tabs-label">
              <el-icon size="large"><List /></el-icon>
              <span>指标目录</span>
            </span>
          </template>
          <ItemList />
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>
<style>
[role='tab'] {
  padding-left: 10px;
}
.demo-tabs .custom-tabs-label .el-icon {
  vertical-align: middle;
}
.demo-tabs .custom-tabs-label span {
  vertical-align: middle;
  margin-left: 4px;
}
</style>
