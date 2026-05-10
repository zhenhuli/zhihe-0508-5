export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2026-05-10',
  typescript: {
    strict: true
  },
  nitro: {
    devServer: {
      port: process.env.PORT ? Number(process.env.PORT) : 3000,
      host: '0.0.0.0'
    }
  }
})
