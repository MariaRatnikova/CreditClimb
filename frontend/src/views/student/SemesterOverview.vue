<script setup>
import MobileShell from '@/components/layout/MobileShell.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { semestersData } from '@/data/semestersData'
import { universityPlan } from '@/data/universityPlan'
import { loadStudentPlan } from '@/data/studentPlan'
import { buildOfficialVsStudentRings } from '@/utils/planProgress'
import { buildSemesterModuleGroups } from '@/utils/semesterModuleGroups'
import ModuleCard from '@/components/common/ModuleCard.vue'

// Route-Param lesen (z. B. /student/semester/4)
const route = useRoute()

// Semester-ID robust parsen (Fallback: 1)
const semesterId = computed(() => {
  const raw = route.params.semesterId
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? n : 1
})


// Student-Plan aus localStorage (änderbar im Prototyp)
const studentPlan = loadStudentPlan()

// Optional: Semester-Daten (Ist) für dieses Semester (falls du später Module listen willst)
const actualSemester = computed(() =>
  (semestersData ?? []).find(s => Number(s.semester) === semesterId.value) ?? null
)

// Progress-Ringe immer auf Basis der Semester-ID berechnen
const rings = computed(() =>
  buildOfficialVsStudentRings({
    semesterNumber: semesterId.value,
    semestersData,
    universityPlan,
    studentPlan,
  })
)
const groups = computed(() =>
  buildSemesterModuleGroups({
    semesterNumber: semesterId.value,
    semestersData,
    universityPlan,
    studentPlan,
  })
)
// Für v-if/else Logik
const hasAny = computed(() =>
  (groups.value.notCompleted.length +
    groups.value.rescheduled.length +
    groups.value.completed.length) > 0
)
</script>

<template>
  <!-- Zurück-Button: liegt außerhalb des MobileShell, damit er über dem Top-Bar/Content „schwebt“ -->
  <button class="icon-btn" type="button" @click="$router.back()" aria-label="Back">
    <span class="icon">←</span>
  </button>

  <!-- MobileShell: wiederverwendbares Layout (Top-Bar + Content + Bottom-Navigation) -->
  <MobileShell base="/student">

    <!-- Header-Card: zeigt die beiden Progress-Ringe (Official vs. Student) für das gewählte Semester -->
    <!-- :key="semesterId" erzwingt ein sauberes Re-Render, wenn die Semester-ID wechselt -->
    <v-card class="plan-card" :key="semesterId" elevation="0">

      <!-- Ring-Container: großer Ring = Official Plan, kleiner Ring = Student Plan -->
      <div class="rings">

        <!-- Großer Ring: Official Plan für dieses Semester -->
        <div class="ring big">
          <v-progress-circular
            :model-value="rings.official.percent"   
            :size="120"
            :width="10"
            color="rgba(198,222,255,1)"
            bg-color="rgba(0,0,0,0.10)"
            rotate="-90"
          />
          <!-- Zahl in der Mitte: wie viele Module/ECTS (done) im Official Plan erledigt sind -->
          <div class="ring-center">
            {{ rings.official.done }}
          </div>
        </div>

        <!-- Kleiner Ring: Student Plan für dieses Semester (überlappt den großen Ring) -->
        <div class="ring small">
          <v-progress-circular
            :model-value="rings.student.percent"    
            :size="76"
            :width="8"
            color="rgba(255,190,134,1)"
            bg-color="rgba(0,0,0,0.10)"
            rotate="-90"
          />
          <!-- Zahl in der Mitte: wie viele Module/ECTS (done) im Student Plan erledigt sind -->
          <div class="ring-center small-text">
            {{ rings.student.done }}
          </div>
        </div>
      </div>

      <!-- Titel/Untertitel im Header -->
      <h2 class="plan-title">Official Plan/Overall</h2>
      <p class="plan-sub">{{ semesterId }}. Semester</p>
    </v-card>

    <!-- Übersicht-Bereich: hier kommen die Modul-Listen für das ausgewählte Semester -->
    <section class="overview">

      <!-- Wenn in allen drei Gruppen keine Module existieren -> Empty State anzeigen -->
      <div v-if="!hasAny" class="empty">
        No modules yet.
      </div>

      <!-- Sonst: drei Bereiche rendern (Not Completed, Completed, Rescheduled) -->
      <div v-else>

        <!-- ===================== NOT COMPLETED ===================== -->
        <div class="section">
          <!-- Not Completed: Module sind im Student-Plan in diesem Semester eingeplant,
               haben aber noch keine Note -->
          <div v-if="groups.notCompleted.length > 0" class="list">
            <h3 class="section-title">Not Completed</h3>

            <!-- ModuleCard: zeigt Module in einer einheitlichen Card-UI -->
            <!-- showSemester=true -> in der Card wird die Semesterzeile angezeigt -->
            <ModuleCard
              v-for="m in groups.notCompleted"
              :key="m.id"
              :module="m"
              :showSemester="true"
            />
          </div>

          <!-- Wenn keine Not-Completed Module existieren: nichts anzeigen (hidden als Platzhalter) -->
          <div v-else class="hidden"></div>
        </div>

        <!-- ===================== COMPLETED ===================== -->
        <div class="section">
          <!-- Completed: Module mit Note (grade != null/undefined) im Kontext dieses Semesters
               (je nach Logik in buildSemesterModuleGroups) -->
          <div v-if="groups.completed.length > 0" class="list">
            <h3 class="section-title center">Completed</h3>

            <!-- showSemester=false -> Semesterzeile wird ausgeblendet,
                 da wir uns bereits in der Semester-Ansicht befinden -->
            <ModuleCard
              v-for="m in groups.completed"
              :key="m.id"
              :module="m"
              :showSemester="false"
            />
          </div>

          <!-- Keine Completed Module -> nichts anzeigen -->
          <div v-else class="hidden"></div>
        </div>

        <!-- ===================== RESCHEDULED ===================== -->
        <div class="section">
          <!-- Rescheduled: Module sind im Student-Plan in diesem Semester geplant,
               aber ihr offizielles Semester im Uni-Plan ist ein anderes (verschoben) -->
          <div v-if="groups.rescheduled.length > 0" class="list muted">
            <h3 class="section-title center">Rescheduled</h3>

            <!-- showSemester=true -> Card kann das (offizielle) Semester anzeigen,
                 damit man sieht, dass es verschoben wurde -->
            <ModuleCard
              v-for="m in groups.rescheduled"
              :key="m.id"
              :module="m"
              :showSemester="true"
            />
          </div>

          <!-- Keine rescheduled Module -> nichts anzeigen -->
          <div v-else class="hidden"></div>
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
:deep(.top-bar){
  background: #567EA8 !important;
}

:deep(.content),
:deep(.mobile-content),
:deep(.page) {
  padding: 0 !important;
  margin: 0 !important;
  background: #567EA8 !important;
}

.plan-card{
     
    background: #567EA8 !important;    /* blau ähnlich wie Mock */
  padding-bottom: 20px;
  color: #fff;
  box-shadow: 0 10px 22px rgba(0,0,0,0.18);
  border-radius: 0 !important;
}


.icon-btn{
  position: fixed;
  top: 15px;          /* подстрой под твой top-bar */
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
  z-index: 9999;      /* выше top bar */
  font-weight: 800;
  font-size: 18px;
}


.rings{
  margin-top: 12px;
  position: relative;
  height: 148px;
  display: grid;
  place-items: center;
}
.rings{
  --small-x: 100px;  /* твой сдвиг маленького круга вправо */
  --small-y: 18px;   /* твой сдвиг вниз */
}

/* Weißer Kreis-Hintergrund (Badge) */
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
    transform: translateX(calc(var(--small-x) / -2));
}

/* маленький круг “привязываем” к центру большого и сдвигаем */
.ring.small{
  width: 96px;
  height: 96px;
  position: absolute;

  /* ставим в центр контейнера (там же центр большого круга) */
  left: 50%;
  top: 50%;

  transform: translate(
    calc(-50% + var(--small-x)),
    calc(-50% + var(--small-y))
  );
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
  margin-bottom: 10px !important;
  
}
.section-title.center{
  margin-bottom: 10px;
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

</style>

