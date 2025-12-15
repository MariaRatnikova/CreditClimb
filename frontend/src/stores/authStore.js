import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    role: null,          // 'tutor' | 'bafoeg' | 'student'
    isAuthenticated: false,
  }),
  actions: {
    loadFromStorage() {
      const role = localStorage.getItem('role')
      if (role) {
        this.role = role
        this.isAuthenticated = true
      }
    },
    // später: nach Login vom Backend setzen
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
