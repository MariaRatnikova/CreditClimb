<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/**
 * MobileShell = wiederverwendbares Layout (App-Bar + Content + Bottom-Navigation).
 */
const props = defineProps({
  base: { type: String, required: true },
  showBack: { type: Boolean, default: false },
  title: { type: String, default: '' },
 
})

const router = useRouter()
const route = useRoute()

function goBack() {
  if (window.history.length > 1) router.back()
  else router.push(props.base + '/home')
}

/**
 * Aktiver Tab = Route beginnt mit /<base>/<tab>
 * Beispiel: /bafoeg/search => activeTab = 'search'
 */
const activeTab = computed(() => {
  const p = route.path
  if (p.startsWith(props.base + '/search')) return 'search'
  if (p.startsWith(props.base + '/home')) return 'home'
  if (p.startsWith(props.base + '/settings')) return 'settings'
  return ''
})

function isActive(tab) {
  return activeTab.value === tab
}
</script>

<template>
  <div class="mobile-root">
    <!-- TOP BAR -->
    <v-app-bar app class="top-bar" density="default" height="70">
      <v-btn
        v-if="showBack"
        icon="mdi-arrow-left"
        class="top-icon-btn"
        @click="goBack"
      />

      <v-app-bar-title class="top-title">
        {{ title }}
      </v-app-bar-title>

      <v-spacer />

      <!-- Profilbild -->
      <v-btn>
        <v-icon icon="mdi-account-circle-outline" size="40" />
      </v-btn>
    </v-app-bar>

    <v-main>
      <div class="content">
        <slot />
      </div>
    </v-main>

    <!-- BOTTOM NAV -->
    <v-bottom-navigation app  elevation="1" :height="80">
      <v-btn
        :to="base + '/search'"
        class="nav-btn"
        :class="{ active: isActive('search') }"
        variant="text"
      >
        <v-icon icon="mdi-magnify" class="nav-icon" />
        <span class="nav-label">Search</span>
      </v-btn>

      <v-btn
        :to="base + '/home'"
        class="nav-btn"
        :class="{ active: isActive('home') }"
        variant="text"
      >
        <v-icon icon="mdi-home-outline" class="nav-icon" />
        <span class="nav-label">Home</span>
      </v-btn>

      <v-btn
        :to="base + '/settings'"
        class="nav-btn"
        :class="{ active: isActive('settings') }"
        variant="text"
      >
      <v-icon icon="mdi-cog-outline" class="nav-icon" />
        <span class="nav-label">Settings</span>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<style scoped>
  .mobile-root {
    max-width: 100%;
    min-height: 100vh;
    background: rgb(var(--v-theme-background));
  }

  .content {
    padding: 16px;
  }

  /* TOP BAR */
  .top-bar {
    background: rgb(var(--v-theme-background));
  }

  .top-title {
    font-weight: 700;
    font-size: 1.05rem;
  }

  /* Nav Button ” */
  .nav-btn {
    min-width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    padding: 8px 0;
    background: rgba(var(--v-theme-surface));
  }

  /* Icon */
  .nav-icon {
    font-size: 40px;
    color: rgba(var(--v-theme-secondary));
  }

  /* Text */
  .nav-label {
    font-size: 0.78rem;
    font-weight: 700;
    color: rgba(var(--v-theme-secondary));
  }

  /* Aktiver Tab: nur Icon/Text blau */
  .nav-btn.active .nav-icon,
  .nav-btn.active .nav-label {
    color: rgb(var(--v-theme-primary)) !important;
    font-weight: 700;
  }

  /* Vuetify setzt teilweise active states auf v-btn -> neutralisieren*/
  .nav-btn :deep(.v-btn__overlay),
  .nav-btn :deep(.v-btn__underlay) {
    display: none !important;
  }
</style>
