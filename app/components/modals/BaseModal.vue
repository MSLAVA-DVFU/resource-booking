<script setup lang="ts">
import {
  nextTick,
  onBeforeUnmount,
  ref,
  watch,
} from 'vue'

const props = defineProps<{
  open: boolean
  title: string
}>()

const emit = defineEmits<{
  close: []
}>()

const dialogRef = ref<HTMLElement | null>(null)
const titleId = `modal-${useId()}`

let previousFocus: HTMLElement | null = null

function closeModal(): void {
  emit('close')
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    event.preventDefault()
    closeModal()
    return
  }

  if (event.key !== 'Tab') return

  const dialog = dialogRef.value
  if (!dialog) return

  const elements = Array.from(
    dialog.querySelectorAll<HTMLElement>(
      'button:not([disabled]), ' +
      'input:not([disabled]), ' +
      'select:not([disabled]), ' +
      'textarea:not([disabled]), ' +
      'a[href], [tabindex]:not([tabindex="-1"])',
    ),
  ).filter(
    element => element.getClientRects().length > 0,
  )

  if (elements.length === 0) {
    event.preventDefault()
    dialog.focus()
    return
  }

  const first = elements[0]!
  const last = elements[elements.length - 1]!
  const active = document.activeElement

  if (event.shiftKey && active === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && active === last) {
    event.preventDefault()
    first.focus()
  } else if (!dialog.contains(active)) {
    event.preventDefault()
    first.focus()
  }
}

watch(
  () => props.open,
  async (isOpen, wasOpen) => {
    if (import.meta.server) return

    if (isOpen) {
      previousFocus = document.activeElement as HTMLElement | null
      await nextTick()
      dialogRef.value?.focus()
    } else if (wasOpen) {
      previousFocus?.focus()
      previousFocus = null
    }
  },
  { flush: 'post' },
)

onBeforeUnmount(() => {
  previousFocus?.focus()
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="modal-overlay"
      @mousedown.self="closeModal"
    >
      <section
        ref="dialogRef"
        class="modal-dialog"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        tabindex="-1"
        @keydown="handleKeydown"
      >
        <h2 :id="titleId" class="modal-dialog__title">
          {{ title }}
        </h2>

        <slot />
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow-y: auto;
  padding: 24px;

  background: rgba(0, 0, 0, 0.55);
}

.modal-dialog {
  width: min(100%, 650px);
  max-height: calc(100dvh - 48px);
  margin: auto;
  padding: 32px;

  overflow-y: auto;

  border-radius: var(--radius-large);
  background: var(--color-surface);
  color: var(--color-text);

  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.18);
  outline: none;
}

.modal-dialog__title {
  margin: 0 0 28px;
  font-size: 30px;
  font-weight: 500;
  line-height: 1.2;
}

@media (max-width: 600px) {
  .modal-overlay {
    padding: 12px;
  }

  .modal-dialog {
    max-height: calc(100dvh - 24px);
    padding: 22px 18px;
  }

  .modal-dialog__title {
    margin-bottom: 20px;
    font-size: 24px;
  }
}
</style>
