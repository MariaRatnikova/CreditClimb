<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import MobileShell from '@/components/layout/MobileShell.vue'
import StudentListItem from '@/components/common/StudentListItem.vue'
import { mockStudents } from '@/data/mockStudents'
import { useTutorGroups } from '@/data/tutorGroupsStore'

const router = useRouter()
const groupStore = useTutorGroups()

const dialog = ref(false)
const newGroupName = ref('')
const selectedToAdd = ref([])

const studentItems = computed(() =>
  mockStudents.map(s => ({ title: `${s.name} (${s.id})`, value: s.id }))
)

function openStudent(s) {
  router.push(`/tutor/student/${s.id}`)
}

function openCreate() {
  newGroupName.value = ''
  selectedToAdd.value = []
  dialog.value = true
}

function create() {
  const name = newGroupName.value.trim()
  if (!name) return
  groupStore.createGroup(name, selectedToAdd.value)
  dialog.value = false
}

const selectedGroupIdModel = computed({
  get: () => groupStore.selectedGroupId.value,
  set: (v) => (groupStore.selectedGroupId.value = v),
})

const students = computed(() => groupStore.selectedStudents.value ?? [])
const groupOptions = computed(() => groupStore.groupOptions.value ?? [])


</script>

<template>
  <MobileShell base="/tutor" title="My Groups">
    <div class="page">
      <div class="top-row">
        <v-btn icon="mdi-plus" variant="text" @click="openCreate" />

        <div class="spacer"></div>

        <v-select
          v-model="selectedGroupIdModel"
          :items="groupOptions"
          item-title="title"
          item-value="value"
          hide-details
          density="comfortable"
          style="max-width: 190px;"
        />
      </div>

      <div class="list mt-2">
        <StudentListItem
          v-for="s in students"
          :key="s.id"
          :student="s"
          @select="openStudent"
        />
      </div>
    </div>

    <!-- Dialog bleibt wie bei dir -->
    <v-dialog v-model="dialog" width="320">
      <v-card class="pa-4">
        <div class="text-subtitle-1 font-weight-bold mb-3">Create new folder</div>

        <v-text-field
          v-model="newGroupName"
          label="Create new folder"
          hide-details
          class="mb-3"
        />

        <v-select
          v-model="selectedToAdd"
          :items="studentItems"
          label="Choose students to add"
          multiple
          hide-details
          class="mb-4"
        />

        <div class="btn-row">
          <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="create">Create</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </MobileShell>
</template>


<style scoped>
.page{
  padding: 10px 16px 90px;
  background: #ffffff;
  min-height: 100%;
}
.top-row{
  display:flex;
  align-items:center;
  gap: 10px;
}
.spacer{ flex: 1; }
.btn-row{
  display:flex;
  justify-content:flex-end;
  gap: 10px;
}
</style>
