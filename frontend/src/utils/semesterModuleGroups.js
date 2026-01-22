// src/utils/semesterModuleGroups.js
// Hilfsfunktionen zum Gruppieren von Modulen für die Semester-Übersicht (Semester X).
// Grundlage für die Zuordnung:
// - studentPlan: Welche Module sind vom Studenten in Semester X eingeplant?
// - universityPlan: In welchem Semester ist ein Modul offiziell vorgesehen? (Soll-Semester)
// - semestersData: Enthält „Ist“-Daten wie grade/attempt usw. (falls vorhanden)
//
// Ergebnis-Gruppen (nur für Semester X):
// - completed: Module, die im Student-Plan in Semester X stehen UND eine Note haben
// - notCompleted: Module, die im Student-Plan in Semester X stehen UND keine Note haben
// - rescheduled: Module, die im Student-Plan in Semester X stehen, keine Note haben,
//                aber deren offizielles Semester (universityPlan) ungleich X ist

// Prüft, ob ein Modul als „abgeschlossen“ gilt.
// In eurem Modell bedeutet „abgeschlossen“: grade ist weder null noch undefined.
function hasGrade(m) {
    return m?.grade !== null && m?.grade !== undefined
}

// Baut eine Map aus den Ist-Daten:
// moduleId -> Modulobjekt aus semestersData (kann grade, attempt usw. enthalten)
function buildActualModuleMap(semestersData = []) {
    const map = new Map()
    for (const sem of semestersData ?? []) {
        for (const m of sem?.modules ?? []) {
            map.set(m.id, m)
        }
    }
    return map
}

// Baut eine Map aus dem offiziellen Plan (Soll-Daten):
// moduleId -> { module: Modulobjekt, officialSemester: Zahl }
// Hinweis: officialSemester wird aus dem Semester-Container im universityPlan übernommen.
function buildOfficialModuleMap(universityPlan = []) {
    const map = new Map()
    for (const sem of universityPlan ?? []) {
        const semNr = Number(sem?.semester)
        for (const m of sem?.modules ?? []) {
            map.set(m.id, { module: m, officialSemester: semNr })
        }
    }
    return map
}

// Liefert die Modul-IDs, die der Student in einem bestimmten Semester eingeplant hat.
// Quelle: studentPlan.schedule (moduleId + scheduledSemester)
function studentPlannedIdsForSemester(studentPlan, semesterNumber) {
    return (studentPlan?.schedule ?? [])
        .filter(x => Number(x.scheduledSemester) === Number(semesterNumber))
        .map(x => x.moduleId)
}

// Baut das Modulobjekt, das an ModuleCard übergeben wird.
// Priorität der Datenquellen:
// 1) semestersData (Ist) → enthält ggf. grade/attempt
// 2) universityPlan (Soll) → enthält mindestens name/credits usw., grade wird auf null gesetzt
// 3) Fallback → Dummy-Daten, falls die ID nirgendwo gefunden wird
function resolveModuleForCard(id, actualMap, officialMap) {
    const actual = actualMap.get(id)
    if (actual) return { ...actual }

    const officialEntry = officialMap.get(id)
    if (officialEntry?.module) {
        return { ...officialEntry.module, grade: null }
    }

    return { id, name: `Module ${id}`, credits: 0, attempt: 1, grade: null }
}

/**
 * Gruppiert Module für die Semesterübersicht (nur Semester X).
 * Wichtig: Alle drei Gruppen beziehen sich ausschließlich auf Module,
 * die der Student in Semester X eingeplant hat (studentPlan).
 */
export function buildSemesterModuleGroups({
    semesterNumber,
    semestersData,
    universityPlan,
    studentPlan,
}) {
    // Maps vorbereiten für schnellen Zugriff per moduleId
    const actualMap = buildActualModuleMap(semestersData)
    const officialMap = buildOfficialModuleMap(universityPlan)

    // Welche Module sind vom Studenten in Semester X geplant?
    const plannedIds = studentPlannedIdsForSemester(studentPlan, semesterNumber)

    // Ergebnislisten
    const completed = []
    const notCompleted = []
    const rescheduled = []

    for (const id of plannedIds) {
        // Modul-Daten für die Darstellung in der ModuleCard zusammenstellen
        const moduleForCard = resolveModuleForCard(id, actualMap, officialMap)

        // Offizielles Semester (Soll-Semester) aus dem universityPlan ermitteln
        const officialSemester = officialMap.get(id)?.officialSemester ?? null

        // Das offizielle Semester wird als "semester" mitgegeben,
        // damit ModuleCard es optional anzeigen kann (z. B. bei Rescheduled)
        const withOfficialSemester = { ...moduleForCard, semester: officialSemester }

        // 1) Completed: Modul hat eine Note und ist im Student-Plan in Semester X eingeplant
        if (hasGrade(withOfficialSemester)) {
            completed.push(withOfficialSemester)
            continue
        }

        // 2/3) Ohne Note -> Not Completed oder Rescheduled unterscheiden
        // Rescheduled bedeutet: offizielles Semester existiert und ist ungleich dem aktuellen Semester X.
        const isRescheduled =
            officialSemester !== null && Number(officialSemester) !== Number(semesterNumber)

        if (isRescheduled) rescheduled.push(withOfficialSemester)
        else notCompleted.push(withOfficialSemester)
    }

    // Rückgabe der drei Gruppen für die UI
    return { completed, notCompleted, rescheduled }
}
