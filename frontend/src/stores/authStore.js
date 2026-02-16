import { defineStore } from 'pinia'


/**
 * Auth/Session Store (Pinia, Options API).
 *
 * Zweck:
 * - Speichert Rolle + Auth-Status zentral (tutor/bafoeg/student)
 * - Ermöglicht Role-Gating über Router Guard und RoleGateView
 * - Persistiert Session minimal via localStorage, da es kein backend gibt
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    role: null,          //erwartet: 'tutor' | 'bafoeg' | 'student'
    isAuthenticated: false,
  }),
  actions: {
    /**
     * Lädt eine vorhandene Session aus localStorage.
     * Wird im Router-Guard/RoleGate genutzt, damit ein Refresh nicht „ausloggt“.
     */
    loadFromStorage() {
      const role = localStorage.getItem('role')
      if (role) {
        this.role = role
        this.isAuthenticated = true
      }
    },
    
    /**
     * Setzt die Session (aktuell „Mock-Login“).
     */
    setSession({ role }) {
      this.role = role
      this.isAuthenticated = true
      localStorage.setItem('role', role)
    },
    logout() {
      this.role = null
      this.isAuthenticated = false
      localStorage.removeItem('role')
    },
  },
})
