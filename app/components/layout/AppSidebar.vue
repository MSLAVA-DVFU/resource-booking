<script setup lang="ts">

const { invitations, declineInvitation } = useInvitations()

</script>

<template>
  <aside
    class="app-sidebar"
    aria-label="Панель бронирования"
  >
    <div class="app-sidebar__calendar">
      <BookingCalendar />
    </div>

    <section class="app-sidebar__invitations">
      <h2>Активные приглашения</h2>

      <div
        v-if="invitations.length > 0"
        class="app-sidebar__invitation-list"
      >
        <BookingInvitationCard
          v-for="invitation in invitations"
          :key="invitation.id"
          :invitation="invitation"
          @decline="declineInvitation"
        />
      </div>

      <p v-else class="app-sidebar__empty">
        У вас пока нет активных приглашений.
      </p>
    </section>
  </aside>
</template>

<style scoped>
.app-sidebar {
  width: 100%;
  min-width: 0;
}

.app-sidebar__calendar {
  margin-bottom: 32px;
}

.app-sidebar__invitations {
  width: 100%;
  min-width: 0;
}

.app-sidebar__invitations h2 {
  margin: 0 0 20px;
  font-size: 16px;
  font-weight: 600;
}

.app-sidebar__invitation-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.app-sidebar__empty {
  margin: 0;
  padding: 24px 12px;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-medium);
  color: var(--color-text-secondary);
  font-size: 14px;
  text-align: center;
}
</style>
