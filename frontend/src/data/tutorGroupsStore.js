import { ref, computed } from 'vue'
import { mockStudents } from '@/data/mockStudents'

const groups = ref([
  { id: 'g1', name: 'Mathe Gruppe 1', studentIds: mockStudents.slice(0, 8).map(s => s.id) },
  { id: 'g2', name: 'GDI Gruppe 2', studentIds: mockStudents.slice(8, 16).map(s => s.id) },
])

const selectedGroupId = ref(groups.value[0]?.id ?? null)

export function useTutorGroups() {
  const groupOptions = computed(() => groups.value.map(g => ({ title: g.name, value: g.id })))

  const selectedGroup = computed(() => groups.value.find(g => g.id === selectedGroupId.value) ?? null)

  const selectedStudents = computed(() => {
    const ids = new Set(selectedGroup.value?.studentIds ?? [])
    return mockStudents.filter(s => ids.has(s.id))
  })

  function createGroup(name, studentIds) {
    const id = `g${Date.now()}`
    groups.value = [{ id, name, studentIds: [...studentIds] }, ...groups.value]
    selectedGroupId.value = id
  }

  function setSelectedGroup(id) {
    selectedGroupId.value = id
  }

  return {
    groups,
    selectedGroupId,
    groupOptions,
    selectedGroup,
    selectedStudents,
    createGroup,
    setSelectedGroup,
  }
}
