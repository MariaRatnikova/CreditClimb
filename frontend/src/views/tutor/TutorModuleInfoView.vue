<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MobileShell from '@/components/layout/MobileShell.vue'
import ModuleInfoContent from '@/components/common/ModuleInfo.vue'
import { semestersData } from '@/data/semestersData'

const route = useRoute()
const router = useRouter()

const moduleId = computed(() => String(route.params.id ?? ''))

const moduleEntry = computed(() => {
  for (const sem of semestersData ?? []) {
    const found = (sem.modules ?? []).find(m => String(m.id) === moduleId.value)
    if (found) return { module: found, semester: sem.semester }
  }
  return null
})

const moduleData = computed(() => moduleEntry.value?.module ?? null)
const officialSemester = computed(() => moduleEntry.value?.semester ?? null)
</script>

<template>
  <MobileShell base="/tutor" :showBack="true" title="Module Info">
    <div class="page">
      <div v-if="!moduleData" class="not-found">Module not found.</div>
      <ModuleInfoContent v-else :module="moduleData" :officialSemester="officialSemester" />
    </div>
  </MobileShell>
</template>

<style scoped>
.page{ padding: 0 16px 90px; background:#fff; min-height:100%; }
.not-found{ padding-top:60px; text-align:center; opacity:.7; }
</style>
