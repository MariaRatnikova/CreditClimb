<script setup>
// Layout-Komponente (Top-Bar + Content + Bottom Navigation)
import MobileShell from '@/components/layout/MobileShell.vue'

// Vue Composition API Helpers
import { computed, ref } from 'vue'

// Route-Parameter lesen (z. B. /student/semester/4)
import { useRoute } from 'vue-router'

// Datenquellen (Mock-/Testdaten)
import { semestersData } from '@/data/semestersData'
import { universityPlan } from '@/data/universityPlan'

// Student-Plan (persistiert in localStorage)
import { loadStudentPlan, saveStudentPlan } from '@/data/studentPlan'

// Logik-Helfer für Progress-Ringe und Gruppierung der Module
import { buildOfficialVsStudentRings } from '@/utils/planProgress'
import { buildSemesterModuleGroups } from '@/utils/semesterModuleGroups'

// UI-Komponente für Modul-Karten
import ModuleCard from '@/components/common/ModuleCard.vue'

// Zugriff auf die aktuelle Route
const route = useRoute()

// Semester-ID aus der URL robust parsen (Fallback: 1, falls ungültig)
const semesterId = computed(() => {
  const raw = route.params.semesterId
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? n : 1
})

// Student-Plan laden und als ref halten, damit Änderungen reaktiv sind
// (Wichtig: nach saveStudentPlan wird studentPlan.value neu gesetzt)
const studentPlan = ref(loadStudentPlan())

// Optional: „Ist“-Daten für dieses Semester (falls du später semester-spezifisch rendern willst)
const actualSemester = computed(() =>
  (semestersData ?? []).find(s => Number(s.semester) === semesterId.value) ?? null
)

// Progress-Ringe berechnen (Official vs Student) auf Basis des gewählten Semesters
const rings = computed(() =>
  buildOfficialVsStudentRings({
    semesterNumber: semesterId.value,
    semestersData,
    universityPlan,
    // Achtung: hier wird das echte Plan-Objekt übergeben (nicht die ref selbst)
    studentPlan: studentPlan.value,
  })
)

// Module in drei Gruppen aufteilen: notCompleted / completed / rescheduled
const groups = computed(() =>
  buildSemesterModuleGroups({
    semesterNumber: semesterId.value,
    semestersData,
    universityPlan,
    studentPlan: studentPlan.value,
  })
)

// Wird verwendet für Empty-State (wenn wirklich in allen Gruppen nichts drin ist)
const hasAny = computed(() =>
  (groups.value.notCompleted.length +
    groups.value.rescheduled.length +
    groups.value.completed.length) > 0
)

/* =========================
   ADD MODULE OVERLAY (UI + minimal Persistenz)
   ========================= */

// Overlay öffnen/schließen
const showAddOverlay = ref(false)

// Aktuell ausgewählte Modul-ID im Select
const selectedModuleId = ref(null)

// Set mit IDs, die im aktuellen Semester bereits im Student-Plan eingeplant sind
// (Damit sie im Overlay nicht nochmal angeboten werden)
const plannedThisSemesterIds = computed(() => {
  const set = new Set()
  const schedule = studentPlan.value?.schedule ?? []

  for (const s of schedule) {
    if (s?.moduleId && Number(s?.scheduledSemester) === semesterId.value) {
      set.add(s.moduleId)
    }
  }
  return set
})

// Set mit IDs, die bereits „abgeschlossen“ sind (grade vorhanden)
// Quelle: semestersData
const completedIds = computed(() => {
  const set = new Set()
  const sems = semestersData ?? []

  for (const sem of sems) {
    // je nach Datenmodell: modules / module / items
    const mods = sem?.modules ?? sem?.module ?? sem?.items ?? []
    for (const m of mods) {
      const id = m?.id ?? m?.moduleId
      const grade = m?.grade

      // „abgeschlossen“, wenn grade nicht leer ist
      if (id && grade != null && String(grade).trim() !== '') {
        set.add(id)
      }
    }
  }
  return set
})

// Items für v-select:
// - Module aus semestersData (nur „nicht bestanden/noch nicht abgelegt“ -> grade leer)
// - nicht zeigen, wenn bereits im aktuellen Semester eingeplant
// Hinweis: Du könntest hier alternativ aus universityPlan kommen, je nach gewünschter Quelle.
const availableModuleItems = computed(() => {
  const result = []
  const schedule = studentPlan.value?.schedule ?? []

  // Set: was steht bereits in diesem Semester?
  const plannedHere = new Set(
    schedule
      .filter(s => Number(s.scheduledSemester) === semesterId.value)
      .map(s => s.moduleId)
  )

  for (const sem of semestersData ?? []) {
    const modules = sem?.modules ?? []

    for (const m of modules) {
      const id = m.id ?? m.moduleId
      const grade = m.grade
      if (!id) continue

      // 1) nur NICHT bestandene / noch offene Module (grade leer)
      if (grade != null && String(grade).trim() !== '') continue

      // 2) nicht anbieten, wenn bereits im aktuellen Semester geplant
      if (plannedHere.has(id)) continue

      // Anzeige-Label möglichst robust (Fallback: "Module <id>")
      result.push({
        title:
          m.title ??
          m.name ??
          m.moduleTitle ??
          m.moduleName ??
          m.label ??
          `Module ${id}`,
        value: id,
      })
    }
  }

  return result
})

// Overlay öffnen (Selection resetten)
function openAddOverlay() {
  selectedModuleId.value = null
  showAddOverlay.value = true
}

// Overlay schließen (Selection resetten)
function closeAddOverlay() {
  showAddOverlay.value = false
  selectedModuleId.value = null
}

// Ausgewähltes Modul dem aktuellen Semester im Student-Plan zuweisen
// Logik:
// - wenn das Modul schon irgendwo geplant ist -> Semester umhängen
// - sonst neuen Eintrag in schedule hinzufügen
// - danach speichern und studentPlan.value neu setzen (Reaktivität!)
function addSelectedModuleToSemester() {
  const id = selectedModuleId.value
  if (!id) return

  const schedule = studentPlan.value?.schedule
  if (!Array.isArray(schedule)) return

  const existing = schedule.find(x => x?.moduleId === id)
  if (existing) {
    existing.scheduledSemester = semesterId.value
  } else {
    schedule.push({
      moduleId: id,
      scheduledSemester: semesterId.value,
    })
  }

  // Wichtig: saveStudentPlan gibt ein „safe“ Objekt zurück -> neu zuweisen,
  // damit computed (groups/rings) garantiert neu berechnet werden.
  studentPlan.value = saveStudentPlan(structuredClone(studentPlan.value))

  closeAddOverlay()
}
</script>

<template>
  <!-- Zurück-Button außerhalb des MobileShell (schwebt über UI) -->
  <button class="icon-btn" type="button" @click="$router.back()" aria-label="Back">
    <span class="icon">←</span>
  </button>

  <!-- Mobile Layout -->
  <MobileShell base="/student">
    <!-- Header: Progress-Ringe -->
    <v-card class="plan-card" :key="semesterId" elevation="0">
      <div class="rings">
        <!-- Official Ring -->
        <div class="ring big">
          <v-progress-circular
            :model-value="rings.official.percent"
            :size="120"
            :width="10"
            color="rgba(198,222,255,1)"
            bg-color="rgba(0,0,0,0.10)"
            rotate="-90"
          />
          <div class="ring-center">
            {{ rings.official.done }}
          </div>
        </div>

        <!-- Student Ring -->
        <div class="ring small">
          <v-progress-circular
            :model-value="rings.student.percent"
            :size="76"
            :width="8"
            color="rgba(255,190,134,1)"
            bg-color="rgba(0,0,0,0.10)"
            rotate="-90"
          />
          <div class="ring-center small-text">
            {{ rings.student.done }}
          </div>
        </div>
      </div>

      <h2 class="plan-title">Official Plan/Overall</h2>
      <p class="plan-sub">{{ semesterId }}. Semester</p>
    </v-card>

    <!-- Content -->
    <section class="overview">
      <!-- Plus-Button: öffnet Overlay -->
      <button class="add-btn" type="button" @click="openAddOverlay" aria-label="Add module">
        +
      </button>

      <!-- Empty State -->
      <div v-if="!hasAny" class="empty">
        No modules yet.
      </div>

      <!-- Listen -->
      <div v-else>
        <!-- Not Completed -->
        <div class="section">
          <div v-if="groups.notCompleted.length > 0" class="list">
            <h3 class="section-title center">Not Completed</h3>
            <ModuleCard
              v-for="m in groups.notCompleted"
              :key="m.id"
              :module="m"
              :showSemester="true"
            />
          </div>
          <div v-else class="hidden"></div>
        </div>

        <!-- Completed -->
        <div class="section">
          <div v-if="groups.completed.length > 0" class="list">
            <h3 class="section-title center">Completed</h3>
            <ModuleCard
              v-for="m in groups.completed"
              :key="m.id"
              :module="m"
              :showSemester="false"
            />
          </div>
          <div v-else class="hidden"></div>
        </div>

        <!-- Rescheduled -->
        <div class="section">
          <div v-if="groups.rescheduled.length > 0" class="list muted">
            <h3 class="section-title center">Rescheduled</h3>
            <ModuleCard
              v-for="m in groups.rescheduled"
              :key="m.id"
              :module="m"
              :showSemester="true"
            />
          </div>
          <div v-else class="hidden"></div>
        </div>

        <!-- ADD MODULE OVERLAY -->
        <div v-if="showAddOverlay" class="overlay" @click.self="closeAddOverlay">
          <div class="overlay-card" role="dialog" aria-modal="true">
            <h3 class="overlay-title">Choose module for this semester</h3>

            <v-select
              v-model="selectedModuleId"
              :items="availableModuleItems"
              item-title="title"
              item-value="value"
              density="comfortable"
              variant="outlined"
              class="overlay-select"
              hide-details
            />

            <div class="overlay-actions">
              <button class="overlay-btn ghost" type="button" @click="closeAddOverlay">
                Cancel
              </button>

              <button
                class="overlay-btn primary"
                type="button"
                :disabled="!selectedModuleId"
                @click="addSelectedModuleToSemester"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </MobileShell>
</template>


<style scoped>
.hidden {
  display: none !important;
}



:deep(.mobile-root),
:deep(.v-application),
:deep(.v-application__wrap),
:deep(.v-main),
:deep(.v-main__wrap) {
  background: #567EA8 !important; 
}


:deep(.top-bar),
:deep(.top-bar .v-app-bar),
:deep(.top-bar .v-app-bar__content),
:deep(.top-bar .v-toolbar__content) {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
}


:deep(.content),
:deep(.mobile-content) {
  background: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
}

.plan-card {
  background: #567EA8 !important;
  color: #fff;
  border-radius: 0 !important;
  box-shadow: none !important;
  padding-bottom: 22px; 
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


.rings{
  margin-top: 12px;
  position: relative;
  height: 148px;
  display: flex;
  justify-content: center;   
  align-items: center;      
}


.ring{
  position: relative;
  display:grid;
  place-items:center;
  background: #ffffff;
  border-radius: 999px;
  box-shadow: 0 10px 18px rgba(0,0,0,0.20);
}


.ring.big{
  width: 138px;
  height: 138px;
  position: relative;
  transform: translate(-35px, 0px);           
}


.ring.small{
  width: 96px;
  height: 96px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(20px, -40px);
}

/* Zahl in der Mitte */
.ring-center{
  position:absolute;
  font-weight: 900;
  font-size: 34px;
  color: rgba(0,0,0,0.85);
}

.small-text{
  font-size: 24px;
}

/* Titel/Untertitel wie im Mock */
.plan-title{
    margin-top: 10px;
    color: #FFF;
    text-align: center;
    font-size: 32px;
    font-weight: 700;
    
}

.plan-sub{
color: #FFF;
text-align: center;
font-size: 20px;
font-weight: 600;
}

.overview{
  padding: 18px 16px 90px;
  background-color:#FFF;
  box-shadow: 0 -8px 18px rgba(0,0,0,0.18);
  margin-top: -5px;
 position: relative;
  z-index: 2;
}
.title{
  margin: 6px 0 12px;
  text-align:center;
  font-weight: 800;
  font-size: 26px;
}
.section{
  margin-top: 14px;
}

.section-title{
  font-size: 24px;
  font-weight: 700;
  text-align:center;
  margin: 0;
}


.list{
  display:flex;
  flex-direction: column;
  gap: 14px;
}
.muted{
  opacity: 0.55;
}
.empty{
  text-align:center;
  opacity: 0.7;
  padding: 30px 0;
}

.section-head{
  position: relative;
  display:flex;
  align-items:center;
  justify-content:center;
  margin: 0 0 10px;
}

.add-btn{
  position:absolute;
  right: 20px;
  top: 50px;
  transform: translateY(-50%);
  border-radius: 10px;
  border: none;
  background: transparent;
  color: black;
  font-size: 50px;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
}

.add-btn:active{
  transform: translateY(-50%) scale(0.98);
}

/* Overlay */
.overlay{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index: 99999;
  padding: 18px;
}

.overlay-card{
  width: 100%;
  max-width: 520px;
  background: #fff;
  border-radius: 14px;
  padding: 18px 18px 16px;
  box-shadow: 0 18px 40px rgba(0,0,0,0.30);
}

.overlay-title{
  margin: 0 0 14px;
  font-size: 20px;
  font-weight: 500;
  color: rgba(0,0,0,0.85);
}

.overlay-select{
  margin-bottom: 16px;
}

.overlay-actions{
  display:flex;
  gap: 14px;
  justify-content:center;
}

.overlay-btn{
  min-width: 170px;
  height: 44px;
  border-radius: 10px;
  border: none;
  font-weight: 700;
  cursor: pointer;
}

.overlay-btn.ghost{
  background: rgba(0,0,0,0.06);
  color: rgba(0,0,0,0.70);
}

.overlay-btn.primary{
  background: #567EA8;
  color: #fff;
}

.overlay-btn:disabled{
  opacity: 0.45;
  cursor: not-allowed;
}

</style>

