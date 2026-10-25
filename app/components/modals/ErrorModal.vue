<script setup lang="ts">
withDefaults(
  defineProps<{
    open: boolean
    message?: string
  }>(),
  {
    message: 'Неверный запрос. Обратитесь в техподдержку',
  },
)

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <ModalsBaseModal
    :open="open"
    title="Ошибка"
    @close="emit('close')"
  >
    <div class="error-modal">
      <p class="error-modal__message">
        {{ message }}
      </p>

      <button
        type="button"
        class="error-modal__button"
        @click="emit('close')"
      >
        Принять
      </button>
    </div>
  </ModalsBaseModal>
</template>

<style scoped>
.error-modal {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 28px;
}

.error-modal__message {
  margin: 0;
  color: var(--color-text);
  font-size: 18px;
  line-height: 1.5;
}

.error-modal__button {
  align-self: center;
  min-width: 200px;
  min-height: 48px;
  padding: 12px 24px;

  border: none;
  border-radius: var(--radius-small);
  background: var(--color-primary);
  color: white;

  font-size: 17px;
  font-weight: 600;
}

.error-modal__button:hover {
  background: var(--color-primary-hover);
}

@media (max-width: 480px) {
  .error-modal {
    gap: 20px;
  }

  .error-modal__message {
    font-size: 16px;
  }

  .error-modal__button {
    width: 100%;
  }
}
</style>
