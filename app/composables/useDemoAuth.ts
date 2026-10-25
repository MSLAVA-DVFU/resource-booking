import { computed } from 'vue'
import { demoUser } from '~/data/users'

export function useDemoAuth() {
  const isLoggedIn = useCookie<boolean>('demo-auth', {
    default: () => false,
    sameSite: 'lax',
    path: '/',
  })

  const currentUser = computed(() => {
    return isLoggedIn.value ? demoUser : null
  })

  const isAuthenticated = computed(() => {
    return isLoggedIn.value === true
  })

  function login(): void {
    isLoggedIn.value = true
  }

  function logout(): void {
    isLoggedIn.value = false
  }

  return {
    currentUser,
    isAuthenticated,
    login,
    logout,
  }
}