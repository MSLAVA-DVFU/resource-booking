<script setup lang="ts">
import { computed, ref } from 'vue'
import { people } from '~/data/people'
import type { Person } from '~/data/people'

const searchQuery = ref('')
const sortOrder = ref('default')
const invitedPerson = ref<Person | null>(null)

const filteredPeople = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase('ru-RU')

  const result = people.filter((person) => {
    const searchableText = [
      person.name,
      person.profession,
      person.description,
    ].join(' ').toLocaleLowerCase('ru-RU')

    return searchableText.includes(query)
  })

  if (sortOrder.value === 'name-asc') {
    return [...result].sort((a, b) =>
      a.name.localeCompare(b.name, 'ru-RU'),
    )
  }

  if (sortOrder.value === 'name-desc') {
    return [...result].sort((a, b) =>
      b.name.localeCompare(a.name, 'ru-RU'),
    )
  }

  return result
})

function handleInvite(person: Person): void {
  invitedPerson.value = person
}

function closeNotice(): void {
  invitedPerson.value = null
}
</script>

<template>
  <section class="people-page">
    <div class="people-page__toolbar">
      <label class="people-page__search">
        <span class="visually-hidden">
          Поиск специалистов
        </span>

        <input
          v-model="searchQuery"
          type="search"
          placeholder="Поиск"
        />

        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m16 16 5 5" />
        </svg>
      </label>

      <label class="people-page__sort">
        <span class="visually-hidden">
          Сортировка специалистов
        </span>

        <select v-model="sortOrder">
          <option value="default">По умолчанию</option>
          <option value="name-asc">По алфавиту: А–Я</option>
          <option value="name-desc">По алфавиту: Я–А</option>
        </select>
      </label>
    </div>

    <div
      v-if="invitedPerson"
      class="people-page__notice"
      role="status"
    >
      <span>
        Выбран специалист:
        <strong>{{ invitedPerson.name }}</strong>.
        Форма приглашения будет добавлена позднее.
      </span>

      <button
        type="button"
        aria-label="Закрыть уведомление"
        @click="closeNotice"
      >
        ×
      </button>
    </div>

    <div
      v-if="filteredPeople.length > 0"
      class="people-page__grid"
    >
      <CardsPersonCard
        v-for="person in filteredPeople"
        :key="person.id"
        :person="person"
        @invite="handleInvite"
      />
    </div>

    <div
      v-else
      class="people-page__empty"
    >
      <h2>Специалисты не найдены</h2>
      <p>Попробуйте изменить поисковый запрос.</p>

      <button
        type="button"
        @click="searchQuery = ''"
      >
        Сбросить поиск
      </button>
    </div>
  </section>
</template>

<style scoped>
.people-page {
  width: 100%;
}

.people-page__toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 22px;
}

.people-page__search {
  position: relative;
  display: block;
  width: 220px;
  max-width: 100%;
}

.people-page__search input {
  width: 100%;
  height: 40px;
  padding: 8px 40px 8px 14px;

  border: 1px solid transparent;
  border-radius: var(--radius-medium);

  background: var(--color-surface-secondary);
  color: var(--color-text);
  font-size: 14px;
}

.people-page__search svg {
  position: absolute;
  top: 10px;
  right: 12px;
  width: 20px;
  height: 20px;
  pointer-events: none;
}

.people-page__sort select {
  min-width: 185px;
  height: 40px;
  padding: 8px 14px;

  border: 1px solid transparent;
  border-radius: var(--radius-medium);

  background: var(--color-surface-secondary);
  color: var(--color-text);
  font-size: 14px;
  cursor: pointer;
}

.people-page__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: start;
  gap: 18px;
}

.people-page__notice {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  margin-bottom: 20px;
  padding: 14px 16px;

  border-radius: var(--radius-medium);
  background: #e9f3f0;

  color: var(--color-primary);
  font-size: 14px;
}

.people-page__notice button {
  flex-shrink: 0;
  border: none;
  background: transparent;
  color: inherit;
  font-size: 24px;
}

.people-page__empty {
  padding: 60px 20px;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-large);
  text-align: center;
}

.people-page__empty h2 {
  font-size: 20px;
}

.people-page__empty p {
  color: var(--color-text-secondary);
}

.people-page__empty button {
  padding: 10px 20px;
  border: none;
  border-radius: var(--radius-small);
  background: var(--color-primary);
  color: white;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 1400px) {
  .people-page__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .people-page__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 650px) {
  .people-page__grid {
    grid-template-columns: 1fr;
  }

  .people-page__toolbar {
    flex-wrap: wrap;
  }

  .people-page__search {
    flex: 1 1 180px;
  }

  .people-page__sort {
    flex: 1 1 180px;
  }

  .people-page__sort select {
    width: 100%;
    min-width: 0;
  }
}
</style>
