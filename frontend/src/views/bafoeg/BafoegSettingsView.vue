<script setup>
import { ref, onMounted, watch } from 'vue'
import MobileShell from '@/components/layout/MobileShell.vue'

const LS_PREFIX = 'cc_settings_bafoeg_'
const lsKey = (k) => `${LS_PREFIX}${String(k)}`

const notifications = ref(true)
const defaultSort = ref('latest')
const language = ref('de')
const compactMode = ref(false)

onMounted(() => {
  notifications.value = localStorage.getItem(lsKey('notifications')) !== 'false'
  defaultSort.value = localStorage.getItem(lsKey('defaultSort')) || 'latest'
  language.value = localStorage.getItem(lsKey('language')) || 'de'
  compactMode.value = localStorage.getItem(lsKey('compactMode')) === 'true'
})

watch(notifications, (v) => localStorage.setItem(lsKey('notifications'), String(v)))
watch(defaultSort, (v) => localStorage.setItem(lsKey('defaultSort'), String(v)))
watch(language, (v) => localStorage.setItem(lsKey('language'), String(v)))
watch(compactMode, (v) => localStorage.setItem(lsKey('compactMode'), String(v)))

function reset() {
  ;['notifications', 'defaultSort', 'language', 'compactMode'].forEach((k) =>
    localStorage.removeItem(lsKey(k))
  )
  notifications.value = true
  defaultSort.value = 'latest'
  language.value = 'de'
  compactMode.value = false
}
</script>

<template>
  <MobileShell base="/bafoeg" title="Settings">
    <div class="page">
      <div class="card">
        <div class="card-title">Applications</div>

        <v-select
          v-model="defaultSort"
          :items="[
            { title: 'Latest', value: 'latest' },
            { title: 'A–Z', value: 'az' },
          ]"
          item-title="title"
          item-value="value"
          label="Default sort"
          hide-details
          class="mb-3"
        />

        <div class="row">
          <div class="left">
            <div class="label">Notifications</div>
            <div class="hint">Mock setting (no backend).</div>
          </div>
          <v-switch v-model="notifications" hide-details />
        </div>

        <div class="row">
          <div class="left">
            <div class="label">Compact mode</div>
            <div class="hint">Only affects spacing in some screens if wired later.</div>
          </div>
          <v-switch v-model="compactMode" hide-details />
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

