<script setup>
import MobileShell from '@/components/layout/MobileShell.vue'
import bg from '@/assets/mainBackground.png'
import { useRouter } from 'vue-router'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { semestersData, APP_DEFAULTS } from '@/data/semestersData'
import ModuleCard from '@/components/common/ModuleCard.vue'
import { useGoalsStore } from '@/stores/goalsStore'

const router = useRouter()

function goToSemester(id) {
  router.push(`/student/semester/${id}`)
}
const semesterButtons = computed(() =>
  semestersData
    .map(s => {
      const total = s.modules?.length ?? 0
      const done = (s.modules ?? []).filter(m => m.grade !== null && m.grade !== undefined).length
      return {
        id: s.semester,
        label: `${s.semester}. Semester`,
        done,
        total,
        progress: total ? Math.round((done / total) * 100) : 0,
      }
    })
    .sort((a, b) => b.id - a.id) 
)
const semesters = ref(semestersData)

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
const earnedCredits = computed(() => calcEarnedCredits(semesters.value))
// ===== Scroll → shrinking hero + hide buttons =====
const scrollY = ref(0)
const viewportH = ref(window.innerHeight)


const SHEET_OVERLAP = 24          // насколько белый лист "заезжает" на гору
const HERO_MIN_H = 170            // до какой высоты сжимается гора (шапка)
const SHRINK_DISTANCE = 240      // за сколько пикселей скролла происходит сжатие

function readScroll() {
  scrollY.value = window.scrollY || document.documentElement.scrollTop || 0
}
function readViewport() {
  viewportH.value = window.innerHeight
}

onMounted(() => {
  readScroll()
  window.addEventListener('scroll', readScroll, { passive: true })
  window.addEventListener('resize', readViewport)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', readScroll)
  window.removeEventListener('resize', readViewport)
})

// hero должен быть настолько высоким, чтобы sheet не торчал в начале
const heroMaxH = computed(() => viewportH.value + SHEET_OVERLAP)

// прогресс сжатия 0..1
const shrinkProgress = computed(() => {
  const p = scrollY.value / SHRINK_DISTANCE
  return Math.min(1, Math.max(0, p))
})

// итоговая высота hero
const heroHeight = computed(() => {
  const maxH = heroMaxH.value
  const minH = HERO_MIN_H
  return Math.round(maxH - (maxH - minH) * shrinkProgress.value)
})

// когда прячем кнопки
// порог можно менять: 0.20 = исчезают довольно рано
const hideButtons = computed(() => shrinkProgress.value > 0.40)

const currentSemester = computed(() =>
  semestersData.find(s => s.semester === APP_DEFAULTS.currentSemester) ?? null
)


const creditsGoal = computed(() =>
  // если у семестра задано своё значение — берём его, иначе общее из APP_STATS
  currentSemester.value?.goals?.creditsGoal ?? APP_DEFAULTS.creditsPerSemester
)
const targetGrade = computed(() =>
  currentSemester.value?.goals?.targetGrade ?? APP_DEFAULTS.defaultTargetGrade
)

</script>

<template>
  <div class="student-home" :style="{ '--page-bg': `url(${bg})` }">
    <MobileShell base="/student">
      <div class="page" :style="{ '--hero-h': heroHeight + 'px' }">
       
        <section class="hero">
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
                <v-progress-circular
                  :model-value="s.progress"
                  :size="32"
                  :width="3"
                  color="#2A5481"
                />
                <div class="ring-num">{{ s.total }}</div>
              </div>
              <div class="pill-text">{{ s.label }}</div>
            </button>

            <div class="credits-card">
              <div class="credits-text">{{ earnedCredits }} Credits</div>
            </div>
          </div>
        </section>

        
        <section class="sheet">
          <div class="sheet-handle" />

          <h2 v-if="currentSemester" class="sheet-title">
            {{ currentSemester.semester }}. Semester
          </h2>

          <div v-if="currentSemester" class="modules">
            <ModuleCard
              v-for="m in currentSemester.modules"
              :key="m.name"
              :module="{ ...m, semester: currentSemester.semester }"
              :showSemester="false"
            />
          </div>
          <h3 class="sheet-title-h3">Semester goals</h3>
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
  z-index: 3; /* лист выше горы */
  /* заезд листа на гору */
  margin-top: calc(-1 * var(--sheet-overlap));
  background: #ffffff;
  border-top-left-radius: 28px;
  border-top-right-radius: 28px;
  box-shadow: 0 -12px 30px rgba(0, 0, 0, 0.18);
  padding: 14px 16px 40px;

  /* чтобы лист ощущался как "второй экран" */
  min-height: calc(100vh + var(--sheet-overlap));
}

.sheet-handle {
  width: 54px;
  height: 6px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.12);
  margin: 6px auto 14px;
}
.sheet-title{
  margin: 8px 0 12px;
  font-weight:700;
  font-size: 32px;
  text-align: center;
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
  margin: 0;              /* убираем дефолтные отступы у текста */
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
  flex: 1;                 /* занимает оставшееся место справа */
  display: flex;
  flex-direction: column;
  justify-content: center; /* вертикально по центру */
  align-items: center;     /* горизонтально по центру */
  gap: 5px;
  padding: 12px;           /* чтобы не прилипало к краям */
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
</style>
