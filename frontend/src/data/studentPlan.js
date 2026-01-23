// src/data/studentPlan.js
// Änderbarer Studienplan (Student Plan) für den Prototyp.
// Der Plan wird clientseitig im Browser in localStorage gespeichert,
// damit man ihn ohne Backend „persistieren“ und später wieder laden kann.

const STORAGE_KEY = 'creditclimb_student_plan'

// Datenmodell / Idee:
// - moduleId: eindeutige Modul-ID (muss mit den IDs in semestersData / universityPlan übereinstimmen)
// - scheduledSemester: in welchem Semester der/die Studierende das Modul einplant
// - status: optional für später (z. B. "planned", "inProgress", "dropped"); für die aktuelle Logik reicht scheduledSemester.
//   Wichtig: "Completed" wird NICHT hier gespeichert, sondern faktisch über grade aus semestersData bestimmt.
export const DEFAULT_STUDENT_PLAN = {
    version: 1,
    updatedAt: "2026-01-18",
    schedule: [
        // ===== Semester 1 =====
        { moduleId: "S1-M1", scheduledSemester: 1 },
        { moduleId: "S1-M2", scheduledSemester: 1 },
        { moduleId: "S1-M3", scheduledSemester: 1 }, // grade null -> Not Completed (S1)
        { moduleId: "S1-M4", scheduledSemester: 1 },
        { moduleId: "S1-M6", scheduledSemester: 1 },

        { moduleId: "S2-M6", scheduledSemester: 1 },

        // ===== Semester 2 =====
        { moduleId: "S2-M1", scheduledSemester: 2 },
        { moduleId: "S2-M2", scheduledSemester: 2 },
        { moduleId: "S2-M3", scheduledSemester: 2 },
        { moduleId: "S2-M4", scheduledSemester: 2 }, // grade null -> Not Completed (S2)
        { moduleId: "S2-M5", scheduledSemester: 2 },

        { moduleId: "S4-M3", scheduledSemester: 2 },

        // ===== Semester 3 =====
        { moduleId: "S3-M1", scheduledSemester: 3 },
        { moduleId: "S3-M3", scheduledSemester: 3 },
        { moduleId: "S3-M4", scheduledSemester: 3 }, // grade null -> Not Completed (S3)
        { moduleId: "S3-M5", scheduledSemester: 3 },
        { moduleId: "S3-M6", scheduledSemester: 3 },
        { moduleId: "S3-M7", scheduledSemester: 3 },

        { moduleId: "S4-M6", scheduledSemester: 3 },

        // ===== Semester 4 =====
        { moduleId: "S4-M1", scheduledSemester: 4 },
        { moduleId: "S4-M2", scheduledSemester: 4 },
        { moduleId: "S4-M4", scheduledSemester: 4 },
        { moduleId: "S4-M5", scheduledSemester: 4 }, // grade null -> Not Completed (S4)

        { moduleId: "S3-M2", scheduledSemester: 4 },

        // ===== Semester 5 =====
        { moduleId: "S5-M1", scheduledSemester: 5 },
        { moduleId: "S5-M2", scheduledSemester: 5 },
        { moduleId: "S5-M3", scheduledSemester: 5 },
        { moduleId: "S5-M4", scheduledSemester: 5 },
        { moduleId: "S5-M5", scheduledSemester: 5 },
        { moduleId: "S5-M6", scheduledSemester: 5 },

        { moduleId: "S1-M5", scheduledSemester: 5 },

        // ===== Semester 6 =====
        { moduleId: "S6-M1", scheduledSemester: 6 },
        { moduleId: "S6-M2", scheduledSemester: 6 },
    ],
}

// Speichert einen Plan in localStorage.
// Dabei wird eine „sichere“ Version erzeugt:
// - version wird fix gesetzt
// - updatedAt wird auf „heute“ gesetzt
// - schedule wird auf ein Array normalisiert
export function loadStudentPlan() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return structuredClone(DEFAULT_STUDENT_PLAN)

        const parsed = JSON.parse(raw)
        if (!parsed || !Array.isArray(parsed.schedule)) {
            return structuredClone(DEFAULT_STUDENT_PLAN)
        }
        return parsed
    } catch {
        return structuredClone(DEFAULT_STUDENT_PLAN)
    }
}

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

export function resetStudentPlan() {
    const fresh = structuredClone(DEFAULT_STUDENT_PLAN)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
    return fresh
}
