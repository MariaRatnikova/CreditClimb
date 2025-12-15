<script setup>
    import { computed, reactive, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import MobileShell from '@/components/layout/MobileShell.vue'
    import StudentListItem from '@/components/common/StudentListItem.vue'
    import { mockStudents } from '@/data/mockStudents'

    const router = useRouter()

    const query = ref('')
    const filters = reactive({
    university: null,
    year: null,
    faculty: null,
    program: null,
    group: null,
    })

    // Dropdown-Items (Mock)
    const universities = ['HTW Dresden', 'TU Dresden']
    const years = ['2021', '2022', '2023', '2024']
    const faculties = ['Mathematics and Computer Science', 'Engineering']
    const programs = ['Media Informatics', 'Informatics']
    const groups = ['A', 'B', 'C', 'D']

    const filtered = computed(() => {
    const q = query.value.trim().toLowerCase()

    return mockStudents.filter((s) => {
        const matchQuery =
        !q || s.name.toLowerCase().includes(q) || s.id.includes(q)

        // Filter sind erstmal UI-only (wir nutzen sie später real, wenn Daten vorhanden sind)
        return matchQuery
    })
    })

    function openStudent(student) {
    router.push(`/bafoeg/student/${student.id}`)
    }
</script>

<template>
  <MobileShell base="/bafoeg" title="Search Student">
    <!-- Searchbar -->
    <v-text-field
      v-model="query"
      label="Student ID or Name"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      density="compact"
      hide-details
    />

    <!-- Advanced search -->
    <div class="text-subtitle-2 mt-4 mb-2">Advanced search</div>

    <v-select v-model="filters.university" :items="universities" label="University"
              variant="outlined" density="compact" hide-details class="mb-2" />
    <v-select v-model="filters.year" :items="years" label="Year of study"
              variant="outlined" density="compact" hide-details class="mb-2" />
    <v-select v-model="filters.faculty" :items="faculties" label="Faculty"
              variant="outlined" density="compact" hide-details class="mb-2" />
    <v-select v-model="filters.program" :items="programs" label="Study program"
              variant="outlined" density="compact" hide-details class="mb-2" />
    <v-select v-model="filters.group" :items="groups" label="Group number"
              variant="outlined" density="compact" hide-details class="mb-4" />

    <!-- Result list -->
    <div class="text-subtitle-2 mb-2">Results</div>

    <div v-if="filtered.length === 0" class="text-body-2">
      No students found.
    </div>

    <StudentListItem
      v-for="s in filtered"
      :key="s.id"
      :student="s"
      @select="openStudent"
    />

    <!-- Pagination (UI-only placeholder like Figma) -->
    <div class="d-flex justify-center mt-3">
      <v-btn size="small" variant="text">1</v-btn>
      <v-btn size="small" variant="text">2</v-btn>
      <v-btn size="small" variant="text">3</v-btn>
      <span class="px-2">…</span>
      <v-btn size="small" variant="text">67</v-btn>
      <v-btn size="small" variant="text">68</v-btn>
    </div>
  </MobileShell>
</template>
