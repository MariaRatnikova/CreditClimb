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

export const mockStudents = Array.from({ length: 120 }, (_, i) => {
  const first = firstNames[i % firstNames.length]

  const last =
    lastNames[(i * 7 + Math.floor(i / firstNames.length)) % lastNames.length]

  return {
    id: String(23000 + i).padStart(5, '0'),
    name: `${first} ${last}`,
    university: universities[i % universities.length],
  }
})
