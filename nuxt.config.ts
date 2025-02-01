// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: {
    compatibilityVersion: 4,
  },
  imports: { autoImport: false },
  components: { dirs: [] },
  devtools: { enabled: true },
  modules: ['@nuxthub/core', '@nuxtjs/tailwindcss'],
  hub: {
    ai: true,
    blob: true,
  },
})