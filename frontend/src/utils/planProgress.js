// src/utils/planProgress.js
// Berechnet zwei Fortschritte gleichzeitig:
// - Official Plan (Uni-Plan) vs Ist (semestersData)
// - Student Plan (Studierenden-Plan) vs Ist (semestersData)

function hasGrade(mod) {
    return mod?.grade !== null && mod?.grade !== undefined
}

// Map: moduleId -> Moduldetails aus semestersData (Ist)
function buildActualModuleMap(semestersData = []) {
    const map = new Map()
    for (const sem of semestersData ?? []) {
        for (const m of sem?.modules ?? []) {
            map.set(m.id, m)
        }
    }
    return map
}

// Set: alle Modul-IDs, die abgeschlossen sind (Note vorhanden)
function buildCompletedIdSet(actualMap) {
    const set = new Set()
    for (const [id, m] of actualMap.entries()) {
        if (hasGrade(m)) set.add(id)
    }
    return set
}

function calcProgress(ids = [], completedSet) {
    // Doppelte IDs entfernen (Sicherheit)
    const unique = Array.from(new Set(ids ?? []))
    const total = unique.length
    const done = unique.filter(id => completedSet.has(id)).length
    const percent = total ? Math.round((done / total) * 100) : 0
    return { done, total, percent }
}

// IDs aus Uni-Plan (official): Semester X
function officialIdsForSemester(universityPlan = [], semesterNumber) {
    const sem = (universityPlan ?? []).find(s => Number(s.semester) === Number(semesterNumber))
    return (sem?.modules ?? []).map(m => m.id)
}

// IDs aus Student-Plan: Semester X
function studentIdsForSemester(studentPlan, semesterNumber) {
    return (studentPlan?.schedule ?? [])
        .filter(x => Number(x.scheduledSemester) === Number(semesterNumber))
        .map(x => x.moduleId)
}

// Hauptfunktion: liefert zwei Ringe (official + student) für dasselbe Semester
export function buildOfficialVsStudentRings({
    semesterNumber,
    semestersData,
    universityPlan,
    studentPlan,
}) {
    const actualMap = buildActualModuleMap(semestersData)
    const completed = buildCompletedIdSet(actualMap)

    const officialIds = officialIdsForSemester(universityPlan, semesterNumber)
    const studentIds = studentIdsForSemester(studentPlan, semesterNumber)

    return {
        official: calcProgress(officialIds, completed),
        student: calcProgress(studentIds, completed),
    }
}
