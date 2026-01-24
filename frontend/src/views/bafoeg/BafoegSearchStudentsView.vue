<script setup>
import MobileShell from '@/components/layout/MobileShell.vue'
import { computed, reactive, ref, onBeforeUnmount } from 'vue'

/**
 * Key für localStorage, um den aktuellen Formularzustand (Draft) zu speichern.
 * v1 = Versionierung, falls du später das Datenmodell änderst.
 */
const STORAGE_KEY = 'achieva.bafoegPerformanceProof.v1'

/**
 * Länder-Liste für den Select (Geburtsland / Place of birth).
 */
const countries = [
  'Germany',
  'Latvia',
  'China',
  'Poland',
  'Czech Republic',
  'France',
  'Italy',
  'Spain',
  'Other',
]

/**
 * Reaktives Formularmodell.
 * reactive() ist sinnvoll, weil wir mehrere Felder in einem Objekt halten.
 */
const form = reactive({
  lastName: '',
  firstName: '',
  dob: '',
  placeOfBirth: '',
  institutionName: '',
  institutionAddress: '',
  fieldOfStudy: '',
})

/**
 * Nur der Dateiname (UI), nicht der File-Inhalt.
 */
const selectedFileName = ref('')

/**
 * UI-State / Stage:
 * 0 = Formular
 * 1 = Upload/Loading
 * 2 = Sent (gesendet)
 * 3 = Reviewed (bearbeitet / reviewed)
 */
const stage = ref(0)

/**
 * Timer-IDs, damit wir setTimeout sauber abbrechen können
 * (z. B. beim Reset oder beim Unmount).
 */
let loadingTimerId = null
let reviewedTimerId = null

/**
 * Hilfsfunktion: stoppt alle laufenden Timer, damit nichts "nachträglich" feuert.
 */
function clearTimers() {
  if (loadingTimerId) clearTimeout(loadingTimerId)
  if (reviewedTimerId) clearTimeout(reviewedTimerId)
  loadingTimerId = null
  reviewedTimerId = null
}

/**
 * Speichert den aktuellen Zustand (Form + Dateiname + Stage) als Draft in localStorage.
 */
function saveDraft() {
  const payload = {
    form: { ...form },
    selectedFileName: selectedFileName.value,
    stage: stage.value,
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

/**
 * Wenn beim Reload bereits stage 1 oder 2 gespeichert war,
 * müssen die Timer wieder "fortgesetzt" werden, damit die UI weiterläuft.
 */
function scheduleTimersIfNeeded() {
  // Vorher sicherheitshalber alte Timer entfernen
  clearTimers()

  if (stage.value === 1) {
    // Stage 1: nach 2s -> Stage 2 (Sent)
    loadingTimerId = setTimeout(() => {
      stage.value = 2
      saveDraft()

      // danach nach 5s -> Stage 3 (Reviewed)
      reviewedTimerId = setTimeout(() => {
        stage.value = 3
        saveDraft()
      }, 5000)
    }, 2000)
  }

  if (stage.value === 2) {
    // Stage 2: nach 5s -> Stage 3 (Reviewed)
    reviewedTimerId = setTimeout(() => {
      stage.value = 3
      saveDraft()
    }, 5000)
  }
}

/**
 * Lädt Draft aus localStorage und setzt:
 * - form Felder
 * - Dateiname
 * - stage
 * Danach: Timer ggf. wieder anwerfen (Fortsetzung).
 */
function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return

    const parsed = JSON.parse(raw)

    Object.assign(form, parsed?.form ?? {})
    selectedFileName.value = parsed?.selectedFileName ?? ''

    const savedStage = Number(parsed?.stage ?? 0)
    stage.value = Number.isFinite(savedStage) ? savedStage : 0

    // Falls stage schon in "loading/sent" ist: Timer neu setzen
    scheduleTimersIfNeeded()
  } catch (_) {}
}

// Draft beim Start direkt laden
loadDraft()

/**
 * Wird aufgerufen, wenn User eine PDF auswählt.
 * Wir speichern nur den Namen für die Anzeige.
 */
function onFileChange(e) {
  const file = e.target.files?.[0]
  selectedFileName.value = file ? file.name : ''
}

/**
 * Validierung: ob das Formular die Pflichtfelder enthält.
 * (Minimalcheck: nicht leer)
 */
const canSend = computed(() => {
  return (
    form.lastName.trim() &&
    form.firstName.trim() &&
    form.dob.trim() &&
    form.institutionName.trim() &&
    form.fieldOfStudy.trim()
  )
})

/**
 * "Send"-Aktion:
 * - prüft Pflichtfelder
 * - startet Loading (stage=1)
 * - simuliert Upload: nach 2s -> stage=2
 * - danach nach 5s -> stage=3
 * Alles wird zwischendurch gespeichert, damit Reload möglich ist.
 */
function send() {
  if (!canSend.value) {
    alert(
      'Please fill in required fields (Name, First name, Date of birth, Institution, Field of study).'
    )
    return
  }

  clearTimers()

  // Upload starten
  stage.value = 1
  saveDraft()

  // Simulation: Upload fertig -> Sent
  loadingTimerId = setTimeout(() => {
    stage.value = 2
    saveDraft()

    // Simulation: Office reviewed -> Reviewed
    reviewedTimerId = setTimeout(() => {
      stage.value = 3
      saveDraft()
    }, 5000)
  }, 2000)
}

/**
 * Zurück zum Formular, ohne Daten zu löschen.
 * (Stage zurücksetzen, Timer stoppen, Draft speichern.)
 */
function resetToForm() {
  clearTimers()
  stage.value = 0
  saveDraft()
}

/**
 * Cleanup: Beim Unmount (View verlassen) Timer stoppen,
 * damit keine State-Updates auf einer unmounted Komponente passieren.
 */
onBeforeUnmount(() => {
  clearTimers()
})
</script>

<template>
  <MobileShell base="/bafoeg">
    <div class="page">
      <!-- ====== REVIEWED (====== -->
      <div v-if="stage === 3" class="reviewed-screen">
        <h1 class="title">
          Bafög<br />
          Performance Proof
        </h1>

        
         <img src="@/assets/mail2.png" alt="" class="mail"> 

        <p class="reviewed-text">
          Your form has been reviewed and
          completed by the examination office.
          Download the PDF <strong>document</strong> using
          the link below.
        </p>

        <a class="download-link" href="#" @click.prevent>Download PDF</a>

        <button class="btn send-office" type="button">Send to BAföG office</button>

        
        <button class="back-to-form" type="button" @click="resetToForm">Back to form</button>
      </div>

     
      <div v-else-if="stage === 2" class="sent-screen">
        <h1 class="title">
          Bafög<br />
          Performance Proof
        </h1>

       
      <img class="mail" src="@/assets/mail1.png" alt="mail bild">

        <p class="sent-text">
          Your form has been sent to the<br />
          <strong>examination office</strong> of your<br />
          university.
        </p>
      </div>

      <!-- ====== LOADING ====== -->
      <div v-else-if="stage === 1" class="loading-screen">
        <h1 class="title">
          Bafög<br />
          Performance Proof
        </h1>

        <div class="spinner" aria-hidden="true"></div>
        <p class="loading-text">Uploading…</p>
      </div>

      <!-- ====== FORM ====== -->
      <div v-else>
        <h1 class="title">
          Bafög<br />
          Performance Proof
        </h1>

        <div class="form">
          <label class="field">
            <div class="label">Name</div>
            <input v-model="form.lastName" class="input" type="text" placeholder="Name" />
          </label>

          <label class="field">
            <div class="label">First Name</div>
            <input v-model="form.firstName" class="input" type="text" placeholder="First name" />
          </label>

          <label class="field">
            <div class="label">Date of birth</div>
            <input v-model="form.dob" class="input" type="text" placeholder="dd.mm.yyyy" />
          </label>

          <label class="field">
            <div class="label">Place of birth</div>
            <select v-model="form.placeOfBirth" class="input select">
              <option value="" disabled>Country</option>
              <option v-for="c in countries" :key="c" :value="c">{{ c }}</option>
            </select>
          </label>

          <label class="field">
            <div class="label">Name of the educational institution</div>
            <input
              v-model="form.institutionName"
              class="input"
              type="text"
              placeholder="Name"
            />
          </label>

          <label class="field">
            <div class="label">Address of the educational institution</div>
            <input
              v-model="form.institutionAddress"
              class="input"
              type="text"
              placeholder="Name"
            />
          </label>

          <label class="field">
            <div class="label">
              This performance certificate refers to:<br />
              Field of study / Department
            </div>
            <input
              v-model="form.fieldOfStudy"
              class="input"
              type="text"
              placeholder="Field of study"
            />
          </label>

          <label class="field">
            <div class="label">Select Transcript of grades (PDF)</div>

            <div class="file-row">
              <input class="file-input" type="file" accept="application/pdf" @change="onFileChange" />
              <div class="file-fake input">
                <span class="file-name" :class="{ placeholder: !selectedFileName }">
                  {{ selectedFileName || 'Select file' }}
                </span>
                <span class="chev">▾</span>
              </div>
            </div>
          </label>

          <div class="actions">
            <button class="btn ghost" type="button" @click="saveDraft">Save</button>

            <button
              class="btn primary"
              type="button"
              :disabled="!canSend || stage !== 0"
              :class="{ disabled: !canSend || stage !== 0 }"
              @click="send"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  </MobileShell>
</template>

<style scoped>
:deep(.top-bar),
:deep(.top-bar .v-app-bar),
:deep(.top-bar .v-app-bar__content),
:deep(.top-bar .v-toolbar__content) {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
}

.page {
  background: #ffffff;
  min-height: 100%;
  padding: 0px 18px 110px;
  position: relative;
}

.title {
  text-align: center;
 font-size: 24px;
  font-weight: 700;
  line-height: 1.1;
  margin: 0px 0 18px;
}

/* ===== FORM ===== */
.form {
  margin-top: 6px;
}

.field {
  display: block;
  margin: 14px 0;
}

.label {
  font-size: 16px;
  font-weight: 500;
  opacity: 0.9;
  margin-bottom: 8px;
}

.input {
  width: 100%;
  height: 44px;
  border-radius: 10px;
  border: 2px solid rgba(0, 0, 0, 0.12);
  background: #ffffff;
  padding: 0 14px;
  font-size: 16px;
  outline: none;
}

.select {
  appearance: none;
  background-image:
    linear-gradient(45deg, transparent 50%, rgba(0, 0, 0, 0.55) 50%),
    linear-gradient(135deg, rgba(0, 0, 0, 0.55) 50%, transparent 50%);
  background-position: calc(100% - 18px) 18px, calc(100% - 12px) 18px;
  background-size: 6px 6px, 6px 6px;
  background-repeat: no-repeat;
}

.file-row {
  position: relative;
}

.file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.file-fake {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 12px;
}

.file-name.placeholder {
  opacity: 0.45;
}

.chev {
  opacity: 0.55;
  font-size: 18px;
}

.actions {
  margin-top: 22px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 0 10px;
}

.btn {
  height: 56px;
  border-radius: 10px;
  border: none;
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.18);
}

.btn.ghost {
  background: #ffffff;
  color: rgba(86, 126, 168, 1);
  border: 2px solid rgba(86, 126, 168, 0.25);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.14);
  
}

.btn.ghost:active{
  background:  #F1F7FF;;
  transform: translateY(1px);
}
.btn.primary:active{
  background: #2A5481;
  transform: translateY(1px);
}
.btn.primary {
  background: #567ea8;
  color: #ffffff;
}

.btn.primary.disabled {
  opacity: 0.55;
}

/* ===== LOADING ===== */
.loading-screen {
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spinner {
  margin-top: 46px;
  width: 56px;
  height: 56px;
  border-radius: 999px;
  border: 6px solid rgba(86, 126, 168, 0.2);
  border-top-color: rgba(86, 126, 168, 1);
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin-top: 16px;
  font-size: 18px;
  opacity: 0.75;
}

/* ===== SENT ===== */
.sent-screen {
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.mail{
  margin-top: 20px;
}
.sent-text {
  text-align: center;
  font-size: 20px;
  line-height: 1.35;
  margin-top: 22px;
  font-weight: 500;
}

/* ===== REVIEWED ===== */
.reviewed-screen {
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.reviewed-text {
  margin-top: 10px;
  text-align: center;
  font-size: 20px;
  line-height: 1.35;
}

.download-link {
  margin-top: 14px;
  font-size: 20px;
  text-decoration: underline;
  color: #2a5481;
  font-weight: 500;
  cursor: pointer;
}

.btn.send-office {
  margin-top: 22px;
  width: 260px;
  height: 56px;
  border-radius: 10px;
  border: none;
  background: #567ea8;
  color: #fff;
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.18);
}

.back-to-form {
  margin-top: 18px;
  border: none;
  background: transparent;
  font-weight: 800;
  cursor: pointer;
  color:#2a5481;
}
.btn.send-office:active{
  background: #2A5481;
  transform: translateY(1px);
}


</style>
