import { defineStore } from 'pinia'
import { APP_DEFAULTS } from '@/data/semestersData'

export const useGoalsStore = defineStore('goals', {
    state: () => ({
        currentSemester: APP_DEFAULTS.currentSemester,
        creditsPerSemester: APP_DEFAULTS.creditsPerSemester,
        targetGrade: APP_DEFAULTS.defaultTargetGrade,
    }),

    actions: {
        loadFromStorage() {
            const raw = localStorage.getItem('goals')
            if (!raw) return
            try {
                const parsed = JSON.parse(raw)
                if (parsed.currentSemester != null) this.currentSemester = parsed.currentSemester
                if (parsed.creditsPerSemester != null) this.creditsPerSemester = parsed.creditsPerSemester
                if (parsed.targetGrade != null) this.targetGrade = parsed.targetGrade
            } catch {

            }
        },

        persist() {
            localStorage.setItem('goals', JSON.stringify({
                currentSemester: this.currentSemester,
                creditsPerSemester: this.creditsPerSemester,
                targetGrade: this.targetGrade,
            }))
        },

        setTargetGrade(v) {
            this.targetGrade = v
            this.persist()
        },

        setCreditsPerSemester(v) {
            this.creditsPerSemester = v
            this.persist()
        },

        setCurrentSemester(v) {
            this.currentSemester = v
            this.persist()
        },
    },
})