<script setup>
import { ref, onMounted, watch } from 'vue'
import MobileShell from '@/components/layout/MobileShell.vue'

const LS_PREFIX = 'cc_settings_tutor_'
const lsKey = (k) => ${LS_PREFIX}${k}

const defaultSort = ref('latest')
const showGroupBadges = ref(true)
const autoOpenLastGroup = ref(true)
const language = ref('de')

onMounted(() => {
  defaultSort.value = localStorage.getItem(lsKey('defaultSort')) || 'latest'
  showGroupBadges.value = localStorage.getItem(lsKey('showGroupBadges')) !== 'false'
  autoOpenLastGroup.value = localStorage.getItem(lsKey('autoOpenLastGroup')) !== 'false'
  language.value = localStorage.getItem(lsKey('language')) || 'de'
})

watch(defaultSort, (v) => localStorage.setItem(lsKey('defaultSort'), String(v)))
watch(showGroupBadges, (v) => localStorage.setItem(lsKey('showGroupBadges'), String(v)))
watch(autoOpenLastGroup, (v) => localStorage.setItem(lsKey('autoOpenLastGroup'), String(v)))
watch(language, (v) => localStorage.setItem(lsKey('language'), String(v)))

function reset() {
  ;['defaultSort', 'showGroupBadges', 'autoOpenLastGroup', 'language'].forEach((k) =>
    localStorage.removeItem(lsKey(k))
  )
  defaultSort.value = 'latest'
  showGroupBadges.value = true
  autoOpenLastGroup.value = true
  language.value = 'de'
}
</script>

<template>
  <MobileShell base="/tutor" title="Settings">
    <div class="page">
      <div class="card">
        <div class="card-title">Tutor preferences</div>

        <v-select
          v-model="defaultSort"
          :items="[
            { title: 'Latest', value: 'latest' },
            { title: 'A–Z', value: 'az' },
          ]"
          item-title="title"
          item-value="value"
          label="Default student sort"
          hide-details
          class="mb-3"
        />

        <div class="row">
          <div class="left">
            <div class="label">Show group badges</div>
            <div class="hint">Mock setting for demo UI.</div>
          </div>
          <v-switch v-model="showGroupBadges" hide-details />
        </div>

        <div class="row">
          <div class="left">
            <div class="label">Auto open last group</div>
            <div class="hint">Remember last selected group (demo only).</div>
          </div>
          <v-switch v-model="autoOpenLastGroup" hide-details />
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
