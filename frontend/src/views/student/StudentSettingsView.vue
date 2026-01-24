<script setup>
import { ref, onMounted, watch } from 'vue'
import MobileShell from '@/components/layout/MobileShell.vue'

const LS_PREFIX = 'cc_settings_student_'
const lsKey = (k) => ${LS_PREFIX}${k}

const showDeadlines = ref(true)
const autoExpandCurrentSemester = ref(true)
const showGrades = ref(true)
const language = ref('de')

onMounted(() => {
  showDeadlines.value = localStorage.getItem(lsKey('showDeadlines')) !== 'false'
  autoExpandCurrentSemester.value =
    localStorage.getItem(lsKey('autoExpandCurrentSemester')) !== 'false'
  showGrades.value = localStorage.getItem(lsKey('showGrades')) !== 'false'
  language.value = localStorage.getItem(lsKey('language')) || 'de'
})

watch(showDeadlines, (v) => localStorage.setItem(lsKey('showDeadlines'), String(v)))
watch(autoExpandCurrentSemester, (v) =>
  localStorage.setItem(lsKey('autoExpandCurrentSemester'), String(v))
)
watch(showGrades, (v) => localStorage.setItem(lsKey('showGrades'), String(v)))
watch(language, (v) => localStorage.setItem(lsKey('language'), String(v)))

function reset() {
  ;['showDeadlines', 'autoExpandCurrentSemester', 'showGrades', 'language'].forEach((k) =>
    localStorage.removeItem(lsKey(k))
  )
  showDeadlines.value = true
  autoExpandCurrentSemester.value = true
  showGrades.value = true
  language.value = 'de'
}
</script>

<template>
  <MobileShell base="/student" title="Settings">
    <div class="page">
      <div class="card">
        <div class="card-title">Study view</div>

        <div class="row">
          <div class="left">
            <div class="label">Show deadlines</div>
            <div class="hint">Mock setting (optional UI only).</div>
          </div>
          <v-switch v-model="showDeadlines" hide-details />
        </div>

        <div class="row">
          <div class="left">
            <div class="label">Auto expand current semester</div>
            <div class="hint">Useful for the semester overview screen.</div>
          </div>
          <v-switch v-model="autoExpandCurrentSemester" hide-details />
        </div>

        <div class="row">
          <div class="left">
            <div class="label">Show grades</div>
            <div class="hint">If disabled, UI can hide grade badges later.</div>
          </div>
          <v-switch v-model="showGrades" hide-details />
        </div>
      </div>

      <div class="card">
        <div class="card-title">Preferences</div>

        <v-select
          v-model="language"
          :items="[
            { title: 'Deutsch', value: 'de' },
            { title: 'English', value: 'en' },
          ]"
          item-title="title"
          item-value="value"
          label="Language"
          hide-details
        />
      </div>

      <div class="card">
        <div class="card-title">Account</div>

        <v-btn variant="tonal" class="w-100" @click="reset">Reset settings</v-btn>
        <v-btn variant="outlined" class="w-100 mt-2" disabled>Logout (mock)</v-btn>
      </div>
    </div>
  </MobileShell>
</template>

<style scoped>
.page {
  padding: 12px 16px 90px;
  min-height: 100%;
  background: #ffffff;
}

.card {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 12px;
}

.card-title {
  font-weight: 900;
  margin-bottom: 10px;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
}

.left .label {
  font-weight: 700;
}
.left .hint {
  font-size: 12px;
  opacity: 0.65;
  margin-top: 2px;
}
</style>
