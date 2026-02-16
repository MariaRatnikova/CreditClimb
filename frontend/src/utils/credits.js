// src/utils/credits.js
// Hilfsfunktionen für ECTS/Kredite pro Semester + SVG-Liniendiagramm zum Vergleich der Semester.
// Ziel:
// 1) ECTS pro Semester berechnen (nur Module mit Note zählen)
// 2) Chart-Daten erzeugen, um Semester miteinander zu vergleichen (z. B. 25 vs. 31 ECTS)

// ------------------------------------------------------------
// Ein Modul zählt nur dann als "erreicht", wenn eine Note existiert
// (grade != null/undefined). Genau so machst du es in deinen Screens.
// ------------------------------------------------------------
function hasGrade(mod) {
    return mod?.grade !== null && mod?.grade !== undefined
}

// ------------------------------------------------------------
// ECTS in einem Semester berechnen (nur benotete Module)
// Beispiel:
// Semester 1: zwei benotete Module (10 + 15) und eins ohne Note → Ergebnis: 25
// ------------------------------------------------------------
export function calcEarnedCreditsForSemester(semester) {
    const modules = semester?.modules ?? []

    return modules.reduce((sum, m) => {
        // Credits zählen nur, wenn Modul eine Note hat
        if (!hasGrade(m)) return sum
        return sum + Number(m.credits ?? 0)
    }, 0)
}

// ------------------------------------------------------------
// ECTS für ALLE Semester berechnen: [{ semester: 1, credits: 25 }, ...]
// - Nimmt die Testdaten (semestersData) oder ein beliebiges Semester-Array
// - Sortiert nach Semester (1..n), damit der Chart logisch ist
// ------------------------------------------------------------
export function calcCreditsPerSemester(semesters = []) {
    return [...(semesters ?? [])]
        .sort((a, b) => Number(a?.semester ?? 0) - Number(b?.semester ?? 0))
        .map(sem => ({
            semester: Number(sem?.semester ?? 0),
            credits: calcEarnedCreditsForSemester(sem),
        }))
}

// ------------------------------------------------------------
// Line-Chart-Daten für SVG (Vergleich: ECTS pro Semester)
// Rückgabe:
// - points: [{ x, y, value, label }] → für <text> Labels oder Debug
// - pointsAttr: "x1,y1 x2,y2 ..." → direkt für <polyline :points="...">
// - pathD: "M x y L x y ..." → Alternative für <path :d="...">
// - min/max: Skalierungshilfe
//
// Hinweis zur Y-Achse:
// SVG: y=0 ist oben. Daher wird die Skala invertiert (max → oben).
// ------------------------------------------------------------
export function buildEctsComparisonChart(semesters = [], opts = {}) {
    const width = opts.width ?? 320
    const height = opts.height ?? 140
    const padding = opts.padding ?? 18

    // 1) Daten pro Semester (z. B. [{semester:1, credits:25}, ...])
    const data = calcCreditsPerSemester(semesters)

    if (data.length === 0) {
        return { points: [], pointsAttr: '', pathD: '', min: null, max: null }
    }

    // Werte (ECTS) + Labels (Semester)
    const values = data.map(d => d.credits)
    const labels = data.map(d => String(d.semester))

    // 2) Skalierung: min=0, max = Maximum der Semester-ECTS (mind. 1)
    const min = 0
    const max = Math.max(...values, 1)
    const range = (max - min) || 1

    const innerW = width - padding * 2
    const innerH = height - padding * 2

    // X gleichmäßig verteilen
    const n = values.length
    const stepX = n === 1 ? 0 : innerW / (n - 1)

    // 3) Punkte berechnen
    const points = values.map((v, i) => {
        const x = padding + i * stepX

        // y invertiert: hoher Wert → weiter oben
        const t = (v - min) / range
        const y = padding + innerH - t * innerH

        return {
            x: Math.round(x * 100) / 100,
            y: Math.round(y * 100) / 100,
            value: v,
            label: labels[i],
        }
    })

    // 4) Strings für SVG
    const pointsAttr = points.map(p => `${p.x},${p.y}`).join(' ')
    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

    return { points, pointsAttr, pathD, min, max }
}
