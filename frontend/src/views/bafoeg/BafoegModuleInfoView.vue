<script setup>
import MobileShell from '@/components/layout/MobileShell.vue'
import ModuleInfoContent from '@/components/common/ModuleInfo.vue'

import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { universityPlan } from '@/data/universityPlan'

const route = useRoute()
const router = useRouter()

const moduleId = computed(() => String(route.params.id ?? ''))

const moduleEntry = computed(() => {
  for (const sem of universityPlan ?? []) {
    const found = (sem.modules ?? []).find(m => String(m.id) === moduleId.value)
    if (found) return { module: found, semester: sem.semester }
  }
  return null
})

const moduleData = computed(() => moduleEntry.value?.module ?? null)
const officialSemester = computed(() => moduleEntry.value?.semester ?? null)
</script>

<template>
  <MobileShell base="/bafoeg">
    <div class="page">
      <button class="icon-btn" type="button" @click="router.back()" aria-label="Back">
        <span class="icon">←</span>
      </button>

      <div v-if="!moduleData" class="not-found">Module not found.</div>

      <ModuleInfoContent
        v-else
        :module="moduleData"
        :officialSemester="officialSemester"
      />
    </div>
  </MobileShell>
</template>

<style scoped>
:deep(.top-bar),
:deep(.top-bar .v-app-bar),
:deep(.top-bar .v-app-bar__content),
:deep(.top-bar .v-toolbar__content) {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
}

.page{
  padding: 0px 16px 90px;
  background: #ffffff;
  min-height: 100%;
  position: relative;
}

.icon-btn{
  position: fixed;
  top: 15px;
  left: 20px;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: none;
  background: rgba(0,0,0,0.20);
  color: rgba(255,255,255,0.95);
  display: grid;
  place-items: center;
  cursor: pointer;
  z-index: 9999;
  font-weight: 800;
  font-size: 18px;
}

.not-found{
  padding-top: 60px;
  text-align: center;
  opacity: 0.7;
}
</style>
