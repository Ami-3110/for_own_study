// web/app/composables/useAuth.ts
export type User = {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

type AuthStatus = 'unknown' | 'guest' | 'auth'

export const useAuth = () => {
  const user = useState<User | null>('auth:user', () => null)
  const status = useState<AuthStatus>('auth:status', () => 'unknown')
  const error = useState<string | null>('auth:error', () => null)

  let mePromise: Promise<User | null> | null = null

  const init = async () => {
    error.value = null
    status.value = user.value ? 'auth' : 'unknown'
    return user.value
  }

  const me = async (force = false): Promise<User | null> => {
    error.value = null

    if (!force && user.value) return user.value
    if (!force && mePromise) return mePromise

    const api = useApi()

    const p = api<User>('/api/jwt/me', { method: 'GET' })
      .then((u) => {
        user.value = u
        status.value = 'auth'
        return u
      })
      .catch((e) => {
        user.value = null
        status.value = 'guest'
        error.value = e?.data?.message || e?.message || 'Failed to fetch current user.'
        throw e
      })
      .finally(() => {
        if (!force) mePromise = null
      })

    if (!force) mePromise = p
    return p
  }

  const clear = () => {
    user.value = null
    status.value = 'guest'
    error.value = null
  }

  // logoutは現状維持（後でuseApiに寄せてもOK）
  const config = useRuntimeConfig()
  const loggingOut = useState<boolean>('auth:loggingOut', () => false)

  const logout = async () => {
    if (loggingOut.value) return
    loggingOut.value = true

    try {
      await $fetch('/api/jwt/logout', {
        baseURL: config.public.apiBase,
        method: 'POST',
        credentials: 'include',
        headers: { Accept: 'application/json' },
      })
    } catch {
      // 無視でOK
    } finally {
      user.value = null
      status.value = 'guest'
      await navigateTo('/login')
      loggingOut.value = false
    }
  }

  return { user, status, error, init, me, clear, logout }
}