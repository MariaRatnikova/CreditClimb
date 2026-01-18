
// src/data/universityPlan.js
// Statischer Studienplan der Hochschule (Official Plan).
// Dieser Plan ist „read-only“: Er verändert sich im Prototyp nicht und dient als Referenz.
//
// Wichtige Idee für eure Logik:
// - plannedSemester = offizielles Semester laut Studienordnung (Soll-Zuordnung)
// - studentPlan (aus localStorage) kann Module in andere Semester verschieben (Ist-Planung)
// - semestersData enthält später ggf. den „Ist“-Status (z. B. grade) pro Modul.

export const universityPlan = [
    // ---------------- Semester 1 ----------------
    {
        // Offizielle Semester-Nummer
        semester: 1,

        // Optionaler Titel für UI-Anzeigen
        title: "1st Semester",

        // Geplante Gesamt-ECTS im offiziellen Plan
        totalCreditsPlanned: 30,

        // Module, die laut Studienordnung in Semester 1 vorgesehen sind
        modules: [
            {
                id: "S1-M1", // Eindeutige Modul-ID (muss mit semestersData/studentPlan übereinstimmen)
                name: "Introduction to Programming",
                credits: 2,
                plannedSemester: 1, // Offizielles Soll-Semester
                professor: "Prof. Anna Keller",
                examType: "Written exam",
            },
            {
                id: "S1-M2",
                name: "Discrete Mathematics",
                credits: 4,
                plannedSemester: 1,
                professor: "Prof. Martin Vogel",
                examType: "Written exam",
            },
            {
                id: "S1-M3",
                name: "Computer Systems Fundamentals",
                credits: 3,
                plannedSemester: 1,
                professor: "Prof. Lena Schubert",
                examType: "Written exam",
            },
            {
                id: "S1-M4",
                name: "Web Technologies Basics",
                credits: 5,
                plannedSemester: 1,
                professor: "Prof. Daniel Weiss",
                examType: "Project",
            },
            {
                id: "S1-M5",
                name: "Linear Algebra for Computing",
                credits: 5,
                plannedSemester: 1,
                professor: "Prof. Sofia Brandt",
                examType: "Written exam",
            },
            {
                id: "S1-M6",
                name: "Study Skills & Scientific Writing",
                credits: 3,
                plannedSemester: 1,
                professor: "Prof. Julia Hartmann",
                examType: "Portfolio",
            },
        ],
    },

    // ---------------- Semester 2 ----------------
    {
        semester: 2,
        title: "2nd Semester",
        totalCreditsPlanned: 30,
        // Module, die laut Studienordnung in Semester 2 vorgesehen sind
        modules: [
            {
                id: "S2-M1",
                name: "Object-Oriented Programming",
                credits: 6,
                plannedSemester: 2,
                professor: "Prof. Anna Keller",
                examType: "Project + oral exam",
            },
            {
                id: "S2-M2",
                name: "Data Structures & Algorithms I",
                credits: 6,
                plannedSemester: 2,
                professor: "Prof. Simon Krüger",
                examType: "Written exam",
            },
            {
                id: "S2-M3",
                name: "Database Fundamentals",
                credits: 5,
                plannedSemester: 2,
                professor: "Prof. Miriam Lange",
                examType: "Written exam",
            },
            {
                id: "S2-M4",
                name: "Computer Networks Basics",
                credits: 5,
                plannedSemester: 2,
                professor: "Prof. Jonas Richter",
                examType: "Written exam",
            },
            {
                id: "S2-M5",
                name: "Human-Computer Interaction Basics",
                credits: 5,
                plannedSemester: 2,
                professor: "Prof. Nora Engel",
                examType: "Project",
            },
            {
                id: "S2-M6",
                name: "Probability & Statistics for CS",
                credits: 3,
                plannedSemester: 2,
                professor: "Prof. Sofia Brandt",
                examType: "Written exam",
            },
        ],
    },

    // ---------------- Semester 3 ----------------
    {
        semester: 3,
        title: "3rd Semester",
        totalCreditsPlanned: 30,
        // Module, die laut Studienordnung in Semester 3 vorgesehen sind
        modules: [
            {
                id: "S3-M1",
                name: "Operating Systems",
                credits: 6,
                plannedSemester: 3,
                professor: "Prof. Tobias Neumann",
                examType: "Written exam",
            },
            {
                id: "S3-M2",
                name: "Software Engineering Fundamentals",
                credits: 6,
                plannedSemester: 3,
                professor: "Prof. Claudia Stein",
                examType: "Project",
            },
            {
                id: "S3-M3",
                name: "Data Structures & Algorithms II",
                credits: 5,
                plannedSemester: 3,
                professor: "Prof. Simon Krüger",
                examType: "Written exam",
            },
            {
                id: "S3-M4",
                name: "Computer Architecture",
                credits: 5,
                plannedSemester: 3,
                professor: "Prof. Felix Braun",
                examType: "Written exam",
            },
            {
                id: "S3-M5",
                name: "UI Design & Prototyping",
                credits: 5,
                plannedSemester: 3,
                professor: "Prof. Nora Engel",
                examType: "Portfolio",
            },
            {
                id: "S3-M6",
                name: "IT Security Basics",
                credits: 3,
                plannedSemester: 3,
                professor: "Prof. Erik Sommer",
                examType: "Written exam",
            },
        ],
    },

    // ---------------- Semester 4 ----------------
    {
        semester: 4,
        title: "4th Semester",
        totalCreditsPlanned: 30,
        // Module, die laut Studienordnung in Semester 4 vorgesehen sind
        modules: [
            {
                id: "S4-M1",
                name: "Web Application Development",
                credits: 6,
                plannedSemester: 4,
                professor: "Prof. Daniel Weiss",
                examType: "Project",
            },
            {
                id: "S4-M2",
                name: "Advanced Databases",
                credits: 6,
                plannedSemester: 4,
                professor: "Prof. Miriam Lange",
                examType: "Written exam",
            },
            {
                id: "S4-M3",
                name: "Computer Networks & Protocols",
                credits: 2,
                plannedSemester: 4,
                professor: "Prof. Jonas Richter",
                examType: "Written exam",
            },
            {
                id: "S4-M4",
                name: "Mobile App Development",
                credits: 5,
                plannedSemester: 4,
                professor: "Prof. Claudia Stein",
                examType: "Project",
            },
            {
                id: "S4-M5",
                name: "Computer Graphics Fundamentals",
                credits: 3,
                plannedSemester: 4,
                professor: "Prof. Petra König",
                examType: "Project + presentation",
            },
            {
                id: "S4-M6",
                name: "Research Methods in Computing",
                credits: 3,
                plannedSemester: 4,
                professor: "Prof. Julia Hartmann",
                examType: "Portfolio",
            },
        ],
    },

    // ---------------- Semester 5 ----------------
    {
        semester: 5,
        title: "5th Semester",
        totalCreditsPlanned: 30,
        // Module, die laut Studienordnung in Semester 5 vorgesehen sind
        modules: [
            {
                id: "S5-M1",
                name: "UX Research & Testing",
                credits: 6,
                plannedSemester: 5,
                professor: "Prof. Nora Engel",
                examType: "Portfolio",
                // Optional: Deadlines für UI (Kalender/Reminder) – reine Plan-Daten (nicht „Ist“-Status)
                deadlines: [
                    { name: "Usability test plan submission", date: "2026-03-20" },
                    { name: "Final report upload", date: "2026-06-18" },
                ],
            },
            {
                id: "S5-M2",
                name: "Frontend Engineering (Vue)",
                credits: 6,
                plannedSemester: 5,
                professor: "Prof. Daniel Weiss",
                examType: "Project",
                deadlines: [
                    { name: "Midterm prototype", date: "2026-04-10" },
                    { name: "Project demo & hand-in", date: "2026-06-25" },
                ],
            },
            {
                id: "S5-M3",
                name: "Cloud Computing Basics",
                credits: 5,
                plannedSemester: 5,
                professor: "Prof. Tobias Neumann",
                examType: "Written exam",
                deadlines: [
                    { name: "Lab 1 submission", date: "2026-03-28" },
                    { name: "Lab 2 submission", date: "2026-05-16" },
                ],
            },
            {
                id: "S5-M4",
                name: "Information Security ",
                credits: 5,
                plannedSemester: 5,
                professor: "Prof. Erik Sommer",
                examType: "Written exam",
                deadlines: [
                    { name: "Threat model worksheet", date: "2026-04-05" },
                    { name: "Revision quiz deadline", date: "2026-06-05" },
                ],
            },
            {
                id: "S5-M5",
                name: "Interactive Media Systems",
                credits: 5,
                plannedSemester: 5,
                professor: "Prof. Petra König",
                examType: "Project + presentation",
                deadlines: [
                    { name: "Concept pitch", date: "2026-03-15" },
                    { name: "Final presentation", date: "2026-06-20" },
                ],
            },
            {
                id: "S5-M6",
                name: "Data Visualization",
                credits: 3,
                plannedSemester: 5,
                professor: "Prof. Martin Vogel",
                examType: "Project",
                deadlines: [
                    { name: "Dataset selection", date: "2026-03-12" },
                    { name: "Visualization hand-in", date: "2026-06-12" },
                ],
            },
        ],
    },

    // ---------------- Semester 6 ----------------
    {
        semester: 6,
        title: "6th Semester",
        totalCreditsPlanned: 30,
        // Module, die laut Studienordnung in Semester 6 vorgesehen sind
        modules: [
            {
                id: "S6-M1",
                name: "Internship / Practical Project",
                credits: 12,
                plannedSemester: 6,
                professor: "Prof. Claudia Stein",
                examType: "Report + presentation",
            },
            {
                id: "S6-M2",
                name: "Bachelor Seminar",
                credits: 5,
                plannedSemester: 6,
                professor: "Prof. Julia Hartmann",
                examType: "Presentation",
            },
            {
                id: "S6-M3",
                name: "Advanced HCI (Multimodal Interaction)",
                credits: 5,
                plannedSemester: 6,
                professor: "Prof. Nora Engel",
                examType: "Project",
            },
            {
                id: "S6-M4",
                name: "Software Architecture",
                credits: 4,
                plannedSemester: 6,
                professor: "Prof. Tobias Neumann",
                examType: "Written exam",
            },
            {
                id: "S6-M5",
                name: "Data Engineering Basics",
                credits: 4,
                plannedSemester: 6,
                professor: "Prof. Miriam Lange",
                examType: "Project",
            },
            {
                id: "S6-M6",
                name: "Elective: Game Development",
                credits: 3,
                plannedSemester: 6,
                professor: "Prof. Petra König",
                examType: "Project",
            },
        ],
    },
]
