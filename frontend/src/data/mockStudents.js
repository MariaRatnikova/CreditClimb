const names = [
  'Emma Wagner','Lukas Meyer','Maximilian Braun','Julia Neumann','Tobias Schmitt',
  'Hannah Becker','Leon Fischer','Laura Hoffmann','Jonas Richter','Sarah Klein',
]

const universities = ['HTW Dresden', 'TU Dresden']

export const mockStudents = Array.from({ length: 120 }, (_, i) => ({
  id: String(230000 + i),
  name: names[i % names.length],
  university: universities[i % universities.length],
}))
