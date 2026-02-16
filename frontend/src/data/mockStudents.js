const firstNames = [
  'Emma', 'Lukas', 'Maximilian', 'Julia', 'Tobias',
  'Hannah', 'Leon', 'Laura', 'Jonas', 'Sarah',
  'Paul', 'Anna', 'Tim', 'Marie', 'Felix',
]

const lastNames = [
  'Wagner', 'Meyer', 'Braun', 'Neumann', 'Schmitt',
  'Becker', 'Fischer', 'Hoffmann', 'Richter', 'Klein',
  'Schulz', 'Krüger', 'Wolf', 'Zimmermann', 'Hartmann',
]

const universities = ['HTW Dresden', 'TU Dresden']
const years = ['2021', '2022', '2023', '2024']
const faculties = ['Mathematics and Computer Science', 'Engineering']
const programs = ['Media Informatics', 'Informatics']
const groups = ['A', 'B', 'C', 'D']


export const mockStudents = Array.from({ length: 120 }, (_, i) => {
  const first = firstNames[i % firstNames.length]
  const last = lastNames[(i * 7 + Math.floor(i / firstNames.length)) % lastNames.length]

  return {
    id: String(23000 + i).padStart(5, '0'),
    name: `${first} ${last}`,

    // schon vorhanden:
    university: universities[i % universities.length],

    // NEU: Filterfelder
    year: years[i % years.length],
    faculty: faculties[(i * 3) % faculties.length],
    program: programs[(i * 5) % programs.length],
    group: groups[(i * 7) % groups.length],
  }
})