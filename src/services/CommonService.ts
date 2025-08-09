import axios, { useGet, usePost } from '@/axios'
import { createProgressNotification } from '@/components/progress'
import router from '@/router'
import { ADMIN, CATEGORY_ADMIN, COLLEGE_ADMIN, STUDENT } from '@/services/Const'
import { useUserStore } from '@/stores/UserStore'
import type { College, Major, Progress, ResultVO, User, UserInfo } from '@/types'
const userStore = useUserStore()
export class CommonService {
  static async listCollegesService() {
    return await useGet<{ college: College; majors: Major[] }[]>('open/colleges')
  }

  // login
  static loginService = async (user: User) => {
    const resp = await axios.post<ResultVO<UserInfo>>('open/login', user)
    const us = resp.data.data
    const token = resp.headers.token
    const role = resp.headers.role
    if (!us || !token || !role) {
      throw '登录错误'
    }

    userStore.setUserSessionStorage(us, token, role)
    if (user.account === user.password) {
      router.push('/settings')
      throw '账号密码相同，建议重置密码'
    }
    let path = ''
    switch (role) {
      case ADMIN:
        path = '/admin'
        break
      case STUDENT:
        path = '/student'
        break
      case COLLEGE_ADMIN:
      case CATEGORY_ADMIN:
        path = '/college'
        break
    }
    router.push(path)
  }

  //
  static updatePasswordService = async (pwd: string) => {
    await usePost('passwords', { password: pwd })
  }

  static getRoleService() {
    return sessionStorage.getItem('role')
  }
  static getUserInfoService() {
    return userStore.userS
  }

  static clearLoginService() {
    sessionStorage.clear()
    router.push('/login')
  }

  static async downloadFile(url: string, name: string) {
    const progressR = ref<{ progress: Progress }>({
      progress: { percentage: 0, title: name, rate: 0, total: 0, loaded: 0 }
    })

    const progNotif = createProgressNotification(progressR.value)
    const resp = await axios.get(url, {
      responseType: 'blob',
      onDownloadProgress(ProgressEvent) {
        if (!ProgressEvent) return
        progressR.value.progress.percentage = ProgressEvent.progress ?? 0
        progressR.value.progress.rate = ProgressEvent.rate ?? 0
        progressR.value.progress.loaded = ProgressEvent.loaded ?? 0
        progressR.value.progress.total = ProgressEvent.total ?? 0
      }
    })
    progNotif.close()

    const filename = decodeURIComponent(resp.headers['filename'])
    const urlFile = window.URL.createObjectURL(new Blob([resp.data]))
    const link = document.createElement('a')
    link.href = urlFile
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()

    window.URL.revokeObjectURL(urlFile)
    document.body.removeChild(link)

    return resp
  }
}
