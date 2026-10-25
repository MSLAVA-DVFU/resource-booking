<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Invitation } from '~/data/users'

const props = defineProps<{
  invitation: Invitation
}>()

const emit = defineEmits<{
  decline: [id: number]
}>()

const isExpanded = ref(false)

function toggleDetails(): void {
  isExpanded.value = !isExpanded.value
}

function handleDecline(): void {
  emit('decline', props.invitation.id)
}

const shortPersonName = computed(() => {
  const parts = props.invitation.person.trim().split(/\s+/)

  if (parts.length === 1) {
    return parts[0]
  }

  if (parts.length === 2) {
    const [firstName, lastName] = parts
    return `${lastName} ${firstName[0]}.`
  }

  const [lastName, firstName, middleName] = parts
  return `${lastName} ${firstName[0]}. ${middleName[0]}.`
})
</script>

<template>
  <article class="invitation-card">
    <h3 class="invitation-card__title">
      {{ invitation.title }}
    </h3>

    <div class="invitation-card__meta">
      <span class="invitation-card__pill">
        {{ invitation.time }}
      </span>

      <span class="invitation-card__pill">
        {{ shortPersonName }}
      </span>

      <span class="invitation-card__pill">
        {{ invitation.role }}
      </span>
    </div>

    <div class="invitation-card__actions">
      <button
        type="button"
        class="invitation-card__button invitation-card__button--primary"
        :aria-expanded="isExpanded"
        @click="toggleDetails"
      >
        Подробнее
      </button>

      <button
        type="button"
        class="invitation-card__button invitation-card__button--secondary"
        @click="handleDecline"
      >
        Отклонить
      </button>
    </div>

    <div
      v-if="isExpanded"
      class="invitation-card__details"
    >
      <p>
        <strong>Дата:</strong>
        {{ invitation.date }}
      </p>

      <p>
        <strong>Описание:</strong>
        {{ invitation.description }}
      </p>
    </div>
  </article>
</template>

<style scoped>
.invitation-card {
  width: 100%;
  min-width: 0;
  padding: 24px 20px;

  border-radius: 16px;
  background: #ececec;
}

.invitation-card__title {
  margin: 0 0 24px;
  color: #111111;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
}

.invitation-card__meta {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.invitation-card__pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 0;
  min-height: 29px;
  padding: 8px 10px;
  border-radius: 5px;

  background: #8eb1ae;
  color: #ffffff;

  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
}

.invitation-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
}

.invitation-card__button {
  min-width: 137px;
  min-height: 39px;
  padding: 12px 20px;

  border: none;
  border-radius: 10px;

  font-size: 16px;
  font-weight: 600;
  font-family: inherit;

  cursor: pointer;
  transition:
    transform 0.2s,
    background-color 0.2s,
    box-shadow 0.2s;
}

.invitation-card__button:hover {
  transform: translateY(-1px);
}

.invitation-card__button--primary {
  background: #49796f;
  color: #ffffff;
}

.invitation-card__button--primary:hover {
  background: #3f6b62;
}

.invitation-card__button--secondary {
  background: #ffffff;
  color: #202020;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
}

.invitation-card__button--secondary:hover {
  background: #f8f8f8;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.14);
}

.invitation-card__details {
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.invitation-card__details p {
  margin: 0 0 10px;
  color: #3c3c3c;
  font-size: 14px;
  line-height: 1.5;
}

.invitation-card__details p:last-child {
  margin-bottom: 0;
}


@media (max-width: 1100px) {
  .invitation-card {
    padding: 20px 14px;
  }

  .invitation-card__meta {
    flex-wrap: wrap;
    gap: 8px;
  }

  .invitation-card__pill {
    font-size: 12px;
  }

  .invitation-card__button {
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .invitation-card {
    padding: 24px 20px;
  }

  .invitation-card__meta {
    flex-wrap: wrap;
  }

  .invitation-card__pill {
    font-size: 14px;
  }

  .invitation-card__button {
    font-size: 16px;
  }
}

@media (max-width: 420px) {
  .invitation-card {
    padding: 18px 12px;
  }

  .invitation-card__meta {
    gap: 6px;
  }

  .invitation-card__pill {
    padding: 8px;
    font-size: 12px;
  }

  .invitation-card__actions {
    gap: 8px;
  }

  .invitation-card__button {
    padding: 10px 6px;
    font-size: 14px;
  }
}
</style>