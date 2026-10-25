<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Space, TimeSlot } from '~/data/spaces'

type BookingMode = 'existing' | 'new'

interface BookingFormData {
  spaceId: number
  mode: BookingMode
  event: string
  slotIds: string[]
  responsiblePersons: string[]
  comment: string
}

const props = defineProps<{
  open: boolean
  space: Space | null
  initialSlots: TimeSlot[]
  events: string[]
}>()

const emit = defineEmits<{
  close: []
  submit: [data: BookingFormData]
}>()

const mode = ref<BookingMode>('existing')

const selectedEvent = ref('')
const newEventTitle = ref('')
const selectedSlotIds = ref<string[]>([])

const availablePersons = [
  'Иван Иванов',
  'Елена Иванова',
  'Анастасия Ремовизина',
]

const responsiblePersons = ref<string[]>([])
const showPersonSelector = ref(false)
const comment = ref('')
const validationError = ref('')

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return

    mode.value = 'existing'
    selectedEvent.value = ''
    newEventTitle.value = ''

    selectedSlotIds.value = props.initialSlots
      .filter(slot => !slot.occupied)
      .map(slot => slot.id)

    responsiblePersons.value = [
      'Иван Иванов',
      'Елена Иванова',
    ]

    showPersonSelector.value = false
    comment.value = ''
    validationError.value = ''
  },
)

function handleEventChange(): void {
  if (selectedEvent.value === '__new__') {
    switchToNew()
  }
}

function switchToNew(): void {
  mode.value = 'new'
  selectedEvent.value = ''
  validationError.value = ''
}

function switchToExisting(): void {
  mode.value = 'existing'
  validationError.value = ''
}

function togglePerson(name: string): void {
  if (responsiblePersons.value.includes(name)) {
    responsiblePersons.value =
      responsiblePersons.value.filter(
        person => person !== name,
      )
  } else {
    responsiblePersons.value = [
      ...responsiblePersons.value,
      name,
    ]
  }
}


function submitBooking(): void {
  validationError.value = ''

  if (!props.space) return

  const eventName = mode.value === 'new'
    ? newEventTitle.value.trim()
    : selectedEvent.value

  if (!eventName) {
    validationError.value = mode.value === 'new'
      ? 'Введите название мероприятия.'
      : 'Выберите мероприятие.'
    return
  }

  if (selectedSlotIds.value.length === 0) {
    validationError.value =
      'Выберите время мероприятия.'
    return
  }

  const uniqueIds = new Set(selectedSlotIds.value)

  const selectedSlots = props.space.timeSlots.filter(
    slot => uniqueIds.has(slot.id),
  )

  const invalidSelection =
    uniqueIds.size !== selectedSlotIds.value.length ||
    selectedSlots.length !== uniqueIds.size ||
    selectedSlots.some(slot => slot.occupied)

  if (invalidSelection) {
    validationError.value =
      'Некоторые интервалы недоступны. Измените выбор.'
    return
  }

  if (responsiblePersons.value.length === 0) {
    validationError.value =
      'Добавьте хотя бы одно ответственное лицо.'
    return
  }

  emit('submit', {
    spaceId: props.space.id,
    mode: mode.value,
    event: eventName,
    slotIds: [...selectedSlotIds.value],
    responsiblePersons: [...responsiblePersons.value],
    comment: comment.value.trim(),
  })
}
</script>

<template>
  <ModalsBaseModal
    :open="open"
    :title="mode === 'existing'
      ? 'Бронирование'
      : 'Новое мероприятие'"
    @close="emit('close')"
  >
    <form
      v-if="space"
      class="booking-form"
      @submit.prevent="submitBooking"
    >
      <!-- Выбор существующего мероприятия -->
      <div
        v-if="mode === 'existing'"
        class="booking-form__field"
      >
        <label for="booking-event">
          Мероприятие
        </label>

        <select
          id="booking-event"
          v-model="selectedEvent"
          @change="handleEventChange"
        >
          <option value="" disabled>
            Выберите мероприятие
          </option>

          <option
            v-for="event in events"
            :key="event"
            :value="event"
          >
            {{ event }}
          </option>

          <option disabled>
            ──────────────────
          </option>

          <option value="__new__">
            + Новое мероприятие
          </option>
        </select>
      </div>

      <!-- Создание нового мероприятия -->
      <div
        v-else
        class="booking-form__field"
      >
        <label for="booking-new-event">
          Название
        </label>

        <input
          id="booking-new-event"
          v-model="newEventTitle"
          type="text"
          maxlength="150"
          placeholder="Введите название мероприятия"
        />

        <button
          type="button"
          class="booking-form__back"
          @click="switchToExisting"
        >
          ← Выбрать существующее мероприятие
        </button>
      </div>

      <!-- Общие поля обоих режимов -->
      <div class="booking-form__field">
        <span class="booking-form__label">
          Выберите время мероприятия
        </span>

        <BookingTimeSlotPicker
          v-model="selectedSlotIds"
          :slots="space.timeSlots"
        />
      </div>

      <div class="booking-form__field">
        <span class="booking-form__label">
          Ответственные лица
        </span>

        <div class="booking-form__responsibles">
          <button
            v-for="person in responsiblePersons"
            :key="person"
            type="button"
            class="booking-form__person"
            :aria-label="`Убрать ${person}`"
            @click="togglePerson(person)"
          >
            {{ person }}
          </button>

          <button
            type="button"
            class="booking-form__add-person"
            aria-label="Добавить ответственное лицо"
            :aria-expanded="showPersonSelector"
            @click="showPersonSelector = !showPersonSelector"
          >
            +
          </button>
        </div>

        <div
          v-if="showPersonSelector"
          class="booking-form__person-selector"
        >
          <label
            v-for="person in availablePersons"
            :key="person"
          >
            <input
              type="checkbox"
              :checked="responsiblePersons.includes(person)"
              @change="togglePerson(person)"
            />
            {{ person }}
          </label>
        </div>
      </div>

      <div class="booking-form__field">
        <label for="booking-comment">
          Дополнительная информация
        </label>

        <textarea
          id="booking-comment"
          v-model="comment"
          rows="2"
          placeholder="Добавить комментарий"
        />
      </div>

      <p
        v-if="validationError"
        class="booking-form__error"
        role="alert"
      >
        {{ validationError }}
      </p>

      <div class="booking-form__actions">
        <button
          type="submit"
          class="booking-form__submit"
        >
          Забронировать
        </button>

        <button
          type="button"
          class="booking-form__cancel"
          @click="emit('close')"
        >
          Отмена
        </button>
      </div>
    </form>
  </ModalsBaseModal>
</template>

<style scoped>
.booking-form {
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.booking-form__field {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.booking-form__field label,
.booking-form__label {
  font-size: 16px;
  font-weight: 500;
}

.booking-form__field select,
.booking-form__field textarea {
  width: 100%;
  padding: 10px 0;

  border: none;
  border-bottom: 1px solid #777;
  border-radius: 0;
  background: transparent;

  color: var(--color-text);
  font-size: 17px;
}

.booking-form__field select:focus,
.booking-form__field textarea:focus {
  outline: none;
  border-bottom: 2px solid var(--color-primary);
}

.booking-form__field textarea {
  resize: vertical;
  min-height: 48px;
}

.booking-form__responsibles {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;

  padding-bottom: 10px;
  border-bottom: 1px solid #777;
}

.booking-form__person {
  min-height: 36px;
  padding: 7px 16px;

  border: none;
  border-radius: var(--radius-small);

  background: var(--color-accent);
  color: white;
  font-size: 14px;
  font-weight: 600;
}

.booking-form__add-person {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: var(--color-text);
  font-size: 27px;
}

.booking-form__person-selector {
  display: flex;
  flex-direction: column;
  gap: 10px;

  padding: 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-small);
}

.booking-form__person-selector label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.booking-form__error {
  margin: 0;
  color: var(--color-error);
  font-size: 14px;
}

.booking-form__actions {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(100px, 1fr);
  gap: 14px;
}

.booking-form__actions button {
  min-height: 52px;
  padding: 12px;

  border: none;
  border-radius: var(--radius-small);

  font-size: 18px;
  font-weight: 600;
}

.booking-form__submit {
  background: var(--color-primary);
  color: white;
}

.booking-form__submit:hover {
  background: var(--color-primary-hover);
}

.booking-form__cancel {
  background: white;
  color: var(--color-text);
  box-shadow: var(--shadow-card);
}

.booking-form__cancel:hover {
  background: var(--color-surface-secondary);
}


.booking-form__field input[type="text"] {
  width: 100%;
  padding: 10px 0;

  border: none;
  border-bottom: 1px solid #777;
  border-radius: 0;

  background: transparent;
  color: var(--color-text);
  font-size: 17px;
}

.booking-form__field input[type="text"]:focus {
  outline: none;
  border-bottom: 2px solid var(--color-primary);
}

.booking-form__back {
  align-self: flex-start;
  padding: 4px 0;

  border: none;
  background: transparent;
  color: var(--color-primary);

  font-size: 13px;
  text-align: left;
  text-decoration: underline;
}

.booking-form__back:hover {
  color: var(--color-primary-hover);
}


@media (max-width: 480px) {
  .booking-form {
    gap: 20px;
  }

  .booking-form__actions {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .booking-form__actions button {
    font-size: 14px;
  }
}
</style>
