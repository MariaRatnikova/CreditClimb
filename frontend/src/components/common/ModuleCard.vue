<script setup>
import { useRouter } from 'vue-router'

// Modul-Karte: zeigt Titel, Credits, Attempt, Semester und Grade
const props = defineProps({
  module: { type: Object, required: true }, // erwartet: { title, credits, attempt, grade, semester? }
  showSemester: { type: Boolean, default: true }, // optional: Semester anzeigen/ausblenden
})
const router = useRouter()

function openModule() {
  router.push(`/student/module/${props.module.id}`)
}
</script>

<template>
  <div class="module-card" type="button" @click="openModule">
    <div class="module-left">
      <div class="module-title">{{ module.name }}</div>

      <div class="module-meta">
        <span class="meta-credits">{{ module.credits }} ECTS</span>
        <span class="meta-dot" aria-hidden="true">•</span>
        <span class="meta-attempt">{{ module.attempt }}. attempt</span>

        <template v-if="showSemester && module.semester !== undefined && module.semester !== null">
          <span class="meta-dot" aria-hidden="true">•</span>
          <span class="meta-semester">{{ module.semester }}. semester</span>
        </template>
      </div>
    </div>

    <div class="module-right" :class="{ done: module.grade !== null && module.grade !== undefined }">
      <div class="check" aria-hidden="true">✓</div>
      <div class="grade">
        {{ module.grade !== null && module.grade !== undefined ? String(module.grade).replace('.', ',') : '—' }}
      </div>
    </div>

  </div>

</template>

<style scoped>
.module-card{
  display:flex;
  align-items: stretch;
  justify-content: space-between;
  border-radius: 11px;
  background: #C6DEFF; /* светло-голубой */
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.18);
  overflow: hidden;
}

.module-left{
  padding: 10px 8px 10px 16px;
  flex: 1;
  min-width: 0;
}

.module-title{
  font-weight: 700;
  font-size: 16px;
  line-height: 1.1;
  color: rgba(0,0,0,0.88);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.module-meta{
  margin-top: 8px;
  display:flex;
  gap: 10px;
  align-items: center;
  font-weight: 500;
  font-size: 13px;
  color: rgba(0,0,0,0.55);
  flex-wrap: nowrap;      /* не переносим */
  overflow: hidden;       /* лишнее прячем */
  white-space: nowrap;    
}

.meta-dot{
  opacity: 0.55;
}

.module-right{
  width: 86px;
  background: #F1F7FF;
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;   
  gap: 8px;                  
  border-radius: 11px;
padding-top: 12px;  
}

.check{
  width: 26px;
  height: 26px;
  border-radius: 7px;
  background: #FFBE86;
  display:grid;
  place-items:center;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
  
}

.grade{
  font-weight: 900;
  font-size: 14px;
  color: rgba(0,0,0,0.88);
}


.module-right:not(.done){
  background: rgba(255,255,255,0.35);
}
.module-right:not(.done) .check{
  background: rgba(0,0,0,0.10);
  color: rgba(255,255,255,0.90);
}
.module-right:not(.done) .grade{
  color: rgb(0, 0, 0);
}
</style>
