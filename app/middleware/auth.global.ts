export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/login') {
    return
  }

  const { isAuthenticated } = useDemoAuth()

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})
