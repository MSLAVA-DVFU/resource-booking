export default defineNuxtConfig({
  compatibilityDate: '2026-07-01',

  // Клиентское приложение для статического хостинга
  ssr: false,

  devtools: {
    enabled: true,
  },

  css: [
    '~/assets/css/variables.css',
    '~/assets/css/main.css',
  ],

  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',

    head: {
      title: 'Сервис бронирования ресурсов',
      htmlAttrs: {
        lang: 'ru',
      },
      meta: [
        {
          name: 'description',
          content: 'Интерфейс сервиса бронирования ресурсов',
        },
      ],
    },
  },

  nitro: {
    prerender: {
      routes: [
        '/',
        '/login',
        '/people',
        '/spaces',
        '/equipment',
        '/profile',
      ],
    },
  },
})
