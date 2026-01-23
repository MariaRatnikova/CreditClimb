import { ref, computed } from 'vue'
import { mockStudents } from '@/data/mockStudents'
import { semestersData } from '@/data/semestersData'

/**
 * - seen: Student wurde geöffnet -> Punkt verschwindet
 * - approved: Antrag genehmigt -> "abgehakt"
 * - Module completion ist student-spezifisch (deterministisch über studentId)
 */

const APPLICATION_COUNT = 12

const base = mockStudents.slice(0, APPLICATION_COUNT).map((s, idx) => {
  const minutesAgo = idx * 37 + 12
  const requestedAt = new Date(Date.now() - minutesAgo * 60_000)
  return { ...s, requestedAt }
})

const sortMode = ref('latest')
const newOnly = ref(false)

const seenIds = ref(new Set())
const approvedIds = ref(new Set())

// ---------- deterministic helpers ----------
function hashString(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function seededRand01(seed, salt) {
  const x = hashString(`${seed}::${salt}`)
  // map uint32 to [0,1)
  return (x % 10_000) / 10_000
}

// erzeugt pro Student eine "aktuelle Semesterzahl" (1..6)
function currentSemesterFor(studentId) {
  const n = Number(studentId) || 0
  return (n % 6) + 1
}

// Student-spezifische Modul-„Abschlüsse“ deterministisch erzeugen
function buildStudentSemesters(studentId) {
  const curSem = currentSemesterFor(studentId)

  return (semestersData ?? [])
    .map((sem) => {
      const semNr = sem.semester
      const modules = (sem.modules ?? []).map((m) => {
        // Wahrscheinlichkeit „completed“ hängt davon ab, wie weit das Semester zurückliegt
        // Frühere Semester: hohe completion rate, zukünftige: sehr niedrig
        let p
        if (semNr < curSem) p = 0.85
        else if (semNr === curSem) p = 0.45
        else p = 0.10

        // pro Modul/student deterministisch
        const r = seededRand01(studentId, `m:${m.id}`)
        const done = r < p

        // Grade deterministisch, wenn done
        let grade = null
        if (done) {
          const rg = seededRand01(studentId, `g:${m.id}`)
          // Noten grob 1.0 - 3.7 in 0.3 Schritten
          const steps = [1.0, 1.3, 1.7, 2.0, 2.3, 2.7, 3.0, 3.3, 3.7]
          grade = steps[Math.floor(rg * steps.length)]
        }

        // Versuch: 1 oder 2 (selten)
        const ra = seededRand01(studentId, `a:${m.id}`)
        const attempt = grade ? (ra < 0.15 ? 2 : 1) : (ra < 0.35 ? 2 : 1)

        return {
          ...m,
          grade,
          attempt,
          semester: semNr,
        }
      })

      return { ...sem, modules }
    })
    .sort((a, b) => b.semester - a.semester)
}

function calcCredits(semesters) {
  let sum = 0
  for (const sem of semesters) {
    for (const m of sem.modules ?? []) {
      if (m.grade !== null && m.grade !== undefined) {
        sum += Number(m.credits) || 0
      }
    }
  }
  return sum
}

// Cache nicht bei jeder View neu bauen
const studentSemCache = new Map()

function getStudentSemesters(studentId) {
  const key = String(studentId)
  if (!studentSemCache.has(key)) {
    studentSemCache.set(key, buildStudentSemesters(key))
  }
  return studentSemCache.get(key)
}

function getStudentCredits(studentId) {
  return calcCredits(getStudentSemesters(studentId))
}

// ---------- public API ----------
export function useBafoegApplications() {
  const applications = ref(base)

  function markSeen(studentId) {
    seenIds.value = new Set([...seenIds.value, String(studentId)])
  }

  function approve(studentId) {
    approvedIds.value = new Set([...approvedIds.value, String(studentId)])
    markSeen(studentId)
  }

  function isSeen(studentId) {
    return seenIds.value.has(String(studentId))
  }

  function isApproved(studentId) {
    return approvedIds.value.has(String(studentId))
  }

  const byLatest = computed(() =>
    [...applications.value].sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime())
  )

  const byAZ = computed(() =>
    [...applications.value].sort((a, b) => a.name.localeCompare(b.name))
  )

  const visibleList = computed(() => {
    const baseSorted = sortMode.value === 'az' ? byAZ.value : byLatest.value
    if (!newOnly.value) return baseSorted
    return baseSorted.filter((s) => !isApproved(s.id))
  })

  return {
    // UI prefs
    sortMode,
    newOnly,
    visibleList,

    // application state
    applications,
    byLatest,
    byAZ,
    markSeen,
    approve,
    isSeen,
    isApproved,

    // student specific module/credits
    currentSemesterFor,
    getStudentSemesters,
    getStudentCredits,
  }
}
