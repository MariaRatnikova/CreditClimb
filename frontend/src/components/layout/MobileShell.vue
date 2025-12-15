<script setup>
    import { useRouter } from 'vue-router'

    const props = defineProps({
    base: { type: String, required: true },
    showBack: { type: Boolean, default: false },
    title: { type: String, default: '' },
    })

    const router = useRouter()
    function goBack() {
    if (window.history.length > 1) router.back()
    else router.push(props.base + '/home')
}
</script>

<template>
  <div class="mobile-root">
    <!-- TOP BAR -->
    <v-app-bar
      app
      color="white"
      elevation="1"
      density="comfortable"
    >
      <v-btn v-if="showBack" icon="mdi-arrow-left" @click="goBack" />
      <v-app-bar-title class="text-body-1">{{ title }}</v-app-bar-title>
      <v-spacer />
      <v-btn icon="mdi-account-circle-outline" />
    </v-app-bar>

    <v-main>
      <div class="content">
        <slot />
      </div>
    </v-main>

    <v-bottom-navigation app grow elevation="1" bg-color="white">
      <v-btn :to="base + '/search'" prepend-icon="mdi-magnify">Search</v-btn>
      <v-btn :to="base + '/home'" prepend-icon="mdi-home-outline">Home</v-btn>
      <v-btn :to="base + '/settings'" prepend-icon="mdi-cog-outline">Settings</v-btn>
    </v-bottom-navigation>
  </div>
</template>

<style scoped>
    .mobile-root {
    max-width: 420px;
    margin: 0 auto;
    min-height: 100vh;
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
    background: #fff;
    }
    .content { padding: 16px; }
</style>
