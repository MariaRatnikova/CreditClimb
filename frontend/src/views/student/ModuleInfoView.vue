<script setup>
// Layout-Komponente (Top-Bar + Content + Bottom Navigation)
import MobileShell from '@/components/layout/MobileShell.vue'

// Inhalt der Modul-Detailansicht (zeigt Infos + Deadlines usw.)
import ModuleInfoContent from '@/components/common/ModuleInfo.vue'

import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Offizieller Studienplan der Uni (enthält Semester + Module)
import { universityPlan } from '@/data/universityPlan'

// Zugriff auf aktuelle Route (z. B. /student/module/:id) und Router für Navigation
const route = useRoute()
const router = useRouter()

// Modul-ID aus der URL lesen und sicher in einen String umwandeln
const moduleId = computed(() => String(route.params.id ?? ''))

// Sucht das Modul im offiziellen Plan:
// - läuft über alle Semester (universityPlan)
// - sucht darin das Modul mit passender id
// - gibt bei Treffer { module, semester } zurück
const moduleEntry = computed(() => {
  for (const sem of universityPlan ?? []) {
    const found = (sem.modules ?? []).find(m => String(m.id) === moduleId.value)
    if (found) return { module: found, semester: sem.semester }
  }
  return null
})

// Modul-Daten für die Detailansicht (oder null, wenn nicht gefunden)
const moduleData = computed(() => moduleEntry.value?.module ?? null)

// Offizielles Semester, in dem das Modul laut Plan vorgesehen ist (oder null)
const officialSemester = computed(() => moduleEntry.value?.semester ?? null)

// Zurück-Navigation (Alternative zu $router.back() im Template)
function goBack() {
  router.back()
}
</script>

<template>
  <!-- MobileShell sorgt für das App-Layout (z. B. Bottom-Navigation) -->
  <MobileShell base="/student">
    <div class="page">
      <!-- Zurück-Button: fixiert oben links -->
      <button class="icon-btn" type="button" @click="$router.back()" aria-label="Back">
        <span class="icon">←</span>
      </button>

      <!-- Falls die Modul-ID nicht im Plan existiert -->
      <div v-if="!moduleData" class="not-found">
        Module not found.
      </div>

      <!-- Sonst: Modul-Infos anzeigen -->
      <ModuleInfoContent
        v-else
        :module="moduleData"
        :officialSemester="officialSemester"
      />
    </div>
  </MobileShell>
</template>

<style scoped>
/* Top-Bar transparent machen (damit der Screen "clean" wirkt) */
:deep(.top-bar),
:deep(.top-bar .v-app-bar),
:deep(.top-bar .v-app-bar__content),
:deep(.top-bar .v-toolbar__content) {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
}

/* Seitencontainer: Padding + weißer Hintergrund */
.page{
  padding: 0px 16px 90px;
  background: #ffffff;
  min-height: 100%;
  position: relative;
}

/* Zurück-Button als runder Floating-Button */
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

/* Fehlermeldung, wenn Modul nicht gefunden wurde */
.not-found{
  padding-top: 60px;
  text-align: center;
  opacity: 0.7;
}
</style>
