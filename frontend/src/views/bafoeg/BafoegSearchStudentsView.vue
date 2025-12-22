<script setup>
import { computed, reactive, ref, watch } from 'vue'
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

/** Pagination state */
const page = ref(1)
const pageSize = ref(6)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()

  return mockStudents.filter((s) => {
    const matchQuery = !q || s.name.toLowerCase().includes(q) || s.id.includes(q)
    // Filter aktuell UI-only
    return matchQuery
  })
})

watch(
  () => [query.value, filters.university, filters.year, filters.faculty, filters.program, filters.group],
  () => {
    page.value = 1
  }
)

const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)))

const pagedStudents = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

function setPage(newPage) {
  const safe = Math.min(Math.max(Number(newPage), 1), pageCount.value)
  page.value = safe
}

/** Jump-to-page input: opened by clicking "…" */
const isPageInput = ref(false)
const pageInput = ref('')

function toggleJumpInput() {
  // Toggle Verhalten: erneuter Klick schließt
  if (isPageInput.value) {
    isPageInput.value = false
    return
  }
  pageInput.value = String(page.value)
  isPageInput.value = true
}

function confirmPageInput() {
  const raw = String(pageInput.value ?? '').trim()
  if (raw.length === 0) {
    isPageInput.value = false
    return
  }

  const parsed = parseInt(raw, 10)
  if (!Number.isNaN(parsed)) setPage(parsed)

  isPageInput.value = false
}

function cancelJumpInput() {
  isPageInput.value = false
}

/**
 * Paging model (stable):
 * <  a  b  c  …  last  >
 */
const pagingModel = computed(() => {
  const last = pageCount.value
  const current = page.value

  if (last <= 4) {
    return {
      trio: Array.from({ length: last }, (_, i) => i + 1),
      showEllipsis: false,
      showLast: false,
      last,
    }
  }

  let a = current - 1
  let b = current
  let c = current + 1

  // Start case
  if (current <= 1) {
    a = 1
    b = 2
    c = 3
  }

  // End cases (last and last-1)
  if (current >= last - 1) {
    a = last - 2
    b = last - 1
    c = last
  }

  // Safety clamp
  a = Math.max(1, a)
  b = Math.max(2, b)
  c = Math.min(last, c)

  const trio = [a, b, c]
  const showEllipsis = c < last - 1
  const showLast = c < last

  return { trio, showEllipsis, showLast, last }
})

function isActivePage(p) {
  return p === page.value
}

function openStudent(student) {
  router.push(`/bafoeg/student/${student.id}`)
}
</script>

<template>
  <MobileShell base="/bafoeg" title="Search Student">
    <v-text-field
      v-model="query"
      placeholder="Student ID or Name"
      append-inner-icon="mdi-magnify"
      hide-details
    />

    <div class="section-title mt-4 mb-2">Advanced search</div>

    <v-select v-model="filters.university" :items="universities" label="University" hide-details class="mb-2" />
    <v-select v-model="filters.year" :items="years" label="Year of study" hide-details class="mb-2" />
    <v-select v-model="filters.faculty" :items="faculties" label="Faculty" hide-details class="mb-2" />
    <v-select v-model="filters.program" :items="programs" label="Study program" hide-details class="mb-2" />
    <v-select v-model="filters.group" :items="groups" label="Group number" hide-details class="mb-4" />

    <div v-if="filtered.length === 0" class="text-body-2">
      No students found.
    </div>

    <StudentListItem
      v-for="s in pagedStudents"
      :key="s.id"
      :student="s"
      @select="openStudent"
    />

    <!-- Pagination: < a b c … last > -->
    <div class="pagination-row mt-3">
      <v-btn
        icon="mdi-chevron-left"
        size="small"
        variant="text"
        class="pager-btn"
        :disabled="page === 1"
        @click="setPage(page - 1)"
      />

      <v-btn
        v-for="p in pagingModel.trio"
        :key="p"
        size="small"
        class="page-btn"
        :variant="isActivePage(p) ? 'flat' : 'text'"
        :color="isActivePage(p) ? 'primary' : undefined"
        @click="setPage(p)"
      >
        {{ p }}
      </v-btn>

      <template v-if="pagingModel.showEllipsis">
        <v-text-field
          v-if="isPageInput"
          v-model="pageInput"
          inputmode="numeric"
          density="compact"
          variant="outlined"
          hide-details
          class="page-jump-input"
          @blur="confirmPageInput"
          @keyup.enter="confirmPageInput"
          @keyup.esc="cancelJumpInput"
        />
        <v-btn
          v-else
          size="small"
          variant="text"
          class="page-ellipsis"
          @click="toggleJumpInput"
        >
          …
        </v-btn>
      </template>

      <v-btn
        v-if="pagingModel.showLast"
        size="small"
        class="page-btn"
        :variant="isActivePage(pagingModel.last) ? 'flat' : 'text'"
        :color="isActivePage(pagingModel.last) ? 'primary' : undefined"
        @click="setPage(pagingModel.last)"
      >
        {{ pagingModel.last }}
      </v-btn>

      <v-btn
        icon="mdi-chevron-right"
        size="small"
        variant="text"
        class="pager-btn"
        :disabled="page === pageCount"
        @click="setPage(page + 1)"
      />
    </div>
  </MobileShell>
</template>

<style scoped>
.section-title {
  text-align: center;
  font-weight: 700;
  font-size: 1.25rem;
  color: rgba(0, 0, 0, 0.75);
}

/* Pagination: stable in screen */
.pagination-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-wrap: nowrap;
  white-space: nowrap;
}

.pager-btn {
  min-width: 32px;
}

.page-btn {
  min-width: 32px;
  padding: 0 8px;
}

.page-ellipsis {
  min-width: 24px;
  padding: 0 6px;
}

.page-jump-input {
  width: 56px;
}

/* remove number spinners */
.page-jump-input :deep(input) {
  -moz-appearance: textfield;
}
.page-jump-input :deep(input::-webkit-outer-spin-button),
.page-jump-input :deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}
</style>
