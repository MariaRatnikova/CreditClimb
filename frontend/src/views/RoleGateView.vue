<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const auth = useAuthStore()

onMounted(() => {
    auth.loadFromStorage()

    // solange Login noch nicht existiert:
    if (!auth.isAuthenticated) {
        // Mock default
        auth.setSession({ role: 'bafoeg' })
    }

    if (auth.role === 'tutor') router.replace('/tutor/search')
    else if (auth.role === 'bafoeg') router.replace('/bafoeg/search')
    else if (auth.role === 'student') router.replace('/student/home')
    else router.replace('/student/home')
})
</script>

<template>
  <v-container class="py-10 text-center">
    <v-progress-circular indeterminate />
    <div class="mt-4">Loading…</div>
  </v-container>
</template>
