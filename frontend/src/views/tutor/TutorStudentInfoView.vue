<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import MobileShell from '@/components/layout/MobileShell.vue'
import ModuleCard from '@/components/common/ModuleCard.vue'
import { mockStudents } from '@/data/mockStudents'
import { useStudentProgress } from '@/data/studentProgressStore'

const route = useRoute()
const progress = useStudentProgress()

const studentId = computed(() => String(route.params.id ?? ''))
const student = computed(() => mockStudents.find(s => String(s.id) === studentId.value) ?? null)

const credits = computed(() => progress.getStudentCredits(studentId.value))
const semesters = computed(() => progress.getStudentSemesters(studentId.value))

const openSemesters = ref([5, 4])

function completed(mods) {
  return (mods ?? []).filter(m => m.grade !== null && m.grade !== undefined)
}
function notCompleted(mods) {
  return (mods ?? []).filter(m => m.grade === null || m.grade === undefined)
}
</script>

<template>
  <MobileShell base="/tutor" :showBack="true" title="Overview">
    <div class="page">
      <div class="top">
        <div class="student-name">{{ student?.name ?? '—' }}</div>
        <div class="credits">Credits: {{ credits }} ECTS</div>
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
            <ModuleCard
              v-for="m in notCompleted(sem.modules)"
              :key="m.id"
              :module="m"
              :showSemester="false"
              basePath="/tutor"
              class="mb-2"
            />

            <div class="group-title mt-4">Completed</div>
            <ModuleCard
              v-for="m in completed(sem.modules)"
              :key="m.id"
              :module="m"
              :showSemester="false"
              basePath="/tutor"
              class="mb-2"
            />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </MobileShell>
</template>

<style scoped>
.page{ padding: 10px 16px 90px; background:#fff; min-height:100%; }
.top{ margin-top: 6px; text-align:center; }
.student-name{ font-size:18px; font-weight:900; }
.credits{ margin-top:4px; font-size:12px; opacity:.7; }
.group-title{ font-weight:900; font-size:12px; opacity:.75; margin:8px 0; }
</style>
