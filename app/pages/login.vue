<script setup lang="ts">
definePageMeta({
  layout: 'public',
})

const { login } = useDemoAuth()
const { assetPath } = useAssetPath()

async function handleLogin(): Promise<void> {
  login()
  await navigateTo('/people')
}
</script>

<template>
  <section class="login-page">
    <div class="login-page__content">
      <!-- Логотип и название сервиса -->
      <div class="login-page__branding">
        <div class="login-page__logo">
          <img
            :src="assetPath('/images/icons/brand.svg')"
            alt=""
            class="login-page__icon"
          />

          <span class="login-page__abbreviation">
            СБР
          </span>
        </div>

        <h1 class="login-page__title">
          Сервис бронирования<br />
          ресурсов
        </h1>
      </div>

      <!-- Кнопки входа и регистрации -->
      <div class="login-page__actions">
        <button
          type="button"
          class="login-page__button"
          @click="handleLogin"
        >
          Вход
        </button>

        <button
          type="button"
          class="login-page__button"
        >
          Регистрация
        </button>
      </div>

      <!-- Текст из макета -->
      <p class="login-page__description">
        Рыбатекст используется дизайнерами,
        проектировщиками и фронтендерами, когда
        нужно быстро заполнить макеты или прототипы
        содержимым. Это тестовый контент, который
        не должен нести никакого смысла, лишь
        показать наличие самого текста или
        продемонстрировать типографику в деле.
      </p>
    </div>
  </section>
</template>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  color: white;
}

.login-page__content {
  display: flex;
  flex-direction: column;
  align-items: center;

  width: min(100% - 40px, 1000px);
  padding-top: clamp(100px, 27vh, 180px);
  padding-bottom: 40px;
}

/* Логотип и заголовок */

.login-page__branding {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 34px;
  width: 100%;
}

.login-page__logo {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-shrink: 0;
}

.login-page__icon {
  width: 185px;
  height: 185px;
}

.login-page__abbreviation {
  font-size: 72px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -3px;
  white-space: nowrap;
}

.login-page__title {
  margin: 0;
  font-size: 36px;
  font-weight: 400;
  line-height: 1.35;
}

/* Кнопки */

.login-page__actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 36px;
}

.login-page__button {
  min-width: 112px;
  min-height: 38px;
  padding: 6px 22px;

  border: none;
  border-radius: 999px;

  background: #ffffff;
  color: #000000;

  font-size: 18px;
  font-weight: 500;

  box-shadow: 0 4px 12px rgba(255, 255, 255, 0);

  cursor: pointer;
  transition:
    background-color 0.2s,
    transform 0.2s;
}

.login-page__button:hover {
  background: #e7e7e7;
  box-shadow: 0 6px 16px (255, 255, 255, 0);
  transform: translateY(-1px);
}

.login-page__button:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px (255, 255, 255, 0);
}

/* Описание */

.login-page__description {
  max-width: 530px;
  margin: 70px 0 0;

  color: #ffffff;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.3;
  text-align: center;
}

/* Планшеты */

@media (max-width: 900px) {
  .login-page__content {
    padding-top: 22vh;
  }

  .login-page__branding {
    gap: 22px;
  }

  .login-page__icon {
    width: 90px;
    height: 90px;
  }

  .login-page__abbreviation {
    font-size: 54px;
  }

  .login-page__title {
    font-size: 28px;
  }
}

/* Смартфоны */

@media (max-width: 600px) {
  .login-page__content {
    width: calc(100% - 32px);
    padding-top: 15vh;
  }

  .login-page__branding {
    flex-direction: column;
    gap: 22px;
  }

  .login-page__logo {
    gap: 12px;
  }

  .login-page__icon {
    width: 75px;
    height: 75px;
  }

  .login-page__abbreviation {
    font-size: 58px;
  }

  .login-page__title {
    font-size: 28px;
    line-height: 1.25;
    text-align: center;
  }

  .login-page__actions {
    gap: 14px;
    margin-top: 32px;
  }

  .login-page__button {
    min-width: 110px;
    font-size: 16px;
  }

  .login-page__description {
    max-width: 420px;
    margin-top: 55px;
    font-size: 13px;
    line-height: 1.5;
  }
}

@media (max-height: 600px) and (min-width: 601px) {
  .login-page__content {
    padding-top: 20vh;
  }

  .login-page__description {
    margin-top: 50px;
  }
}
</style>
