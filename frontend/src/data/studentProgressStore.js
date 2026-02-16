import { semestersData } from '@/data/semestersData'

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
  return (x % 10_000) / 10_000
}

function currentSemesterFor(studentId) {
  const n = Number(studentId) || 0
  return (n % 6) + 1
}

function buildStudentSemesters(studentId) {
  const curSem = currentSemesterFor(studentId)

  return (semestersData ?? [])
    .map((sem) => {
      const semNr = sem.semester
      const modules = (sem.modules ?? []).map((m) => {
        let p
        if (semNr < curSem) p = 0.85
        else if (semNr === curSem) p = 0.45
        else p = 0.10

        const r = seededRand01(studentId, `m:${m.id}`)
        const done = r < p

        let grade = null
        if (done) {
          const rg = seededRand01(studentId, `g:${m.id}`)
          const steps = [1.0, 1.3, 1.7, 2.0, 2.3, 2.7, 3.0, 3.3, 3.7]
          grade = steps[Math.floor(rg * steps.length)]
        }

        const ra = seededRand01(studentId, `a:${m.id}`)
        const attempt = grade ? (ra < 0.15 ? 2 : 1) : (ra < 0.35 ? 2 : 1)

        return { ...m, grade, attempt, semester: semNr }
      })

      return { ...sem, modules }
    })
    .sort((a, b) => b.semester - a.semester)
}

function calcCredits(semesters) {
  let sum = 0
  for (const sem of semesters) {
    for (const m of sem.modules ?? []) {
      if (m.grade !== null && m.grade !== undefined) sum += Number(m.credits) || 0
    }
  }
  return sum
}

const cache = new Map()

export function useStudentProgress() {
  function getStudentSemesters(studentId) {
    const key = String(studentId)
    if (!cache.has(key)) cache.set(key, buildStudentSemesters(key))
    return cache.get(key)
  }

  function getStudentCredits(studentId) {
    return calcCredits(getStudentSemesters(studentId))
  }

  return { currentSemesterFor, getStudentSemesters, getStudentCredits }
}
