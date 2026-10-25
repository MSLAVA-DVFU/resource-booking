<script setup lang="ts">
import { computed } from 'vue'
import type { TimeSlot } from '~/data/spaces'

const props = defineProps<{
  slots: TimeSlot[]
  modelValue: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const selectedIds = computed(() => props.modelValue)

function toggleSlot(slot: TimeSlot): void {
  if (slot.occupied) return

  const next = selectedIds.value.includes(slot.id)
    ? selectedIds.value.filter(id => id !== slot.id)
    : [...selectedIds.value, slot.id]

  emit('update:modelValue', next)
}
</script>

<template>
  <div
    class="time-slot-picker"
    role="group"
    aria-label="Временные интервалы"
  >
    <button
      v-for="slot in slots"
      :key="slot.id"
      type="button"
      class="time-slot-picker__item"
      :class="{
        'time-slot-picker__item--occupied': slot.occupied,
        'time-slot-picker__item--selected':
          !slot.occupied && selectedIds.includes(slot.id),
      }"
      :disabled="slot.occupied"
      :aria-pressed="
        slot.occupied
          ? undefined
          : selectedIds.includes(slot.id)
      "
      :aria-label="
        `${slot.start} – ${slot.end}` +
        (slot.occupied ? ', занято' : ', доступно')
      "
      @click="toggleSlot(slot)"
    >
      {{ slot.start }} – {{ slot.end }}
    </button>
  </div>
</template>

<style scoped>
.time-slot-picker {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px 18px;
}

.time-slot-picker__item {
  min-height: 52px;
  padding: 10px 6px;

  border: 1px solid transparent;
  border-radius: var(--radius-small);

  background: #dce9e7;
  color: #24453e;

  font-size: 17px;
  white-space: nowrap;
  cursor: pointer;
}

.time-slot-picker__item:hover:not(:disabled) {
  background: #bdd7d2;
}

.time-slot-picker__item--occupied,
.time-slot-picker__item--occupied:hover {
  background: #315a52;
  color: white;
  cursor: not-allowed;
  opacity: 1;
}

.time-slot-picker__item--selected,
.time-slot-picker__item--selected:hover:not(:disabled) {
  background: var(--color-accent);
  border-color: var(--color-primary);
  color: white;
  font-weight: 700;
}

@media (max-width: 600px) {
  .time-slot-picker {
    gap: 8px;
  }

  .time-slot-picker__item {
    min-height: 44px;
    font-size: 12px;
  }
}

@media (max-width: 380px) {
  .time-slot-picker {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
