<script setup lang="ts">
import { ref } from 'vue'
import type { Person } from '~/data/people'

const { assetPath } = useAssetPath()

const props = defineProps<{
  person: Person
}>()

const emit = defineEmits<{
  invite: [person: Person]
}>()

const isExpanded = ref(false)

function toggleDetails(): void {
  isExpanded.value = !isExpanded.value
}

function invitePerson(): void {
  emit('invite', props.person)
}
</script>

<template>
  <article class="person-card">
    <div class="person-card__image-wrapper">
      <img
        class="person-card__image"
        :src="assetPath(person.image)"
        :alt="person.name"
        loading="lazy"
      />

      <span class="person-card__profession">
        {{ person.profession }}
      </span>
    </div>

    <div class="person-card__content">
      <h3 class="person-card__name">
        {{ person.name }}
      </h3>

      <p class="person-card__description">
        {{ person.description }}
      </p>

      <p
        v-if="isExpanded"
        class="person-card__details"
      >
        {{ person.details }}
      </p>

      <div class="person-card__actions">
        <button
          type="button"
          class="person-card__button person-card__button--primary"
          @click="invitePerson"
        >
          Пригласить
        </button>

        <button
          type="button"
          class="person-card__button person-card__button--secondary"
          :aria-expanded="isExpanded"
          @click="toggleDetails"
        >
          {{ isExpanded ? 'Скрыть' : 'Подробнее' }}
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.person-card {
  display: flex;
  min-width: 0;
  height: 180px;

  overflow: hidden;
  border-radius: var(--radius-medium);
  background: var(--color-surface-secondary);
}

.person-card__image-wrapper {
  position: relative;
  flex: 0 0 28%;
  min-width: 0;
  height: 100%;
  overflow: hidden;
}

.person-card__image {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 160px;
  object-fit: cover;
  object-position: center;
}

.person-card__profession {
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;

  padding: 4px 6px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.85);

  color: var(--color-text);
  font-size: 11px;
  text-align: center;
}

.person-card__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  padding: 12px 14px;

  overflow-y: auto;
}

.person-card__name {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.2;
}

.person-card__description {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;

  margin: 0 0 12px;
  font-size: 12px;
  line-height: 1.45;
}

.person-card__details {
  margin: 0 0 12px;
  color: var(--color-text-secondary);
  font-size: 12px;
  line-height: 1.5;
}

.person-card__actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin-top: auto;
}

.person-card__button {
  min-height: 34px;
  padding: 7px 8px;

  border: 1px solid transparent;
  border-radius: var(--radius-small);

  font-size: 12px;
  font-weight: 500;
  transition:
    background-color 0.2s,
    box-shadow 0.2s;
}

.person-card__button--primary {
  background: var(--color-primary);
  color: white;
}

.person-card__button--primary:hover {
  background: var(--color-primary-hover);
}

.person-card__button--secondary {
  background: white;
  color: var(--color-text);
  box-shadow: var(--shadow-card);
}

.person-card__button--secondary:hover {
  background: #f8f8f8;
}

@media (max-width: 480px) {
  .person-card__image-wrapper {
    flex-basis: 32%;
  }

  .person-card__content {
    padding: 10px;
  }

  .person-card__name {
    font-size: 15px;
  }

  .person-card__actions {
    grid-template-columns: 1fr;
  }
}
</style>
