// Aktuelles Semester (Mock)
export const APP_DEFAULTS = {
    currentSemester: 5,
    creditsPerSemester: 30,
    defaultTargetGrade: 1.7,
}

export const semestersData = [
    {
        semester: 1,
        title: "1st Semester",
        totalCreditsPlanned: 30,
        modules: [
            { id: "S1-M1", name: "Programmierung I", attempt: 1, grade: 2.3, credits: 5, professor: "Prof. Beck", examType: "Written exam" },
            { id: "S1-M2", name: "Mathematik I", attempt: 1, grade: 2.0, credits: 7, professor: "Prof. Schwarzenberger", examType: "Written exam" },
            { id: "S1-M3", name: "Grundlagen der Informatik I", attempt: 1, grade: null, credits: 5, professor: "Prof. Hollas", examType: "Written exam" },
            { id: "S1-M4", name: "Betriebssysteme I", attempt: 1, grade: 1.7, credits: 5, professor: "Prof. Baumgartl", examType: "Written exam" },
            { id: "S1-M6", name: "Englisch B2 I", attempt: 1, grade: 1.3, credits: 3, professor: "Prof. Wadencreme", examType: "Written exam + Presentation" },
            { id: "S2-M6", name: "Englisch B2 II", attempt: 1, grade: null, credits: 3, professor: "Prof. Wadencreme", examType: "Written exam + Presentation" },
        ],
    },
    {
        semester: 2,
        title: "2nd Semester",
        totalCreditsPlanned: 30,
        modules: [
            { id: "S2-M1", name: "Programmierung II", attempt: 1, grade: 2.0, credits: 5, professor: "Prof. Beck", examType: "Project + Written exam" },
            { id: "S2-M2", name: "Theoretische Informatik", attempt: 1, grade: 2.3, credits: 5, professor: "Prof. Hollas", examType: "Written exam" },
            { id: "S2-M3", name: "Datenbanksysteme I", attempt: 1, grade: 2.7, credits: 5, professor: "Prof. Toll", examType: "Written exam" },
            { id: "S2-M4", name: "Mathematik II", attempt: 1, grade: null, credits: 8, professor: "Prof. Schwarzenberger", examType: "Written exam" },
            { id: "S2-M5", name: "Informationssicherheit und Datenschutz", attempt: 1, grade: 1.7, credits: 5, professor: "Prof. Iffländer", examType: "Project" },
            { id: "S1-M5", name: "Elektrotechnik für Informatiker", attempt: 1, grade: null, credits: 5, professor: "Prof. Engelbrecht", examType: "Written exam" },
        ],
    },
    {
        semester: 3,
        title: "3rd Semester",
        totalCreditsPlanned: 30,
        modules: [
            { id: "S3-M1", name: "Rechnerarchitektur", attempt: 1, grade: 2.7, credits: 3, professor: "Prof. Schönthier", examType: "Written exam" },
            { id: "S3-M3", name: "Compiler / Interpreter", attempt: 1, grade: 2.0, credits: 5, professor: "Prof. Beck", examType: "Written exam" },
            { id: "S3-M4", name: "Informatikrecht", attempt: 1, grade: null, credits: 2, professor: "Prof. Westfeld", examType: "Written exam" },
            { id: "S3-M5", name: "Stochastik", attempt: 1, grade: 1.7, credits: 5, professor: "Prof. Schwarzenberger", examType: "Portfolio" },
            { id: "S3-M6", name: "Rechnernetze/ Kommunikationssysteme", attempt: 1, grade: 2.3, credits: 5, professor: "Prof. Vogt", examType: "Written exam" },
            { id: "S3-M7", name: "Computergrafik I", attempt: 1, grade: 2.3, credits: 5, professor: "Prof. Block-Berlitz", examType: "Written exam" },
            { id: "S4-M6", name: "Programmierung von Microcontrollern", attempt: 1, grade: null, credits: 5, professor: "Prof. Vogt", examType: "Portfolio" },
        ],
    },
    {
        semester: 4,
        title: "4th Semester",
        totalCreditsPlanned: 30,
        modules: [
            { id: "S4-M1", name: "Software Engineering I", attempt: 1, grade: 2.0, credits: 5, professor: "Prof. Anke", examType: "Project" },
            { id: "S4-M2", name: "Webprogrammierung", attempt: 1, grade: 2.7, credits: 5, professor: "Prof. Vogt", examType: "Written exam" },
            { id: "S4-M3", name: "Betriebssysteme II", attempt: 1, grade: null, credits: 5, professor: "Prof. Baumgartl", examType: "Written exam" },
            { id: "S4-M4", name: "Programmierung von Komponentenarchitekturen", attempt: 1, grade: 1.7, credits: 5, professor: "Prof. Neugebauer", examType: "Project" },
            { id: "S4-M5", name: "Künstliche Intelligenz", attempt: 1, grade: null, credits: 5, professor: "Prof. Hollas", examType: "Project + presentation" },
            { id: "S3-M2", name: "Datenbanksysteme II", attempt: 1, grade: null, credits: 5, professor: "Prof. Toll", examType: "Project" },
        ],
    },
    {
        semester: 5,
        title: "5th Semester",
        totalCreditsPlanned: 30,
        modules: [
            { id: "S5-M1", name: "Internettechnologien für zeitkritische Anwendungen", attempt: 1, grade: null, credits: 5, professor: "Prof. Vogt",examType: "Portfolio",
                deadlines: [
                    { name: "Usability test plan submission", date: "2026-03-20" },
                    { name: "Final report upload", date: "2026-06-18" },
                ],
            },
            { id: "S5-M2", name: "Programmierung von Benutzeroberflächen", attempt: 1, grade: null, credits: 5, professor: "Prof. Freitag", examType: "Project",
                deadlines: [
                    { name: "Midterm prototype", date: "2026-04-10" },
                    { name: "Project demo & hand-in", date: "2026-06-25" },
                ],
            },
            { id: "S5-M3", name: "Neuroinformationsverarbeitung", attempt: 1, grade: null, credits: 5, professor: "Prof. Böhme", examType: "Written exam",
                deadlines: [
                    { name: "Lab 1 submission", date: "2026-03-28" },
                    { name: "Lab 2 submission", date: "2026-05-16" },
                ],
            },
            { id: "S5-M4", name: "Projektseminar", attempt: 1, grade: null, credits: 5, professor: "Prof. ?", examType: "Written exam",
                deadlines: [
                    { name: "Threat model worksheet", date: "2026-04-05" },
                    { name: "Revision quiz deadline", date: "2026-06-05" },
                ],
            },
            { id: "S5-M5", name: "Angewandte Sensorik", attempt: 1, grade: null, credits: 5, professor: "Prof. Rennekamp", examType: "Project + presentation",
                deadlines: [
                    { name: "Concept pitch", date: "2026-03-15" },
                    { name: "Final presentation", date: "2026-06-20" },
                ],
            },
            { id: "S5-M6", name: "Software Engineering II", attempt: 1, grade: null, credits: 5, professor: "Prof. Anke", examType: "Project",
                deadlines: [
                    { name: "Dataset selection", date: "2026-03-12" },
                    { name: "Visualization hand-in", date: "2026-06-12" },
                ],
            },
        ],
    },
    {
        semester: 6,
        title: "6th Semester",
        totalCreditsPlanned: 30,
        modules: [
            { id: "S6-M1", name: "Praxisprojekt", attempt: 1, grade: null, credits: 18, professor: "Prof. ?", examType: "Report + presentation",},
            { id: "S6-M2", name: "Bachelorarbeit", attempt: 1, grade: null, credits: 12, professor: "Prof. ?", examType: "Presentation",},
        ],
    },
]
