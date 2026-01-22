import { createRouter, createWebHistory } from 'vue-router'
import RoleGateView from '@/views/RoleGateView.vue'
import { useAuthStore } from '@/stores/authStore'

//Tutor
import TutorSearchStudentsView from '@/views/tutor/TutorSearchStudentsView.vue'
import TutorHomeView from '@/views/tutor/TutorHomeView.vue'
import TutorSettingsView from '@/views/tutor/TutorSettingsView.vue'

//Bafoeg
import BafoegSearchStudentsView from '@/views/bafoeg/BafoegSearchStudentsView.vue'
import BafoegStudentInfoView from '@/views/bafoeg/BafoegStudentInfoView.vue'
import BafoegHomeView from '@/views/bafoeg/BafoegHomeView.vue'
import BafoegSettingsView from '@/views/bafoeg/BafoegSettingsView.vue'
import BafoegSemesterOverviewView from '@/views/bafoeg/BafoegSemesterOverviewView.vue'
import BafoegModuleInfoView from '@/views/bafoeg/BafoegModuleInfoView.vue'


//Student
import StudentHomeView from '@/views/student/StudentHomeView.vue'
import StudentSearchStudentsView from '@/views/student/StudentSearchStudentsView.vue'
import StudentSettingsView from '@/views/student/StudentSettingsView.vue'
import TutorStudentInfoView from '@/views/tutor/TutorStudentInfoView.vue'

/**
 * Router-Konfiguration.
 * - Jede Rollen-Route trägt meta.role (tutor/bafoeg/student)
 * - beforeEach() fungiert als Role Guard und leitet bei falscher Rolle um
 * - "/" ist die öffentliche Entry-Route und entscheidet über RoleGateView weiter
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'role-gate', component: RoleGateView },

    //tutor
    { path: '/tutor/search', component: TutorSearchStudentsView, meta: { role: 'tutor' } },
    { path: '/tutor/home', component: TutorHomeView, meta: { role: 'tutor' } },
    { path: '/tutor/settings', component: TutorSettingsView, meta: { role: 'tutor' } },
    { path: '/tutor/student/:id', name: 'tutor-student', component: TutorStudentInfoView, props: true, meta: { role: 'tutor' } },

    //bafoeg
    { path: '/bafoeg/search', component: BafoegSearchStudentsView, meta: { role: 'bafoeg' } },
    { path: '/bafoeg/home', component: BafoegHomeView, meta: { role: 'bafoeg' } },
    { path: '/bafoeg/settings', component: BafoegSettingsView, meta: { role: 'bafoeg' } },
    { path: '/bafoeg/student/:id', name: 'bafoeg-student', component: BafoegStudentInfoView, props: true, meta: { role: 'bafoeg' } },
    { path: '/bafoeg/student/:id/modules', name: 'bafoeg-semester-overview', component: BafoegSemesterOverviewView, meta: { role: 'bafoeg' } },
    { path: '/bafoeg/module/:id', name: 'bafoeg-module-info', component: BafoegModuleInfoView, meta: { role: 'bafoeg' } },

    //student
    { path: '/student/home', component: StudentHomeView, meta: { role: 'student' } },
    { path: '/student/search', component: StudentSearchStudentsView, meta: { role: 'student' } },
    { path: '/student/settings', component: StudentSettingsView, meta: { role: 'student' } },
    { path: '/student/semester/:semesterId', name: 'student-semester-overview', component: () => import('@/views/student/SemesterOverview.vue'), },
    { path: '/student/module/:id', name: 'StudentModuleInfo', component: () => import('@/views/student/ModuleInfoView.vue'), props: true,}
  ],
})

export default router

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!auth.role) auth.loadFromStorage()

  // RoleGate / öffentliche Route immer erlauben
  if (to.path === '/') return true

  const requiredRole = to.meta?.role
  if (!requiredRole) return true

  if (auth.role !== requiredRole) {
    if (auth.role === 'tutor') return '/tutor/home'
    if (auth.role === 'bafoeg') return '/bafoeg/home'
    if (auth.role === 'student') return '/student/home'
    return '/'
  }

  return true
})
