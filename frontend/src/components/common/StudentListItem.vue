<script setup>
/**
 * StudentListItem = dumb UI Komponente
 */
defineProps({
  student: { type: Object, required: true },

  // optional: BAföG "unseen" Punkt
  showDot: { type: Boolean, default: false },

  // optional: rechte Spalte oben/unten (z.B. Uhrzeit / Uni)
  rightTop: { type: String, default: '' },
  rightBottom: { type: String, default: '' },
})
defineEmits(['select'])
</script>

<template>
  <v-card class="student-item mb-2" @click="$emit('select', student)">
    <v-card-text class="row py-3">
      <div class="left">
        <div class="text-title">{{ student.name }}</div>
        <div class="text-caption">{{ student.id }}</div>
      </div>

      <div class="right">
        <div class="right-top">
          <span v-if="rightTop">{{ rightTop }}</span>
        </div>
        <div class="right-bottom">
          <span v-if="rightBottom">{{ rightBottom }}</span>
          <span v-else class="fallback">{{ student.university }}</span>
        </div>

        <span v-if="showDot" class="dot" aria-label="unseen"></span>
      </div>
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

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left {
  min-width: 0;
}

.right {
  position: relative;
  text-align: right;
  min-width: 110px;
  padding-right: 8px;
}

.right-top {
  font-size: 12px;
  font-weight: 600;
  opacity: 0.85;
}

.right-bottom {
  font-size: 12px;
  opacity: 0.75;
}

.fallback {
  opacity: 0.9;
}

.dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: #ffbe86;
  box-shadow: 0 0 0 2px #f1f7ff;
}
</style>
