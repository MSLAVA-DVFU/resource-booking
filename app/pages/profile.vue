<script setup lang="ts">
const { currentUser } = useDemoAuth()
</script>

<template>
  <section
    v-if="currentUser"
    class="profile-page"
  >
    <h1>Профиль</h1>

    <div class="profile-page__card">
      <div class="profile-page__avatar">
        {{ currentUser.initials }}
      </div>

      <div>
        <span class="profile-page__label">Имя</span>
        <p>{{ currentUser.name }}</p>
      </div>

      <div>
        <span class="profile-page__label">
          Электронная почта
        </span>
        <p>{{ currentUser.email }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.profile-page {
  max-width: 650px;
}

.profile-page h1 {
  margin-bottom: 24px;
  font-size: 30px;
}

.profile-page__card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 28px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-large);
}

.profile-page__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  font-size: 22px;
}

.profile-page__label {
  color: var(--color-text-secondary);
  font-size: 13px;
}

.profile-page__card p {
  margin: 4px 0 0;
  font-size: 18px;
}
</style>
