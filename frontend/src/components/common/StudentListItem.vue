<script setup>

  /*
  * StudentListItem = dumb UI Komponente
  */
    defineProps({
    student: { type: Object, required: true }
    })
    defineEmits(['select'])
</script>

<template>
  <v-card
    class="mb-2"
    variant="outlined"
    @click="$emit('select', student)"
    style="cursor:pointer;"
  >
    <v-card-text class="d-flex justify-space-between align-center">
      <div>
        <div class="font-weight-medium">{{ student.name }}</div>
        <div class="text-caption">{{ student.id }}</div>
      </div>
      <div class="text-caption text-right">{{ student.university }}</div>
    </v-card-text>
  </v-card>
</template>