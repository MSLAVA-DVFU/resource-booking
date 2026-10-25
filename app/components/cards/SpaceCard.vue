<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Space, TimeSlot } from '~/data/spaces'

const { assetPath } = useAssetPath()

const props = defineProps<{
  space: Space
}>()

const emit = defineEmits<{
  book: [space: Space, slots: TimeSlot[]]
}>()

const selectedSlotIds = ref<string[]>([])
const isExpanded = ref(false)

const selectedSlots = computed(() => {
  return props.space.timeSlots.filter(
    slot =>
      !slot.occupied &&
      selectedSlotIds.value.includes(slot.id),
  )
})

function selectSlot(slot: TimeSlot): void {
  // Занятые интервалы не выбираются.
  if (slot.occupied) return

  if (selectedSlotIds.value.includes(slot.id)) {
    selectedSlotIds.value = selectedSlotIds.value.filter(
      id => id !== slot.id,
    )
  } else {
    selectedSlotIds.value = [
      ...selectedSlotIds.value,
      slot.id,
    ]
  }
}

watch(
  () => props.space.timeSlots.map(
    slot => ({
      id: slot.id,
      occupied: slot.occupied,
    }),
  ),
  (slots) => {
    const availableIds = new Set(
      slots
        .filter(slot => !slot.occupied)
        .map(slot => slot.id),
    )

    selectedSlotIds.value = selectedSlotIds.value.filter(
      id => availableIds.has(id),
    )
  },
)

function bookSpace(): void {
  if (selectedSlots.value.length === 0) return

  emit('book', props.space, selectedSlots.value)
}

function toggleDetails(): void {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <article class="space-card">
    <div class="space-card__image-wrapper">
      <img
        class="space-card__image"
        :src="assetPath(space.image)"
        :alt="space.name"
        loading="lazy"
      />

      <div class="space-card__image-tabs">
        <span class="space-card__image-tab">
          Фото
        </span>

        <button
          type="button"
          class="space-card__image-tab"
          :aria-expanded="isExpanded"
          @click="toggleDetails"
        >
          Информация
        </button>
      </div>

      <h2 class="space-card__title">
        {{ space.name }}
      </h2>
    </div>

    <div class="space-card__booking">
      <div
        class="space-card__slots"
        role="group"
        :aria-label="`Выбор времени: ${space.name}`"
      >
        <button
          v-for="slot in space.timeSlots"
          :key="slot.id"
          type="button"
          class="space-card__slot"
          :class="{
            'space-card__slot--occupied': slot.occupied,
            'space-card__slot--selected':
              !slot.occupied && selectedSlotIds.includes(slot.id),
          }"
          :disabled="slot.occupied"
          :aria-pressed="
            slot.occupied
              ? undefined
              : selectedSlotIds.includes(slot.id)
          "
          :aria-label="
            `${slot.start} – ${slot.end}` +
            (slot.occupied ? ', занято' : ', доступно')
          "
          @click="selectSlot(slot)"
        >
          {{ slot.start }} – {{ slot.end }}
        </button>
      </div>

      <div class="space-card__actions">
        <button
          type="button"
          class="space-card__button space-card__button--primary"
          :disabled="selectedSlots.length === 0"
          @click="bookSpace"
        >
          Забронировать
        </button>

        <button
          type="button"
          class="space-card__button space-card__button--secondary"
          :aria-expanded="isExpanded"
          @click="toggleDetails"
        >
          {{ isExpanded ? 'Скрыть' : 'Подробнее' }}
        </button>
      </div>
    </div>

    <div
      v-if="isExpanded"
      class="space-card__details"
    >
      <h3>Информация о помещении</h3>

      <p>{{ space.description }}</p>

      <p>
        <strong>Вместимость:</strong>
        {{ space.capacity }} человек
      </p>

      <p>
        <strong>Оборудование:</strong>
        {{ space.equipment.join(', ') }}
      </p>
    </div>
  </article>
</template>

<style scoped>
.space-card {
  min-width: 0;
  overflow: hidden;
  border-radius: var(--radius-medium);
  background: var(--color-surface-secondary);
}

/* Фотография */

.space-card__image-wrapper {
  position: relative;
  height: 245px;
  overflow: hidden;
}

.space-card__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.space-card__image-tabs {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 12px;
}

.space-card__image-tab {
  display: flex;
  align-items: center;
  justify-content: center;

  min-height: 30px;
  padding: 6px 16px;

  border: none;
  border-radius: var(--radius-small);
  background: white;
  color: var(--color-text);

  font-size: 12px;
  font-weight: 500;
}

button.space-card__image-tab:hover {
  background: #edf4f2;
}

.space-card__title {
  position: absolute;
  bottom: 12px;
  left: 12px;
  max-width: calc(100% - 24px);

  margin: 0;
  padding: 8px 16px;

  border-radius: var(--radius-small);
  background: white;

  color: var(--color-text);
  font-size: 18px;
  font-weight: 600;
}

/* Временные интервалы и кнопки */

.space-card__booking {
  display: grid;
  grid-template-columns:  minmax(0, 1fr) 204px;
  align-items: stretch;
  gap: 14px;
  padding: 12px;
}

.space-card__slots {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
}

/* Доступный интервал */

.space-card__slot {
  min-width: 0;
  min-height: 34px;
  padding: 6px 3px;

  border: 1px solid transparent;
  border-radius: var(--radius-small);

  background: #dce9e7;
  color: #24453e;

  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;

  cursor: pointer;
}

/* Наведение только на свободные интервалы */

.space-card__slot:hover:not(:disabled) {
  background: #bed9d4;
}

/* Занятый интервал */

.space-card__slot--occupied,
.space-card__slot--occupied:hover {
  background: #315a52;
  color: white;
  cursor: not-allowed;
  opacity: 1;
}

/* Выбранный свободный интервал */

.space-card__slot--selected,
.space-card__slot--selected:hover:not(:disabled) {
  background: var(--color-accent);
  border-color: var(--color-primary);
  color: white;
  font-weight: 700;
}

.space-card__actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.space-card__actions .space-card__button {
  flex: 1;
  width: 100%;
}

.space-card__button {
  min-height: 34px;
  padding: 7px 6px;

  border: none;
  border-radius: var(--radius-small);
  font-size: 12px;
  font-weight: 600;
}

.space-card__button--primary {
  background: var(--color-primary);
  color: white;
}

.space-card__button--primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.space-card__button--primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.space-card__button--secondary {
  background: white;
  color: var(--color-text);
  box-shadow: var(--shadow-card);
}

.space-card__button--secondary:hover {
  background: #f8f8f8;
}

/* Дополнительная информация */

.space-card__details {
  margin: 0 12px 12px;
  padding: 16px;
  border-radius: var(--radius-small);
  background: white;
}

.space-card__details h3 {
  margin-bottom: 12px;
  font-size: 16px;
}

.space-card__details p {
  margin-bottom: 8px;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.space-card__details p:last-child {
  margin-bottom: 0;
}

/* Базовая адаптивность */
@media (max-width: 1050px) {
  .space-card__slots {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .space-card__slots {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
}

@media (max-width: 580px) {
  .space-card__image-wrapper {
    height: 200px;
  }

  .space-card__slots {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .space-card__title {
    font-size: 15px;
  }
}

@media (max-width: 360px) {
  .space-card__slots {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 580px) {
  .space-card__booking {
    grid-template-columns: minmax(0, 1fr) 110px;
    gap: 8px;
    padding: 8px;
  }

  .space-card__actions {
    gap: 6px;
  }

  .space-card__button {
    font-size: 11px;
    padding: 6px 4px;
  }
}

@media (max-width: 380px) {
  .space-card__booking {
    grid-template-columns: 1fr;
  }

  .space-card__actions {
    flex-direction: row;
  }
}
</style>
