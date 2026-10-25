<template>
  <div class="public-layout">
    <main class="public-layout__main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.public-layout {
  min-height: 100vh;
  min-height: 100dvh;

  background-image:
    linear-gradient(
      rgba(0, 0, 0, 0.05),
      rgba(0, 0, 0, 0.12)
    ),
    url('~/assets/images/booking-header.jpg');

  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.public-layout__main {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}
</style>
