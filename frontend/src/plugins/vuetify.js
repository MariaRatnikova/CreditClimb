import 'vuetify/styles'
import { createVuetify } from 'vuetify'


/**
 * Vuetify Plugin-Konfiguration.
 *
 * Aktuell minimal gehalten (Default Light Theme).
 * Später könnten hier globale Defaults (z. B. Button Styles), Icons,
 * oder Theme-Farben zentral gepflegt werden.
 */
export default createVuetify({
  theme: {
    defaultTheme: 'light',
  },
})
