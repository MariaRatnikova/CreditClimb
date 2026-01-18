// src/data/studentPlan.js
// Änderbarer Studienplan (Student Plan) für den Prototyp.
// Der Plan wird clientseitig im Browser in localStorage gespeichert,
// damit man ihn ohne Backend „persistieren“ und später wieder laden kann.

const STORAGE_KEY = "creditclimb.studentPlan.v1"

// Datenmodell / Idee:
// - moduleId: eindeutige Modul-ID (muss mit den IDs in semestersData / universityPlan übereinstimmen)
// - scheduledSemester: in welchem Semester der/die Studierende das Modul einplant
// - status: optional für später (z. B. "planned", "inProgress", "dropped"); für die aktuelle Logik reicht scheduledSemester.
//   Wichtig: "Completed" wird NICHT hier gespeichert, sondern faktisch über grade aus semestersData bestimmt.
export const DEFAULT_STUDENT_PLAN = {
    version: 1,
    updatedAt: "2026-01-18",
    schedule: [
        // Default: Student-Plan entspricht dem offiziellen Uni-Plan (alles „normal“ einsortiert)

        // Semester 1
        { moduleId: "S1-M1", scheduledSemester: 1 },
        { moduleId: "S1-M2", scheduledSemester: 1 },
        { moduleId: "S1-M3", scheduledSemester: 1 },
        { moduleId: "S1-M4", scheduledSemester: 1 },
        { moduleId: "S1-M5", scheduledSemester: 1 },

        // Semester 2
        { moduleId: "S2-M1", scheduledSemester: 2 },
        { moduleId: "S2-M2", scheduledSemester: 2 },
        { moduleId: "S2-M3", scheduledSemester: 2 },
        { moduleId: "S2-M4", scheduledSemester: 2 },
        { moduleId: "S2-M5", scheduledSemester: 2 },
        { moduleId: "S2-M6", scheduledSemester: 2 },

        // Semester 3
        { moduleId: "S3-M1", scheduledSemester: 3 },
        { moduleId: "S3-M2", scheduledSemester: 3 },
        { moduleId: "S3-M3", scheduledSemester: 3 },
        { moduleId: "S3-M4", scheduledSemester: 3 },
        { moduleId: "S3-M5", scheduledSemester: 3 },
        { moduleId: "S3-M6", scheduledSemester: 3 },

        // Semester 4
        { moduleId: "S4-M1", scheduledSemester: 4 },
        { moduleId: "S4-M2", scheduledSemester: 4 },
        { moduleId: "S4-M3", scheduledSemester: 4 },
        { moduleId: "S4-M4", scheduledSemester: 4 },
        { moduleId: "S4-M5", scheduledSemester: 4 },
        { moduleId: "S4-M6", scheduledSemester: 4 },

        // Semester 5
        { moduleId: "S5-M1", scheduledSemester: 5 },
        { moduleId: "S5-M2", scheduledSemester: 5 },
        { moduleId: "S5-M3", scheduledSemester: 5 },
        { moduleId: "S5-M4", scheduledSemester: 5 },
        { moduleId: "S5-M5", scheduledSemester: 5 },
        { moduleId: "S5-M6", scheduledSemester: 5 },

        // Semester 6
        { moduleId: "S6-M1", scheduledSemester: 6 },
        { moduleId: "S6-M2", scheduledSemester: 6 },
        { moduleId: "S6-M3", scheduledSemester: 6 },
        { moduleId: "S6-M4", scheduledSemester: 6 },
        { moduleId: "S6-M5", scheduledSemester: 6 },
        { moduleId: "S6-M6", scheduledSemester: 6 },

        // Beispiel für „Rescheduling“ im Prototyp:
        // Der/die Studierende möchte ein Modul aus Semester 1 erst in Semester 5 machen.
        // Hinweis: Im echten Plan würdest du den alten Eintrag entfernen oder überschreiben,
        // damit es die ID nicht doppelt gibt.
        // { moduleId: "S1-M5", scheduledSemester: 5 },
    ],
}

// Lädt den Student-Plan aus localStorage.
// Falls dort nichts gespeichert ist oder JSON kaputt ist, wird der DEFAULT-Plan verwendet.
export function loadStudentPlan() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        // Noch nichts gespeichert -> Default zurückgeben (Clone, damit man ihn mutieren kann)
        if (!raw) return structuredClone(DEFAULT_STUDENT_PLAN)

        const parsed = JSON.parse(raw)

        // Minimale Validierung gegen „Müll“: schedule muss ein Array sein
        if (!parsed || !Array.isArray(parsed.schedule)) {
            return structuredClone(DEFAULT_STUDENT_PLAN)
        }

        // OK -> gespeicherten Plan zurückgeben
        return parsed
    } catch (e) {
        // JSON-Parse-Fehler oder andere Probleme -> Default zurückgeben
        return structuredClone(DEFAULT_STUDENT_PLAN)
    }
}

// Speichert einen Plan in localStorage.
// Dabei wird eine „sichere“ Version erzeugt:
// - version wird fix gesetzt
// - updatedAt wird auf „heute“ gesetzt
// - schedule wird auf ein Array normalisiert
export function saveStudentPlan(plan) {
    const safe = {
        ...(plan ?? {}),
        version: 1,
        updatedAt: new Date().toISOString().slice(0, 10),
        schedule: Array.isArray(plan?.schedule) ? plan.schedule : [],
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(safe))
    return safe
}

// Komfort-Funktion: setzt den gespeicherten Plan wieder auf DEFAULT zurück.
export function resetStudentPlan() {
    const fresh = structuredClone(DEFAULT_STUDENT_PLAN)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
    return fresh
}
