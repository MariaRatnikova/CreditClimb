<script setup>
    import { ref } from 'vue'
    import MobileShell from '@/components/layout/MobileShell.vue'

    const query = ref('')
</script>

<template>
  <MobileShell base="/tutor">
    <v-card class="pa-4">
      <div class="text-h6">Search Student</div>

      <v-text-field
        v-model="query"
        class="mt-3"
        label="Student ID or Name"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
      />
    </v-card>
  </MobileShell>
</template>
