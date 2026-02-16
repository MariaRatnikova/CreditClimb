import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'

/**
 * Globales Vuetify Theme (Single Source of Truth):
 * - colors: zentrale Farben (werden zu --v-theme-... CSS Variablen)
 * - defaults: globale Standard-Props für Vuetify Komponenten
 */
export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#1c3d65',
          secondary: '#93b0d3',
          background: '#ffffff',
          surface: '#f1f7ff',
        },
      },
    },
  },

  icons: {
    defaultSet: 'mdi',
  },

  defaults: {
    VApp: {
      style: { fontFamily: 'Nunito, sans-serif' },
    },

    // Top Bar global
    VAppBar: {
      color: 'background',
      elevation: 0,
      density: 'default',
      height: 70,
    },

    // Standard UI
    VCard: {
      rounded: 'lg',
      elevation: 0,
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      rounded: 'lg',
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
      rounded: 'lg',
    },
    VBtn: {
      rounded: 'lg',
    },
  },
})
