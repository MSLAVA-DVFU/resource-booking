<script setup lang="ts">
import { ref } from 'vue'
import { spaces as initialSpaces } from '~/data/spaces'
import type { Space, TimeSlot } from '~/data/spaces'

type BookingMode = 'existing' | 'new'

interface BookingSelection {
  space: Space
  slots: TimeSlot[]
}

interface BookingFormData {
  spaceId: number
  mode: BookingMode
  event: string
  slotIds: string[]
  responsiblePersons: string[]
  comment: string
}

const spaces = ref<Space[]>(
  initialSpaces.map(space => ({
    ...space,
    equipment: [...space.equipment],
    timeSlots: space.timeSlots.map(slot => ({ ...slot })),
  })),
)

const availableEvents = ref<string[]>([
  'Рабочая встреча',
  'Совещание',
  'Презентация проекта',
])

const bookingSelection = ref<BookingSelection | null>(null)
const bookingModalOpen = ref(false)
const errorModalOpen = ref(false)
const message = ref('')

function handleBooking(
  space: Space,
  selectedSlots: TimeSlot[],
): void {
  const availableSlots = selectedSlots.filter(
    slot => !slot.occupied,
  )

  if (availableSlots.length === 0) return

  bookingSelection.value = {
    space,
    slots: [...availableSlots],
  }

  message.value = ''
  bookingModalOpen.value = true
}

function closeBookingModal(): void {
  bookingModalOpen.value = false
  bookingSelection.value = null
}

function submitBooking(data: BookingFormData): void {
  const space = spaces.value.find(
    item => item.id === data.spaceId,
  )

  if (!space) {
    showBookingError()
    return
  }

  const selectedSlots = space.timeSlots.filter(
    slot => data.slotIds.includes(slot.id),
  )

  // Проверяем, что все интервалы существуют,
  // свободны и не повторяются.
  const uniqueIds = new Set(data.slotIds)

  const invalidSelection =
    uniqueIds.size === 0 ||
    uniqueIds.size !== data.slotIds.length ||
    selectedSlots.length !== data.slotIds.length ||
    selectedSlots.some(slot => slot.occupied)

  if (invalidSelection) {
    showBookingError()
    return
  }

  if (
    data.mode === 'new' &&
    !availableEvents.value.includes(data.event)
  ) {
    availableEvents.value.push(data.event)
  }

  // Обновляем локальное состояние помещения.
  // После бронирования часы становятся занятыми.
  selectedSlots.forEach((slot) => {
    slot.occupied = true
  })

  message.value =
    `Демонстрационное бронирование «${data.event}» ` +
    `для помещения «${space.name}» выполнено. ` +
    `Интервалов: ${data.slotIds.length}.`

  bookingModalOpen.value = false
  bookingSelection.value = null
}

function showBookingError(): void {
  bookingModalOpen.value = false
  bookingSelection.value = null
  errorModalOpen.value = true
}

function closeErrorModal(): void {
  errorModalOpen.value = false
}

function closeMessage(): void {
  message.value = ''
}
</script>

<template>
  <section class="spaces-page">
    <div
      v-if="message"
      class="spaces-page__notice"
      role="status"
    >
      <p>{{ message }}</p>

      <button
        type="button"
        class="spaces-page__notice-close"
        aria-label="Закрыть уведомление"
        @click="closeMessage"
      >
        ×
      </button>
    </div>

    <div class="spaces-page__list">
      <CardsSpaceCard
        v-for="space in spaces"
        :key="space.id"
        :space="space"
        @book="handleBooking"
      />
    </div>

    <ModalsBookingModal
      :open="bookingModalOpen"
      :space="bookingSelection?.space ?? null"
      :initial-slots="bookingSelection?.slots ?? []"
      :events="availableEvents"
      @close="closeBookingModal"
      @submit="submitBooking"
    />

    <ModalsErrorModal
      :open="errorModalOpen"
      @close="closeErrorModal"
    />
  </section>
</template>

<style scoped>
.spaces-page {
  width: 100%;
  min-width: 0;
}

.spaces-page__list {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.spaces-page__notice {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  margin-bottom: 24px;
  padding: 16px 20px;

  border: 1px solid #c9dfda;
  border-radius: var(--radius-medium);
  background: #e9f3f0;
  color: var(--color-primary);
}

.spaces-page__notice strong {
  display: block;
  margin-bottom: 8px;
  font-size: 16px;
}

.spaces-page__notice p {
  margin: 0 0 4px;
  font-size: 14px;
  line-height: 1.5;
}

.spaces-page__notice-description {
  opacity: 0.8;
}

.spaces-page__notice-close {
  border: none;
  background: transparent;
  color: var(--color-primary);
  font-size: 24px;
  cursor: pointer;
}

@media (max-width: 480px) {
  .spaces-page__toolbar {
    flex-direction: column;
    align-items: stretch;
  }
}


@media (max-width: 768px) {
  .spaces-page__list {
    gap: 20px;
  }
}
</style>
