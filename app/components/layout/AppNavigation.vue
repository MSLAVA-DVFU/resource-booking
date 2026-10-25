<script setup lang="ts">
const route = useRoute()

const { assetPath } = useAssetPath()
const { currentUser, logout } = useDemoAuth()

async function handleLogout(): Promise<void> {
  closeProfileMenu()
  logout()
  await navigateTo('/login')
}

import {
  onMounted,
  onBeforeUnmount,
  ref,
} from 'vue'

const isProfileMenuOpen = ref(false)
const profileWrapperRef = ref<HTMLElement | null>(null)

function openProfileMenu(): void {
  isProfileMenuOpen.value = true
}

function closeProfileMenu(): void {
  isProfileMenuOpen.value = false
}

function handleOutsidePointer(event: PointerEvent): void {
  const target = event.target

  if (
    target instanceof Node &&
    !profileWrapperRef.value?.contains(target)
  ) {
    closeProfileMenu()
  }
}

function handleProfileFocusOut(event: FocusEvent): void {
  const next = event.relatedTarget

  if (
    !(next instanceof Node) ||
    !profileWrapperRef.value?.contains(next)
  ) {
    closeProfileMenu()
  }
}

onMounted(() => {
  document.addEventListener(
    'pointerdown',
    handleOutsidePointer,
  )
})

onBeforeUnmount(() => {
  document.removeEventListener(
    'pointerdown',
    handleOutsidePointer,
  )
})


const navigationItems = [
  {
    label: 'Аппаратура',
    path: '/equipment',
  },
  {
    label: 'Люди',
    path: '/people',
  },
  {
    label: 'Пространство',
    path: '/spaces',
  },
]

const isActive = (path: string) => {
  return route.path === path
}
</script>

<template>
  <nav class="app-navigation" aria-label="Основная навигация">
    <div class="app-navigation__inner">
      <NuxtLink
        to="/"
        class="app-navigation__home"
        aria-label="На главную"
      >
         <img
            :src="assetPath('/images/icons/brand.svg')"
            alt=""
            class="app-navigation__home-icon"
          />
      </NuxtLink>

      <div class="app-navigation__links">
        <NuxtLink
          v-for="item in navigationItems"
          :key="item.path"
          :to="item.path"
          class="app-navigation__link"
          :class="{
            'app-navigation__link--active': isActive(item.path),
          }"
          :aria-current="isActive(item.path) ? 'page' : undefined"
        >
          {{ item.label }}
        </NuxtLink>
      </div>

      
      <div
        ref="profileWrapperRef"
        class="app-navigation__profile-wrapper"
        @mouseenter="openProfileMenu"
        @mouseleave="closeProfileMenu"
        @focusin="openProfileMenu"
        @focusout="handleProfileFocusOut"
        @keydown.esc.stop="closeProfileMenu"
      >
        <button
          type="button"
          class="app-navigation__profile"
          aria-label="Меню профиля"
          aria-haspopup="true"
          :aria-expanded="isProfileMenuOpen"
          aria-controls="profile-menu"
          @click="openProfileMenu"
        >
          <span>Профиль</span>

          <img
            :src="assetPath('/images/icons/profile.png')"
            alt="Профиль"
            class="app-navigation__profile-avatar-image"
          />
        </button>

        <div
          v-show="isProfileMenuOpen"
          id="profile-menu"
          class="profile-popover"
        >
          <div class="profile-popover__header">
            <strong class="profile-popover__name">
              {{ currentUser?.name }}
            </strong>

            <NuxtLink
              to="/profile"
              class="profile-popover__settings"
              aria-label="Настройки профиля"
              title="Настройки профиля"
              @click="closeProfileMenu"
            >
              <img
                :src="assetPath('/images/icons/settings.svg')"
                alt="Профиль"
                class=".profile-popover__settings"
              />
            </NuxtLink>
          </div>

          <p class="profile-popover__email">
            {{ currentUser?.email }}
          </p>

          <button
            type="button"
            class="profile-popover__logout"
            @click="handleLogout"
          >
            Выход
          </button>
        </div>
      </div>

    </div>
  </nav>
</template>

<style scoped>
.app-navigation {
  width: 100%;
  min-height: var(--navigation-height);
  background: #151514;
  color: white;
}

.app-navigation__inner {
  width: min(100% - 48px, 1800px);
  min-height: var(--navigation-height);
  margin: 0 auto;

  display: flex;
  align-items: center;
  gap: 170px;
}

.app-navigation__home {
  display: flex;
  align-items: center;
  width: 38px;
  height: 38px;
}

.app-navigation__home-icon {
  width: 32px;
  height: 32px;
}

.app-navigation__links {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 80px;
  margin-left: auto;
}

.app-navigation__link {
  padding: 14px 0;
  color: #ffffff;
  font-size: 18px;
  white-space: nowrap;
  border-bottom: 2px solid transparent;
  transition: border-color 0.2s, color 0.2s;
}

.app-navigation__link:hover {
  color: #d5e9e5;
}

.app-navigation__link--active {
  border-bottom-color: #ffffff;
}


.app-navigation__profile-wrapper {
  position: relative;
  justify-self: end;
  display: flex;
  align-items: center;
  z-index: 20;
}

.app-navigation__profile {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 0;
  border: none;
  background: transparent;
  color: white;
  font-size: 18px;
  cursor: pointer;
}

.app-navigation__profile:hover {
  color: #d5e9e5;
}


.app-navigation__avatar {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #e3e3e3;
  color: #626262;
}

/* Всплывающее меню пользователя */

.profile-popover {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  z-index: 100;

  width: 290px;
  padding: 20px;

  background: var(--color-surface);
  color: var(--color-text);

  border: 1px solid var(--color-border);
  border-radius: var(--radius-medium);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.16);
}

/* Невидимая область между иконкой и меню,
   чтобы меню не закрывалось при перемещении курсора */

.profile-popover::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 100%;
  height: 12px;
}

.profile-popover__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.profile-popover__name {
  font-size: 18px;
  font-weight: 600;
}

.profile-popover__settings {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  width: 34px;
  height: 34px;

  border-radius: var(--radius-small);
  color: var(--color-text-secondary);
  transition:
    background-color 0.2s,
    color 0.2s;
}

.profile-popover__settings:hover {
  background: var(--color-surface-secondary);
  color: var(--color-primary);
}

.profile-popover__settings svg {
  width: 22px;
  height: 22px;
}

.profile-popover__email {
  margin: 8px 0 20px;
  color: var(--color-text-secondary);
  font-size: 14px;
  overflow-wrap: anywhere;
}

.profile-popover__logout {
  width: 100%;
  min-height: 42px;
  padding: 10px 16px;

  border: none;
  border-radius: var(--radius-small);

  background: var(--color-primary);
  color: white;

  font-size: 15px;
  font-weight: 600;
}

@media (max-width: 600px) {
  .profile-popover {
    width: min(290px, calc(100vw - 24px));
  }
}


@media (max-width: 900px) {
  .app-navigation__inner {
    gap: 16px;
  }

  .app-navigation__links {
    gap: 20px;
  }

  .app-navigation__link,
  .app-navigation__profile {
    font-size: 15px;
  }
}

@media (max-width: 600px) {
  .app-navigation__inner {
    width: calc(100% - 24px);
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .app-navigation__home {
    width: 28px;
  }

  .app-navigation__home svg {
    width: 26px;
  }

  .app-navigation__links {
    gap: 12px;
  }

  .app-navigation__link {
    font-size: 12px;
  }

  .app-navigation__profile {
    gap: 0;
  }

  .app-navigation__profile > span:first-child {
    display: none;
  }

  .app-navigation__avatar {
    width: 32px;
    height: 32px;
  }

  .app-navigation__avatar svg {
    width: 23px;
    height: 23px;
  }
}
</style>
