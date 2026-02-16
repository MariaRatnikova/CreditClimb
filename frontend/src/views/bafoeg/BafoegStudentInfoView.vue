<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MobileShell from '@/components/layout/MobileShell.vue'
import { mockStudents } from '@/data/mockStudents'
import { useBafoegApplications } from '@/data/bafoegApplicationsStore'

const route = useRoute()
const router = useRouter()
const store = useBafoegApplications()

const id = computed(() => String(route.params.id ?? ''))
const student = computed(() => mockStudents.find(s => String(s.id) === id.value) ?? null)

const details = computed(() => {
  // simple deterministic mock details
  const num = Number(id.value) || 0
  const faculties = ['Mathematics and Computer Science', 'Engineering', 'Business']
  const programs = ['Media Informatics', 'Computer Science', 'Business Informatics']
  const degrees = ['Bachelor', 'Master']

  return {
    university: student.value?.university ?? '—',
    faculty: faculties[num % faculties.length],
    studyProgram: programs[num % programs.length],
    degree: degrees[num % degrees.length],
    semester: store.currentSemesterFor(id.value),
    credits: store.getStudentCredits(id.value),
    yearOfStudy: 2023,
  }
})

onMounted(() => {
  if (student.value) store.markSeen(student.value.id)
})

function showModules() {
  router.push(`/bafoeg/student/${id.value}/modules`)
}

function approve() {
  store.approve(id.value)
  router.push('/bafoeg/home')
}
</script>

<template>
  <MobileShell base="/bafoeg">
    <div class="page">
      <button class="icon-btn" type="button" @click="$router.back()" aria-label="Back">
        <span class="icon">←</span>
      </button>

      <div v-if="!student" class="not-found">Student not found.</div>

      <div v-else class="card">
        <div class="name">{{ student.name }}</div>

        <div class="kv">
          <div class="k">University:</div><div class="v">{{ details.university }}</div>
          <div class="k">Faculty:</div><div class="v">{{ details.faculty }}</div>
          <div class="k">Study program:</div><div class="v">{{ details.studyProgram }}</div>
          <div class="k">Degree:</div><div class="v">{{ details.degree }}</div>
          <div class="k">Semester:</div><div class="v">{{ details.semester }}. Semester</div>
          <div class="k">Credits:</div><div class="v">{{ details.credits }} ECTS</div>
          <div class="k">Student ID:</div><div class="v">{{ student.id }}</div>
          <div class="k">Year of study:</div><div class="v">{{ details.yearOfStudy }}</div>
        </div>

        <div class="link">
          Transcript of grades (PDF)
          <div class="download">Download PDF</div>
        </div>

        <div class="btn-col">
          <v-btn class="btn secondary" variant="tonal" @click="showModules">
            Show modules
          </v-btn>

          <v-btn class="btn primary" color="primary" @click="approve">
            Approve application
          </v-btn>
        </div>
      </div>
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
  position: relative;
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

.card{
  margin-top: 60px;
  padding: 18px 16px;
  border-radius: 14px;
  background: #ffffff;
}

.name{
  text-align: center;
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 14px;
}

.kv{
  display:grid;
  grid-template-columns: 120px 1fr;
  gap: 8px 12px;
  font-size: 13px;
}

.k{ font-size: 17px; font-weight: 700; opacity: 0.85; }
.v{ font-size: 17px; opacity: 0.85; }

.link{
  margin-top: 14px;
  font-size: 13px;
  font-weight: 700;
  opacity: 0.8;
}
.download{
  font-size: 12px;
  font-weight: 800;
  color: #2b6cb0;
  margin-top: 4px;
}

.btn-col{
  margin-top: 16px;
  display:flex;
  flex-direction: column;
  gap: 10px;
}

.btn{
  width: 100%;
  text-transform: none !important; /* wichtig gegen Vuetify uppercase */
  letter-spacing: 0.2px;
  font-weight: 700;
  white-space: normal; /* erlaubt Umbruch */
}

.not-found{
  padding-top: 60px;
  text-align: center;
  opacity: 0.7;
}
</style>


