<script lang="ts" setup>
import { CollegeService } from '@/services/CollegeService'
import { CommonService } from '@/services/CommonService'
import { CATEGORY_ADMIN, COLLEGE_ADMIN, STUDENT } from '@/services/Const'
import { StudentService } from '@/services/StudentService'
import LogoutView from './LogoutView.vue'
import SettingView from './SettingView.vue'

const menusMapR = ref(new Map<string, string>())
const role = CommonService.getRoleService()

if (role === STUDENT) {
  menusMapR.value.set('中心', '/student')
  menusMapR.value.set('加权成绩', '/student/weightedscore')
  const level1Items = await StudentService.listLevel1ItemsService()
  level1Items.value.forEach(item => {
    menusMapR.value.set(item.name ?? '', `/student/items/${item.id}`)
  })
}
if (role === COLLEGE_ADMIN || role === CATEGORY_ADMIN) {
  const categoriesR = await CollegeService.listCategoryService()
  //menusMapR.value.set('中心', '/college')
  categoriesR.value.forEach(cat =>
    menusMapR.value.set(cat.name ?? '', `/college/categories/${cat.id}`)
  )

  if (role === COLLEGE_ADMIN) {
    menusMapR.value.set('功能', '/college/functions')
  }
}

//
const activeIndexR = ref('')
const route = useRoute()
watch(
  () => route.params,
  () => {
    activeIndexR.value = ''
    menusMapR.value.forEach((v, k) => {
      if (route.fullPath.startsWith(v)) {
        activeIndexR.value = v
      }
    })
  },
  { immediate: true }
)
</script>
<template>
  <el-row class="my-row" style="padding: 3px" align="middle">
    <el-col :span="4">
      <SettingView />
    </el-col>

    <!-- 基于权限加载上功能栏 -->
    <el-col :span="16">
      <el-menu :default-active="activeIndexR" mode="horizontal" router>
        <el-menu-item v-for="(menu, index) of menusMapR" :key="index" :index="menu[1]">
          {{ menu[0] }}
        </el-menu-item>
      </el-menu>
    </el-col>
    <!--  -->
    <el-col :span="4" style="text-align: right; padding-right: 10px">
      <LogoutView />
    </el-col>
  </el-row>
</template>
