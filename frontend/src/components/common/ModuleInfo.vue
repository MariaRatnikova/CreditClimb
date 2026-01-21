<script setup>
// Vue Composition API: computed = abgeleitete Werte, ref = reaktive Zustände, onBeforeUnmount = Cleanup beim Verlassen der View
import { computed, ref, onBeforeUnmount } from 'vue'

// Props: Modul-Daten + offizielles Semester (optional)
const props = defineProps({
  module: { type: Object, required: true },
  officialSemester: { type: [Number, String], default: null },
})

// Prüft, ob es für das Modul bereits Deadlines gibt (für v-if / v-else Anzeige)
const hasDeadlines = computed(() => (props.module?.deadlines?.length ?? 0) > 0)

// Formatiert ein Datum kurz für die Timeline (z. B. "2026-01-23" -> "23.01")
function formatDateShort(dateStr) {
  if (!dateStr) return '—'
  const s = String(dateStr)
  if (s.length >= 10) return s.slice(8, 10) + '.' + s.slice(5, 7)
  return s
}

/* =========================
   DEADLINE OVERLAY (nur UI)
   ========================= */

// Steuert, ob das Overlay (Modal) sichtbar ist
const showDeadlineOverlay = ref(false)

// Formularfelder im Overlay (nur UI, keine Speicherung)
const deadlineTitle = ref('')
const deadlineDate = ref('')  // Format: yyyy-mm-dd
const deadlineTime = ref('')  // Format: hh:mm

// Öffnet das Overlay und setzt Default-Werte (heutiges Datum + aktuelle Uhrzeit)
function openDeadlineOverlay() {
  showDeadlineOverlay.value = true

  // Titel-Feld zurücksetzen
  deadlineTitle.value = ''

  // Default: heute + aktuelle Uhrzeit
  const now = new Date()
  const yyyy = String(now.getFullYear())
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  deadlineDate.value = `${yyyy}-${mm}-${dd}`

  const hh = String(now.getHours()).padStart(2, '0')
  const mi = String(now.getMinutes()).padStart(2, '0')
  deadlineTime.value = `${hh}:${mi}`
}

// Schließt das Overlay (Modal)
function closeDeadlineOverlay() {
  showDeadlineOverlay.value = false
}

// Tastatur-Handler: ESC schließt das Overlay (Usability)
function onKeydown(e) {
  if (e.key === 'Escape' && showDeadlineOverlay.value) {
    closeDeadlineOverlay()
  }
}

// Globalen Event-Listener registrieren (bei Mount) …
window.addEventListener('keydown', onKeydown)
// … und beim Unmount wieder entfernen, damit keine Memory Leaks entstehen
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

// Click auf "Create" (UI only): aktuell keine Logik, nur Overlay schließen
function onCreateClick() {
  closeDeadlineOverlay()
}
</script>

<template>
  <div class="content">
    <!-- Titel: Modulname -->
    <h1 class="title">{{ module.name }}</h1>

    <!-- Info-Block: Basisinformationen zum Modul -->
    <div class="info">
      <div class="row">
        <div class="label">Semester:</div>
        <div class="value">
          <!-- Offizielles Semester anzeigen, falls vorhanden -->
          {{ officialSemester !== null ? `${officialSemester}. Semester` : '—' }}
        </div>
      </div>

      <div class="row">
        <div class="label">Professor:</div>
        <div class="value">{{ module.professor ?? '—' }}</div>
      </div>

      <div class="row">
        <div class="label">ECTS Credits:</div>
        <div class="value">{{ module.credits ?? '—' }} Credits</div>
      </div>

      <div class="row">
        <div class="label">Exam Type:</div>
        <div class="value">{{ module.examType ?? '—' }}</div>
      </div>
    </div>

    <!-- Deadlines Überschrift -->
    <div class="deadlines-title">Deadlines:</div>

    <div class="deadlines-card">
      <!-- Plus-Button: öffnet das Overlay -->
      <button class="add" @click="openDeadlineOverlay" type="button" aria-label="Add deadline">+</button>

      <!-- Empty State: keine Deadlines vorhanden -->
      <div v-if="!hasDeadlines">
        No deadlines yet.
      </div>

      <!-- Timeline: Deadlines vorhanden -->
      <div v-else class="timeline">
        <!-- Vertikale Linie in der Mitte -->
        <div class="timeline-line" aria-hidden="true"></div>

        <!-- Jede Deadline als Reihe, links/rechts abwechselnd -->
        <div
          v-for="(d, i) in module.deadlines"
          :key="i"
          class="timeline-row"
        >
          <!-- Linke Seite: Text nur bei ungeraden Indizes -->
          <div class="side left" :class="{ active: i % 2 === 1 }">
            <span v-if="i % 2 === 1">{{ d.name ?? '—' }}</span>
          </div>

          <!-- Mitte: Datum als Punkt -->
          <div class="center">
            <div class="dot">
              {{ formatDateShort(d.date) }}
            </div>
          </div>

          <!-- Rechte Seite: Text nur bei geraden Indizes -->
          <div class="side right" :class="{ active: i % 2 === 0 }">
            <span v-if="i % 2 === 0">{{ d.name ?? '—' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- DEADLINE OVERLAY (nur UI) -->
  <!-- Klick auf Hintergrund (@click.self) schließt das Overlay -->
  <div v-if="showDeadlineOverlay" class="overlay" @click.self="closeDeadlineOverlay">
    <div class="overlay-card" role="dialog" aria-modal="true" aria-label="Add Deadline">
      <!-- Optionaler kleiner Titel oben -->
      <div class="overlay-top">Add Deadline</div>

      <!-- Hauptfrage/Headline -->
      <h2 class="overlay-title">What deadline should we save?</h2>

      <!-- Eingabe: Titel -->
      <div class="field">
        <div class="field-label">Title</div>
        <input
          v-model="deadlineTitle"
          class="field-input"
          type="text"
          placeholder=""
        />
      </div>

      <!-- Eingabe: Datum + Uhrzeit -->
      <div class="field">
        <div class="field-label">Deadline</div>

        <div class="deadline-row">
          <!-- Icon/Platzhalter -->
          <div class="icon-box" aria-hidden="true">📅</div>

          <!-- Date Picker (native) -->
          <input
            v-model="deadlineDate"
            class="field-input inline"
            type="date"
          />

          <!-- Time Picker (native) -->
          <input
            v-model="deadlineTime"
            class="field-input inline"
            type="time"
          />
        </div>
      </div>

      <!-- Aktionen: Cancel / Create -->
      <div class="overlay-actions">
        <button class="overlay-btn ghost" type="button" @click="closeDeadlineOverlay">
          Cancel
        </button>

        <button class="overlay-btn primary" type="button" @click="onCreateClick">
          Create
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Layout: Titel zentriert */
.title{
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  margin: 6px 0 18px;
}

/* Info-Block: Abstände */
.info{
  margin-top: 8px;
}

.row{
  margin: 14px 0;
}

/* Labels: fett */
.label{
  font-weight: 800;
  margin-bottom: 2px;
  font-size: 16px;
}

/* Values: normal */
.value{
  opacity: 0.9;
  font-size: 16px;
  font-weight: 400;
}

/* Deadlines Überschrift */
.deadlines-title{
  margin-top: 18px;
  font-weight: 800;
}

/* Deadlines Karte */
.deadlines-card{
  margin-top: 10px;
  background: #F1F7FF;
  border-radius: 18px;
  padding: 15px 10px 30px 10px;
  position: relative;
  overflow: hidden;
}

/* Plus-Button oben rechts */
.add{
  position: absolute;
  top: 4px;
  right: 20px;
  border: none;
  background: transparent;
  font-size: 34px;
  font-weight: 700;
  cursor: pointer;
}

/* Timeline Container */
.timeline{
  position: relative;
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 10px 0 14px;
}

/* Vertikale Linie */
.timeline-line{
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 3px;
  transform: translateX(-50%);
  background: linear-gradient(180deg,
    #BEDAF8 0%,
    #223142 45%,
    #C6DEFF 100%
  );
  border-radius: 999px;
  opacity: 0.9;
}

/* Eine Deadline-Zeile: links | mitte | rechts */
.timeline-row{
  position: relative;
  display: grid;
  grid-template-columns: 1fr 70px 1fr;
  align-items: center;
  min-height: 56px;
}

/* Seiten-Text */
.side{
  font-weight: 700;
  font-size: 14px;
  color: rgba(0,0,0,0.85);
}

.side.left{
  text-align: right;
  padding-right: 14px;
}

.side.right{
  text-align: left;
  padding-left: 14px;
}

/* Nicht-aktive Seite ausblenden, damit links/rechts abwechselt */
.side:not(.active){
  opacity: 0;
  pointer-events: none;
}

/* Mitte: Punkt/Datum */
.center{
  display: grid;
  place-items: center;
  z-index: 2;
}

.dot{
  width: 52px;
  height: 52px;
  border-radius: 999px;
  background: #FFBE86;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 14px;
  color: rgba(0,0,0,0.85);
  box-shadow: 0 6px 12px rgba(0,0,0,0.12);
}

/* ===== Overlay (Deadline) ===== */

/* Vollbild-Overlay mit dunklem Hintergrund */
.overlay{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 18px;
}

/* Modal-Karte */
.overlay-card{
  width: 100%;
  max-width: 520px;
  background: #F1F7FF;
  border-radius: 18px;
  padding: 16px 18px 18px;
  box-shadow: 0 18px 40px rgba(0,0,0,0.30);
  position: relative;
}

/* Kleiner Top-Text (optional) */
.overlay-top{
  position: absolute;
  top: -22px;
  left: 0;
  font-size: 16px;
  color: rgba(255,255,255,0.70);
}

/* Headline im Modal */
.overlay-title{
  margin: 4px 0 16px;
  font-size: 20px;
  font-weight: 700;
  color: rgba(0,0,0,0.85);
}

/* Formularfelder */
.field{
  margin: 14px 0;
}

.field-label{
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 8px;
  color: rgba(0,0,0,0.85);
}

/* Input-Style */
.field-input{
  width: 100%;
  height: 46px;
  border-radius: 10px;
  border: 2px solid rgba(0,0,0,0.25);
  background: #fff;
  padding: 0 12px;
  font-size: 16px;
  outline: none;
}

.field-input:focus{
  border-color: rgba(86,126,168,0.85);
}

/* Datum/Time Reihe */
.deadline-row{
  display: grid;
  grid-template-columns: 44px 1fr 120px;
  gap: 10px;
  align-items: center;
}

/* Icon Container */
.icon-box{
  height: 46px;
  width: 44px;
  border-radius: 10px;
  border: 2px solid rgba(0,0,0,0.25);
  background: #fff;
  display: grid;
  place-items: center;
  font-size: 18px;
}

.field-input.inline{
  width: 100%;
}

/* Buttons unten */
.overlay-actions{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 18px;
}

.overlay-btn{
  height: 48px;
  border-radius: 12px;
  border: none;
  font-weight: 800;
  font-size: 18px;
  cursor: pointer;
}

.overlay-btn.ghost{
  background: #fff;
  color: rgba(0,0,0,0.55);
  box-shadow: 0 8px 16px rgba(0,0,0,0.10);
}

.overlay-btn.primary{
  background: #567EA8;
  color: #fff;
  box-shadow: 0 10px 18px rgba(0,0,0,0.18);
}
</style>
