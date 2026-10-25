<script setup lang="ts">
import { computed, ref } from 'vue'

interface CalendarDay {
  date: Date
  day: number
  key: string
  isCurrentMonth: boolean
  isSelected: boolean
}

const weekdays = [
  'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс',
]

const currentMonth = ref(new Date(2023, 11, 1))
const selectedDate = ref(new Date(2023, 11, 15))

const monthTitle = computed(() => {
  const formatter = new Intl.DateTimeFormat('ru-RU', {
    month: 'long',
    year: 'numeric',
  })

  const title = formatter.format(currentMonth.value)

  return title.charAt(0).toUpperCase() + title.slice(1)
})

const calendarDays = computed<CalendarDay[]>(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()

  const firstDay = new Date(year, month, 1)

  // Приводим нумерацию дней недели к формату:
  // понедельник = 0, воскресенье = 6.
  const startOffset = (firstDay.getDay() + 6) % 7

  const daysInMonth = new Date(
    year,
    month + 1,
    0,
  ).getDate()

  const totalCells = Math.ceil(
    (startOffset + daysInMonth) / 7,
  ) * 7

  const result: CalendarDay[] = []

  for (let i = 0; i < totalCells; i++) {
    const date = new Date(
      year,
      month,
      i - startOffset + 1,
    )

    result.push({
      date,
      day: date.getDate(),
      key: [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
      ].join('-'),
      isCurrentMonth: date.getMonth() === month,
      isSelected: isSameDate(date, selectedDate.value),
    })
  }

  return result
})

function isSameDate(first: Date, second: Date): boolean {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  )
}

function changeMonth(offset: number): void {
  currentMonth.value = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() + offset,
    1,
  )
}

function selectDate(date: Date): void {
  selectedDate.value = date

  currentMonth.value = new Date(
    date.getFullYear(),
    date.getMonth(),
    1,
  )
}
</script>

<template>
  <section class="booking-calendar" aria-label="Календарь бронирования">
    <div class="booking-calendar__header">
      <h2>{{ monthTitle }}</h2>

      <div class="booking-calendar__navigation">
        <button
          type="button"
          aria-label="Предыдущий месяц"
          @click="changeMonth(-1)"
        >
          ‹
        </button>

        <button
          type="button"
          aria-label="Следующий месяц"
          @click="changeMonth(1)"
        >
          ›
        </button>
      </div>
    </div>

    <div class="booking-calendar__grid">
      <span
        v-for="weekday in weekdays"
        :key="weekday"
        class="booking-calendar__weekday"
      >
        {{ weekday }}
      </span>

      <button
        v-for="day in calendarDays"
        :key="day.key"
        type="button"
        class="booking-calendar__day"
        :class="{
          'booking-calendar__day--outside': !day.isCurrentMonth,
          'booking-calendar__day--selected': day.isSelected,
        }"
        :aria-label="new Intl.DateTimeFormat('ru-RU', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }).format(day.date)"
        :aria-pressed="day.isSelected"
        @click="selectDate(day.date)"
      >
        {{ day.day }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.booking-calendar {
  width: 100%;
}

.booking-calendar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
}

.booking-calendar__header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  line-height: 1.3;
}

.booking-calendar__navigation {
  display: flex;
  gap: 6px;
}

.booking-calendar__navigation button {
  width: 30px;
  height: 30px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-small);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 24px;
  line-height: 1;
}

.booking-calendar__navigation button:hover {
  background: var(--color-surface-secondary);
}

.booking-calendar__grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 4px;
}

.booking-calendar__weekday {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.booking-calendar__day {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  height: 36px;
  padding: 0;

  border: 0;
  border-radius: var(--radius-small);
  background: transparent;

  color: var(--color-text);
  font-size: 14px;
}

.booking-calendar__day:hover {
  background: var(--color-surface-secondary);
}

.booking-calendar__day--outside {
  color: #aaaaaa;
}

.booking-calendar__day--selected,
.booking-calendar__day--selected:hover {
  background: var(--color-primary);
  color: white;
}
</style>
