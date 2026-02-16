<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import MobileShell from '@/components/layout/MobileShell.vue'
import StudentListItem from '@/components/common/StudentListItem.vue'
import { useBafoegApplications } from '@/data/bafoegApplicationsStore'

const router = useRouter()
const store = useBafoegApplications()
const list = computed(() => store.visibleList.value ?? [])

const menuOpen = ref(false)

function fmtTime(d) {
  if (!d) return ''    
  const date = d instanceof Date ? d : new Date(d)
  if (Number.isNaN(date.getTime())) return ''
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}


function openStudent(student) {
  store.markSeen(student.id)
  router.push(`/bafoeg/student/${student.id}`)
}

function setSort(mode) {
  store.sortMode.value = mode
  menuOpen.value = false
}

function toggleNewOnly() {
  store.newOnly.value = !store.newOnly.value
  menuOpen.value = false
}

const sortItems = [
  { title: 'Latest', value: 'latest' },
  { title: 'A–Z', value: 'az' },
  { title: 'New only', value: 'newOnly' },
]

const sortModel = computed({
  get() {
    if (store.newOnly.value) return 'newOnly'
    return store.sortMode.value
  },
  set(v) {
    if (v === 'newOnly') {
      store.newOnly.value = true
      store.sortMode.value = 'latest'
    } else {
      store.newOnly.value = false
      store.sortMode.value = v
    }
  },
})

</script>

<template>
  <MobileShell base="/bafoeg" title="Applications">
    <div class="page">
      <div class="header-row">
        <div class="sort">
          <v-select
            v-model="sortModel"
            :items="sortItems"
            item-title="title"
            item-value="value"
            label="sort"
            hide-details
            density="comfortable"
            class="mb-2"
            style="min-width: max-content;"
          />
        </div>
      </div>

      <div class="list">
        <StudentListItem
          v-for="s in list" 
          :key="s.id"
          :student="s"
          :rightTop="fmtTime(s.requestedAt)"
          :rightBottom="s.university"
          :showDot="!store.isSeen(s.id) && !store.isApproved(s.id)"
          @select="openStudent"
        />
      </div>
    </div>
  </MobileShell>
</template>

<style scoped>
.page{
  padding: 10px 16px 90px;
  background: #ffffff;
  min-height: 100%;
}

.header-row{
  display:flex;
  align-items:center;
  justify-content: space-between;
  margin: 6px 0 10px;
}

.title{
  font-size: 18px;
  font-weight: 800;
}

.sort-btn{

  background: transparent;
  font-weight: 700;
  cursor: pointer;
  opacity: 0.85;
}

.chev{ margin-left: 6px; }

.menu-item{
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
}
.menu-item:hover{
  background: rgba(0,0,0,0.06);
}
.muted{
  opacity: 0.6;
  margin-left: 6px;
}
</style>
