<script setup>
// Layout-Wrapper für mobile Seiten (Header/Bottom-Navigation etc.)
import MobileShell from '@/components/layout/MobileShell.vue'

// Hintergrundbild für den Hero-Bereich (oben, „Berg“-Background)
import bg from '@/assets/mainBackground.png'

// Router zum Navigieren zwischen den Views
import { useRouter } from 'vue-router'

// Vue Composition API: Reaktivität + Lifecycle Hooks
import { ref, computed, reactive, onMounted, onBeforeUnmount } from 'vue'


// Statische Semesterdaten + App-Defaults (z. B. aktuelles Semester, Default-Ziele)
import { semestersData, APP_DEFAULTS } from '@/data/semestersData'

// Card-Komponente für ein Modul
import ModuleCard from '@/components/common/ModuleCard.vue'

import { buildEctsComparisonChart } from '@/utils/credits'

import { universityPlan } from '@/data/universityPlan'
import { loadStudentPlan } from '@/data/studentPlan'


// Store importiert, aktuell aber im Code nicht verwendet (kann entfernt werden, wenn nicht geplant)
import { useGoalsStore } from '@/stores/goalsStore'

const router = useRouter()

// Navigation: Klick auf Semester führt zur Semester-Detailseite
function goToSemester(id) {
  router.push(`/student/semester/${id}`)
}

// Buttons für Semesterübersicht: berechnet Anzahl Module + Fortschritt pro Semester
const semesterButtons = computed(() =>
  semestersData
    .map(s => {
      const total = s.modules?.length ?? 0
      // "done" = Module, die eine Note haben (note != null/undefined)
      const done = (s.modules ?? []).filter(m => m.grade !== null && m.grade !== undefined).length
      return {
        id: s.semester,
        label: `${s.semester}. Semester`,
        done,
        total,
        // Fortschritt in Prozent (0..100)
        progress: total ? Math.round((done / total) * 100) : 0,
      }
    })
    // Sortierung: neuestes/höchstes Semester zuerst
    .sort((a, b) => b.id - a.id)
)

// Lokale, reaktive Kopie (falls du später Semesters dynamisch verändern willst)
const semesters = ref(semestersData)

// Berechnet die bereits erreichten Credits über alle Semester
// Credits werden nur gezählt, wenn das Modul eine Note hat
function calcEarnedCredits(semestersArr) {
  return (semestersArr ?? []).reduce((sum, sem) => {
    const modules = sem.modules ?? []
    const earnedInSemester = modules.reduce((mSum, m) => {
      const hasGrade = m.grade !== null && m.grade !== undefined
      return mSum + (hasGrade ? (m.credits ?? 0) : 0)
    }, 0)
    return sum + earnedInSemester
  }, 0)
}

// Reaktive Ausgabe der erreichten Credits
const earnedCredits = computed(() => calcEarnedCredits(semesters.value))

// ===== Scroll → Hero schrumpft + Semester-Buttons ausblenden =====

// Scroll-Position (Y) wird reaktiv gespeichert
const scrollY = ref(0)

// Viewport-Höhe, damit der Hero anfangs „den ganzen Screen“ füllen kann
const viewportH = ref(window.innerHeight)

// UI-Tuning/Parameter
const SHEET_OVERLAP = 24       // wie weit das weiße Sheet über den Hero „drüberrutscht“
const HERO_MIN_H = 170         // minimale Höhe des Hero nach dem Schrumpfen
const SHRINK_DISTANCE = 240    // Scroll-Distanz (px), über die das Schrumpfen passiert

// Scroll-Position auslesen (für mobiles Scrollen robust)
function readScroll() {
  scrollY.value = window.scrollY || document.documentElement.scrollTop || 0
}

// Viewport-Höhe updaten (wichtig bei Rotation/Resize)
function readViewport() {
  viewportH.value = window.innerHeight
}

// Listener setzen, sobald die Komponente gemountet ist
onMounted(() => {
  readScroll()
  window.addEventListener('scroll', readScroll, { passive: true })
  window.addEventListener('resize', readViewport)
})

// Listener wieder entfernen (Memory-Leaks vermeiden)
onBeforeUnmount(() => {
  window.removeEventListener('scroll', readScroll)
  window.removeEventListener('resize', readViewport)
})

// Hero soll anfangs so hoch sein, dass das Sheet nicht „zu früh“ sichtbar ist
const heroMaxH = computed(() => viewportH.value + SHEET_OVERLAP)

// Fortschritt des Schrumpfens in [0..1]
const shrinkProgress = computed(() => {
  const p = scrollY.value / SHRINK_DISTANCE
  return Math.min(1, Math.max(0, p))
})

// Resultierende Höhe des Hero, abhängig vom Scroll-Fortschritt
const heroHeight = computed(() => {
  const maxH = heroMaxH.value
  const minH = HERO_MIN_H
  return Math.round(maxH - (maxH - minH) * shrinkProgress.value)
})

// Ab diesem Fortschritt werden die Buttons ausgeblendet (UI-Fokus auf Content)
const hideButtons = computed(() => shrinkProgress.value > 0.40)

// Aktuelles Semester anhand Default-Setting ermitteln
const currentSemester = computed(() =>
  semestersData.find(s => s.semester === APP_DEFAULTS.currentSemester) ?? null
)

// Ziel-Credits: semester-spezifisch, falls definiert; sonst globaler Default
const creditsGoal = computed(() =>
  currentSemester.value?.goals?.creditsGoal ?? APP_DEFAULTS.creditsPerSemester
)

// Ziel-Note: semester-spezifisch, falls definiert; sonst globaler Default
const targetGrade = computed(() =>
  currentSemester.value?.goals?.targetGrade ?? APP_DEFAULTS.defaultTargetGrade
)

// Gesamtdurchschnitt über alle Module mit Note
function calcOverallAverageGrade(semestersArr) {
  // Nur Module mit Note berücksichtigen
  const grades = (semestersArr ?? [])
    .flatMap(s => s.modules ?? [])
    .map(m => m.grade)
    .filter(g => g !== null && g !== undefined)

  if (grades.length === 0) return null

  const sum = grades.reduce((acc, g) => acc + Number(g), 0)
  // 1 Nachkommastelle (z. B. 2,3)
  return Number((sum / grades.length).toFixed(1))
}

// Durchschnitt pro Semester (nur wenn im Semester Noten existieren)
function calcSemesterAverages(semestersArr) {
  return (semestersArr ?? [])
    .map(s => {
      const grades = (s.modules ?? [])
        .map(m => m.grade)
        .filter(g => g !== null && g !== undefined)

      if (grades.length === 0) return { semester: s.semester, avg: null }

      const sum = grades.reduce((acc, g) => acc + Number(g), 0)
      const avg = Number((sum / grades.length).toFixed(1))
      return { semester: s.semester, avg }
    })
    // Reihenfolge von Semester 1 → n (praktisch für Charts)
    .sort((a, b) => a.semester - b.semester)
}

// Baut einfache Line-Chart-Daten (SVG-Pfad), basierend auf Semester-Durchschnitten
function buildLineChartData(semesterAverages, width = 260, height = 120, padding = 18) {
  // Nur Werte mit vorhandenem avg
  const data = (semesterAverages ?? []).filter(x => x.avg !== null)

  if (data.length === 0) {
    // Kein Chart möglich, wenn keine Daten vorhanden
    return { points: [], pathD: '', min: null, max: null }
  }

  // Min/Max für Skalierung
  const values = data.map(d => d.avg)
  const min = Math.min(...values)
  const max = Math.max(...values)

  // Range absichern (keine Division durch 0)
  const range = max - min || 1

  const innerW = width - padding * 2
  const innerH = height - padding * 2

  // X-Abstand zwischen Punkten
  const stepX = data.length === 1 ? 0 : innerW / (data.length - 1)

  const points = data.map((d, i) => {
    const x = padding + i * stepX
    // Hinweis: bei Noten ist "kleiner = besser".
    // Hier wird "größer = weiter unten" dargestellt (typische Chart-Logik).
    const t = (d.avg - min) / range
    const y = padding + t * innerH
    return { semester: d.semester, avg: d.avg, x, y }
  })

  // SVG-Path "M x y L x y ..."
  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  return { points, pathD, min, max }
}

// Reaktiver Gesamtschnitt (aktuell direkt aus semestersData, nicht aus semesters.value)
const overallAvg = computed(() => calcOverallAverageGrade(semestersData))

// Reaktive Semester-Avgs (ebenfalls aus semestersData)
const semesterAverages = computed(() => calcSemesterAverages(semestersData))

// Finales Chart-Objekt für die UI
const chart = computed(() =>
  buildLineChartData(semesterAverages.value, 260, 120, 18)
)

const ectsChart = computed(() => buildEctsComparisonChart(semestersData, {
  width: 320,
  height: 140,
  padding: 18,
}))


const chartPoints = computed(() => ectsChart.value.pointsAttr)
const chartPointObjects = computed(() => ectsChart.value.points)

</script>


<template>
  <!-- Seite: Hintergrundbild wird als CSS-Variable an den Hero übergeben -->
  <div class="student-home" :style="{ '--page-bg': `url(${bg})` }">
    <MobileShell base="/student">
      <!-- Hero-Höhe wird dynamisch (Shrink beim Scrollen) gesetzt -->
      <div class="page" :style="{ '--hero-h': heroHeight + 'px' }">
        <section class="hero">
          <!-- Semester-Buttons werden beim Scrollen ausgeblendet -->
          <div class="semester-list" :class="{ hidden: hideButtons }">
            <button
              v-for="s in semesterButtons"
              :key="s.id"
              class="sem-pill"
              :class="{ peach: s.id === 5 }"
              type="button"
              @click="goToSemester(s.id)"
            >
              <div class="ring-wrap">
                <!-- Fortschritt pro Semester (Anteil der benoteten Module) -->
                <v-progress-circular
                  :model-value="s.progress"
                  :size="32"
                  :width="3"
                  color="#2A5481"
                />
                <div class="ring-num">{{  s.done  }}</div>
              </div>
              <div class="pill-text">{{ s.label }}</div>
            </button>

            <!-- Summe der bereits erreichten Credits -->
            <div class="credits-card">
              <div class="credits-text">{{ earnedCredits }} Credits</div>
            </div>
          </div>
        </section>

        <section class="sheet">
          <!-- Kleine Griff-/Handle-Leiste als visueller Hinweis: das Sheet kann „gezogen“/gescrollt werden -->
          <div class="sheet-handle" />

          <!-- Überschrift: wird nur angezeigt, wenn currentSemester existiert -->
          <h2 v-if="currentSemester" class="sheet-title">
            {{ currentSemester.semester }}. Semester
          </h2>

          <!-- Modulliste des aktuellen Semesters (nur rendern, wenn currentSemester vorhanden ist) -->
          <div v-if="currentSemester" class="modules">
            <ModuleCard
              v-for="m in currentSemester.modules"
              :key="m.name"
              :module="{ ...m, semester: currentSemester.semester }"
              :showSemester="false"
            />
          </div>

          <!-- Bereich: Ziele für das Semester -->
          <h3 class="sheet-title-h3">Semester goals</h3>

          <!-- Zielwerte-Karte: Target Grade + Credits pro Semester (nur wenn currentSemester existiert) -->
          <div class="stats-card" v-if="currentSemester">
            <div class="stats-left">
              <p class="stats-left-label">Target grade</p>
              <p class="stats-left-value">
                {{ targetGrade !== null ? String(targetGrade).replace('.', ',') : '—' }}
              </p>
            </div>

            <div class="stats-right">
              <p class="stats-right-label">Credits per semester</p>
              <p class="stats-right-value">{{ creditsGoal }} ECTS</p>
            </div>
          </div>

          <!-- Bereich: Statistiken -->
          <h3 class="sheet-title-h3">Statistics</h3>

          <div class="avarage-stats">
            <div class="avarage-stats-left">
              <div class="avg-circle">
                <span class="avg-number">
                  {{ overallAvg !== null ? String(overallAvg).replace('.', ',') : '—' }}
                </span>
              </div>
              <div class="avg-label">Average Grade</div>
            </div>

            <div class="avarage-stats-right">
              <div class="chart-title">Semester average</div>

              <svg
                class="avg-chart"
                :viewBox="`0 0 260 120`"
                role="img"
                aria-label="Semester average chart"
              >
                <path :d="chart.pathD" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="3" />

                <g v-for="p in chart.points" :key="p.semester">
                  <circle :cx="p.x" :cy="p.y" r="4" fill="rgba(255,255,255,0.95)" />
                  <text
                    :x="p.x"
                    :y="p.y - 10"
                    text-anchor="middle"
                    font-size="12"
                    fill="rgba(255,255,255,0.95)"
                    font-weight="700"
                  >
                    {{ String(p.avg).replace('.', ',') }}
                  </text>
                </g>
              </svg>
            </div>
          </div>

          <!-- ECTS-Fortschritt: Vergleich/Verlauf als SVG-Polyline -->
          <div class="ects-card">
            <div class="ects-title">ECTS Progress</div>

            <svg class="ects-chart" viewBox="0 0 320 140" preserveAspectRatio="none">
              <polyline
                :points="chartPoints"
                fill="none"
                stroke="rgba(42,84,129,0.55)"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />

              <template v-for="(p, i) in chartPointObjects" :key="i">
                <text
                  :x="p.x"
                  :y="p.y - 8"
                  text-anchor="middle"
                  font-size="14"
                  font-weight="700"
                  fill="rgba(0,0,0,0.65)"
                >
                  {{ p.value }}
                </text>
              </template>
            </svg>
          </div>
        </section>
      </div>
    </MobileShell>
  </div>
</template>


<style scoped>
.student-home :deep(.mobile-root) {
  background: #FFF8E8 !important;
}

.student-home :deep(.content) {
  padding: 0 !important;
}

.student-home :deep(.top-bar) {
  background: transparent !important;
  box-shadow: none !important;
}

.page {
  --sheet-overlap: 24px;
  
}


.hero {
  position: sticky;
  top: 0;
  z-index: 2;
  height: var(--hero-h);
  overflow: hidden;
  background-image: var(--page-bg);
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  transition: height 160ms ease;
}


.semester-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 16px;
  transition: opacity 160ms ease, transform 160ms ease;
}


.semester-list.hidden {
  opacity: 0;
  transform: translateY(-10px);
  pointer-events: none;
}
.sem-pill{
  display: flex;
  align-items: center;
  gap: 16px;
  width: 185px;
  height: 61px;
  padding: 12px 16px;
  border: none;
  border-radius: 27px;
  cursor: pointer;
  background: #B4D1F8;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25), 0 4px 4px 0 rgba(0, 0, 0, 0.25);
}

.sem-pill:active{
  background-color:#567EA8;
  transform: translateY(5px);
}

.sem-pill:nth-child(odd){
  align-self: flex-start;
}
.sem-pill:nth-child(even){
  align-self: flex-end;
}


.sem-pill.peach{
  border-radius: 27px;
  background: #FFDFCB;
}

.ring-wrap{
  position: relative;
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.95);
  border-radius: 999px;
  display: grid;
  place-items: center;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25), 0 4px 4px 0 rgba(0, 0, 0, 0.25);
}
.ring-num{
  position: absolute;
  font-weight: 800;
  font-size: 16px;
}
.pill-text{
  font-weight: 600;
  font-size: 16px;
  color: rgba(0,0,0,0.80);
}
.credits-card{
  margin-top: 16px;
  align-self: center;
  background: #FFFFFF;
  padding: 14px 22px;
  border-radius: 14px;
  box-shadow: 0 10px 22px rgba(0,0,0,0.18);
}
.credits-text{
  font-weight: 800;
  font-size: 20px;
}

.sheet {
  position: relative;
  z-index: 3; 
  margin-top: calc(-1 * var(--sheet-overlap));
  background: #ffffff;
  border-top-left-radius: 28px;
  border-top-right-radius: 28px;
  box-shadow: 0 -12px 30px rgba(0, 0, 0, 0.18);
  padding: 14px 16px 40px;
  min-height: calc(100vh + var(--sheet-overlap));
}

.sheet-handle {
  width: 54px;
  height: 6px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.12);
  margin: 6px auto 14px;
}
.modules{
  display:flex;
  flex-direction: column;
  gap: 14px;
}
.sheet-title{
  text-align:center;
  font-weight: 800;
  font-size: 28px;
  margin: 6px 0 16px;
}
.sheet-title-h3{
  margin-top: 24px;
  font-weight:700;
  font-size: 24px;
  text-align: center;
}
.stats-card{
  background-color: #F1F7FF;
  border-radius: 17px;
  margin-top: 15px;
  display: flex;
  flex-direction: row;
  filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.25));
  min-height: 88px;   
}
.stats-left{
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center;  
  width: 30%;
  border-radius: 17px;
  background: #567EA8;
  padding:12px;
  gap: 5px;
}
.stats-left p{
  margin: 0;              
}
.stats-left-label{
color: #FFF;
font-size: 13px;
font-weight: 700;
}
.stats-left-value{
color: #FFF;
text-align: center;
font-size: 24px;
font-weight: 700;
}
.stats-right{
  flex: 1;                 
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center;    
  gap: 5px;
  padding: 12px;           
}
.stats-right-label{
  color: #000;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
}
.stats-right-value{
  color: #000;
  text-align: center;
  font-size: 32px;
  font-weight: 700;
}
.avarage-stats{
  border-radius: 17px;
  background: #567EA8;
  display: flex;
  flex-direction: row;
  align-items: stretch;     
  overflow: hidden; 
  margin-top: 20px;
  filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.25));
}
.avarage-stats-left{
  border-radius: 17px;
  background: #F1F7FF;
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center;  
  width: 30%;
  padding: 28px 15px;
}
.avarage-stats-right{
  width: 70%;
  min-width: 0;
  padding: 10px;
}

.avg-number{
  color: #000;
  text-align: center;
  font-size: 24px;
  font-weight: 700;
}
.avg-circle{
  width: 70px;
  height:70px;
  border-radius: 50%;
  border: 4px solid #FFBD8E;
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center;  
}
.avg-label{
  color: #000;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  margin-top: 10px ;
}
.chart-title{
  color: #FFF;
  text-align: center;
  font-size: 13px;
  font-style: normal;
  font-weight: 700;
  margin-bottom: 20px;
  }

.ects-card{
 margin-top: 40px;
  border-radius: 17px;
  background: #C6DEFF;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  padding: 15px 30px;
}
.ects-title{
  color: #000;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 23px;
}
 
</style>
