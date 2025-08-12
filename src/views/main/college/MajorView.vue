<script setup lang="ts">
import { CollegeService } from '@/services/CollegeService'
//
const catid = useRoute().params.catid as string
const catidR = ref(catid)
const selectMajorIdR = ref('')
const router = useRouter()
const route = useRoute()
//
const selectMajorF = async () => {
  if (selectMajorIdR.value) {
    router.push(`/college/categories/${catid}/marjors/${selectMajorIdR.value}`)
  }
}
const { data: majorsR } = CollegeService.listMajorsService(catidR)
watch(
  () => route.params,
  () => {
    const majorid = route.params.majorid as string
    const catid = route.params.catid as string
    majorid && (selectMajorIdR.value = majorid)
    catid && (catidR.value = catid)
  },
  { immediate: true }
)
</script>
<template>
  <el-row class="my-row">
    <el-col>
      <el-radio-group size="large" v-model="selectMajorIdR" @change="selectMajorF">
        <el-radio-button
          v-for="major of majorsR"
          :key="major.id"
          :label="major.name"
          :value="major.id" />
      </el-radio-group>
    </el-col>
  </el-row>
  <router-view />
</template>
