export function useAssetPath() {
  const config = useRuntimeConfig()

  function assetPath(path: string): string {
    const base = config.app.baseURL.replace(/\/+$/, '')
    const relativePath = path.replace(/^\/+/, '')

    return `${base}/${relativePath}`
  }

  return { assetPath }
}
