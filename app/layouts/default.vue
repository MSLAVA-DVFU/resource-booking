<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()
const config = useRuntimeConfig()

const showSidebar = computed(() => {
  const baseURL = config.app.baseURL

  let path = route.path

  // Убираем базовый путь GitHub Pages, если он есть.
  if (baseURL !== '/' && path.startsWith(baseURL)) {
    path = '/' + path.slice(baseURL.length)
  }

  // Убираем завершающий слеш.
  path = path.replace(/\/+$/, '') || '/'

  return ['/people', '/spaces'].includes(path)
})
</script>

<template>
  <div class="app-layout">
    <header class="app-layout__header">
      <LayoutAppNavigation />
    </header>

    <div
      class="app-layout__container"
      :class="{
        'app-layout__container--sidebar': showSidebar,
      }"
    >
      <main class="app-layout__main">
        <slot />
      </main>

      <LayoutAppSidebar
        v-if="showSidebar"
        class="app-layout__sidebar"
      />
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  background: var(--color-background);
}

.app-layout__header {
  background: #f7f7f7;
}

.app-layout__container {
  width: min(100% - 48px, 1800px);
  margin: 0 auto;
  padding: 40px 0 60px;
}

.app-layout__container--sidebar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 400px;
  align-items: start;
  gap: 32px;
}

.app-layout__main {
  min-width: 0;
}

.app-layout__sidebar {
  min-width: 0;
  padding-left: 16px;
  border-left: 1px solid var(--color-border);
}

@media (max-width: 1100px) {
  .app-layout__container--sidebar {
    grid-template-columns: minmax(0, 1fr) 380px;
    gap: 20px;
  }

  .app-layout__sidebar {
    padding-left: 12px;
  }
}

@media (max-width: 768px) {
  .app-layout__container {
    width: calc(100% - 32px);
    padding: 24px 0;
  }

  .app-layout__container--sidebar {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .app-layout__sidebar {
    padding: 24px 0 0;
    border-left: none;
    border-top: 1px solid var(--color-border);
  }
}
</style>
