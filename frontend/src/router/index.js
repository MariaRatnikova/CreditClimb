import { createRouter, createWebHistory } from 'vue-router'
import RoleGateView from '@/views/RoleGateView.vue'
import { useAuthStore } from '@/stores/authStore'

//Tutor
import TutorSearchStudentsView from '@/views/tutor/TutorSearchStudentsView.vue'

//Bafoeg
import BafoegSearchStudentsView from '@/views/bafoeg/BafoegSearchStudentsView.vue'
import BafoegStudentInfoView from '@/views/bafoeg/BafoegStudentInfoView.vue'

//Student
import StudentHomeView from '@/views/student/StudentHomeView.vue'
import StudentSearchStudentsView from '@/views/student/StudentSearchStudentsView.vue'
import StudentSettingsView from '@/views/student/StudentSettingsView.vue'

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
    { path: '/tutor/home', component: TutorSearchStudentsView, meta: { role: 'tutor' } },
    { path: '/tutor/settings', component: TutorSearchStudentsView, meta: { role: 'tutor' } },

    //bafoeg
    { path: '/bafoeg/search', component: BafoegSearchStudentsView, meta: { role: 'bafoeg' } },
    { path: '/bafoeg/home', component: BafoegSearchStudentsView, meta: { role: 'bafoeg' } },
    { path: '/bafoeg/settings', component: BafoegSearchStudentsView, meta: { role: 'bafoeg' } },
    { path: '/bafoeg/student/:id', name: 'bafoeg-student', component: BafoegStudentInfoView, props: true },

    //student
    { path: '/student/home', component: StudentHomeView, meta: { role: 'student' } },
    { path: '/student/search', component: StudentSearchStudentsView, meta: { role: 'student' } },
    { path: '/student/settings', component: StudentSettingsView, meta: { role: 'student' } },
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
    if (auth.role === 'tutor') return '/tutor/search'
    if (auth.role === 'bafoeg') return '/bafoeg/search'
    if (auth.role === 'student') return '/student/home'
    return '/'
  }

  return true
})
