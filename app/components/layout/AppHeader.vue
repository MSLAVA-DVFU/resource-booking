<template>
  <header class="app-header">
    <div class="app-header__content">
      <div class="app-header__branding">
        <div class="app-header__logo">
          <svg
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            stroke-width="9"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M74 48v35H12V21h47" />
            <path d="m34 60-3 13 14-3 42-42-11-11-42 43z" />
            <path d="m70 23 11 11" />
          </svg>

          <span>СБР</span>
        </div>

        <h1 class="app-header__title">
          Сервис бронирования<br>
          ресурсов
        </h1>
      </div>

      <div class="app-header__actions">
        <button class="app-header__button" type="button">
          Вход
        </button>

        <button class="app-header__button" type="button">
          Регистрация
        </button>
      </div>

      <p class="app-header__description">
        Рыбатекст используется дизайнерами, проектировщиками и
        фронтендерами, когда нужно быстро заполнить макеты или
        прототипы содержимым. Это тестовый контент, который
        не должен нести никакого смысла, лишь показать наличие
        самого текста или продемонстрировать типографику в деле.
      </p>
    </div>

    <LayoutAppNavigation />
  </header>
</template>

<style scoped>
.app-header {
  min-height: var(--header-height);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  color: var(--color-text-inverse);

  background-image:
    linear-gradient(
      rgba(0, 0, 0, 0.16),
      rgba(0, 0, 0, 0.26)
    ),
    url('/images/backgrounds/booking-header.jpg');

  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.app-header__content {
  width: min(100% - 48px, 1120px);
  margin: auto;
  padding: 48px 0;
}

.app-header__branding {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
}

.app-header__logo {
  display: flex;
  align-items: center;
  gap: 20px;
}

.app-header__logo svg {
  width: 100px;
  height: 100px;
}

.app-header__logo span {
  font-size: 90px;
  font-weight: 400;
  letter-spacing: -4px;
}

.app-header__title {
  margin: 0;
  font-size: 46px;
  font-weight: 400;
  line-height: 1.25;
}

.app-header__actions {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 50px;
}

.app-header__button {
  min-width: 165px;
  padding: 11px 30px;

  background: white;
  color: black;
  border: none;
  border-radius: 30px;

  font-size: 21px;
  font-weight: 600;

  transition:
    transform 0.2s,
    background-color 0.2s;
}

.app-header__button:hover {
  background: #e8e8e8;
  transform: translateY(-2px);
}

.app-header__description {
  max-width: 780px;
  margin: 85px auto 0;
  font-size: 18px;
  line-height: 1.55;
  text-align: center;
}

@media (max-width: 900px) {
  .app-header {
    min-height: 560px;
  }

  .app-header__logo svg {
    width: 70px;
    height: 70px;
  }

  .app-header__logo span {
    font-size: 64px;
  }

  .app-header__title {
    font-size: 32px;
  }

  .app-header__description {
    margin-top: 56px;
    font-size: 16px;
  }
}

@media (max-width: 600px) {
  .app-header {
    min-height: 520px;
  }

  .app-header__content {
    width: calc(100% - 32px);
    padding: 35px 0;
  }

  .app-header__branding {
    flex-direction: column;
    gap: 18px;
  }

  .app-header__logo svg {
    width: 55px;
    height: 55px;
  }

  .app-header__logo span {
    font-size: 56px;
  }

  .app-header__title {
    font-size: 29px;
    text-align: center;
  }

  .app-header__actions {
    gap: 12px;
    margin-top: 28px;
  }

  .app-header__button {
    min-width: 0;
    padding: 10px 22px;
    font-size: 16px;
  }

  .app-header__description {
    margin-top: 35px;
    font-size: 13px;
  }
}
</style>
