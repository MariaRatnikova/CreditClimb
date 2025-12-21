import { createApp } from 'vue'
import App from './App.vue'

import vuetify from './plugins/vuetify'
import router from './router'

import { createPinia } from 'pinia'

/**
 * Entry-Point der Anwendung.
 * - Vuetify: UI-Komponenten/Design-System
 * - Pinia: globaler State (z. B. Auth/Rolle)
 * - Vue Router: Navigation zwischen Views
 *
 **/
const pinia = createPinia()

createApp(App)
  .use(vuetify)
  .use(pinia)
  .use(router)
  .mount('#app')
