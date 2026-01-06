<script setup>
    import MobileShell from '@/components/layout/MobileShell.vue'
    defineProps({ id: { type: String, required: true } })
</script>

<template>
  <MobileShell base="/tutor" :showBack="true" title="Student Info">
    <v-card class="pa-4" variant="outlined">
      <div class="text-h6">Student {{ id }}</div>
      <div class="text-body-2 mt-2">Platzhalter für Tutor Student Info Screen.</div>
    </v-card>
  </MobileShell>
</template>