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
    class="student-item mb-2"
    @click="$emit('select', student)"
  >
    <v-card-text class="d-flex justify-space-between align-center py-3">
      <div>
        <div class="text-title">{{ student.name }}</div>
        <div class="text-caption">{{ student.id }}</div>
      </div>
      <div class="text-caption text-right">{{ student.university }}</div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
  .text-title {
    font-weight: 700;
  }

  .text-caption {
    font-weight: 400;
  }
  .student-item {
    background: #f1f7ff;
    border: 2px solid rgba(213, 226, 241, 0.5);
  }

  .student-item:hover {
    background-color: rgba(86, 126, 168, 0.5);
  }
</style>