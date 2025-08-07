import { CommonService } from '@/services/CommonService'
import * as consty from '@/services/Const'
import { createRouter, createWebHistory } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    roles?: string[]
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/IndexView.vue')
    },
    {
      path: '/register',
      component: () => import('@/views/login/RegisterView.vue')
    },
    {
      path: '/',
      component: () => import('@/views/main/IndexView.vue'),
      meta: {
        roles: [consty.STUDENT, consty.CATEGORY_ADMIN, consty.COLLEGE_ADMIN]
      },
      children: [
        {
          path: 'settings',
          component: () => import('@/views/main/UserSettingView.vue')
        },
        {
          path: 'student',
          component: () => import('@/views/main/student/IndexView.vue'),
          meta: {
            roles: [consty.STUDENT]
          },
          children: [
            {
              path: '',
              component: () => import('@/views/main/student/HomeView.vue')
            },
            {
              path: 'weightedscore',
              component: () => import('@/views/main/student/WeightedScoreView.vue')
            },
            {
              path: 'items/:itemid',
              component: () => import('@/views/main/student/studentitems/IndexView.vue')
            }
          ]
        },
        {
          path: 'college',
          component: () => import('@/views/main/college/IndexView.vue'),
          meta: {
            roles: [consty.CATEGORY_ADMIN, consty.COLLEGE_ADMIN]
          },
          children: [
            {
              path: '',
              component: () => import('@/views/main/college/HomeView.vue')
            },
            {
              path: 'functions',
              component: () => import('@/views/main/college/functions/IndexView.vue')
            },
            {
              path: 'categories/:catid',
              component: () => import('@/views/main/college/MajorView.vue'),
              children: [
                {
                  path: 'marjors/:majorid',
                  component: () => import('@/views/main/college/StudentView.vue')
                }
              ]
            }
          ]
        }
      ]
    },

    {
      path: '/:pathMatch(.*)*',
      redirect: '/login'
    }
  ]
})

router.beforeEach(to => {
  if (!to.meta.roles) {
    return true
  }

  const role = to.meta.roles.find(r => r == CommonService.getRoleService())
  if (role) {
    return true
  }
  CommonService.clearLoginService()
  return false
})

export default router
