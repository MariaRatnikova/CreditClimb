<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import MobileShell from '@/components/layout/MobileShell.vue'
import { mockStudents } from '@/data/mockStudents'
import { semestersData } from '@/data/semestersData'
import ModuleCard from '@/components/common/ModuleCard.vue'
import { useBafoegApplications } from '@/data/bafoegApplicationsStore'

const route = useRoute()
const store = useBafoegApplications()

const studentId = computed(() => String(route.params.id ?? ''))
const student = computed(() => mockStudents.find(s => String(s.id) === studentId.value) ?? null)

const credits = computed(() => store.getStudentCredits(studentId.value))
const openSemesters = ref([5, 4])
const semesters = computed(() => store.getStudentSemesters(studentId.value))

function completed(mods) {
  return (mods ?? []).filter(m => m.grade !== null && m.grade !== undefined)
}
function notCompleted(mods) {
  return (mods ?? []).filter(m => m.grade === null || m.grade === undefined)
}
</script>

<template>
  <MobileShell base="/bafoeg">
    <div class="page">
      <button class="icon-btn" type="button" @click="$router.back()" aria-label="Back">
        <span class="icon">←</span>
      </button>

      <div class="top">
        <div class="student-name">{{ student?.name ?? '—' }}</div>
        <div class="credits">Credits: {{ credits }}</div>
      </div>

      <v-expansion-panels v-model="openSemesters" multiple class="mt-3">
        <v-expansion-panel
          v-for="sem in semesters"
          :key="sem.semester"
          :value="sem.semester"
        >
          <v-expansion-panel-title>
            {{ sem.semester }}.Semester
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <div class="group-title">Not Completed</div>
            <div class="group">
              <ModuleCard
                v-for="m in notCompleted(sem.modules)"
                :key="m.id"
                :module="m"
                :showSemester="false"
                basePath="/bafoeg"
                class="mb-2"
              />
              <div v-if="notCompleted(sem.modules).length === 0" class="empty">—</div>
            </div>

            <div class="group-title mt-4">Completed</div>
            <div class="group">
              <ModuleCard
                v-for="m in completed(sem.modules)"
                :key="m.id"
                :module="m"
                :showSemester="false"
                basePath="/bafoeg"
                class="mb-2"
              />
              <div v-if="completed(sem.modules).length === 0" class="empty">—</div>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </MobileShell>
</template>

<style scoped>
:deep(.top-bar),
:deep(.top-bar .v-app-bar),
:deep(.top-bar .v-app-bar__content),
:deep(.top-bar .v-toolbar__content) {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
}

.page{
  padding: 10px 16px 90px;
  background: #ffffff;
  min-height: 100%;
}

.icon-btn{
  position: fixed;
  top: 15px;
  left: 20px;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: none;
  background: rgba(0,0,0,0.20);
  color: rgba(255,255,255,0.95);
  display: grid;
  place-items: center;
  cursor: pointer;
  z-index: 9999;
  font-weight: 800;
  font-size: 18px;
}

.top{
  margin-top: 48px;
  text-align: center;
}
.student-name{
  font-size: 18px;
  font-weight: 900;
}
.credits{
  margin-top: 4px;
  font-size: 12px;
  opacity: 0.7;
}

.group-title{
  font-weight: 900;
  font-size: 12px;
  opacity: 0.75;
  margin: 8px 0;
}
.empty{
  font-size: 12px;
  opacity: 0.6;
  padding: 6px 0 2px;
}
</style>
