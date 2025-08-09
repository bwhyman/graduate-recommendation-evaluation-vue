<script setup lang="ts">
import AddStudentItemView from '../items/AddStudentItemView.vue'
import SubmitList from './SubmitList.vue'
</script>
<template>
  <el-row class="my-row">
    <el-col :span="2">
      <AddStudentItemView />
    </el-col>
    <el-col :span="18">
      <p>
        说明：1.添加全面发展成绩指标项；2.在创建指标项的，佐证条目，选择上传指标项对应的
        <el-tag type="primary" style="vertical-align: middle">佐证材料</el-tag>
        ;
      </p>
    </el-col>
    <el-col>
      <SubmitList />
    </el-col>
  </el-row>
</template>
