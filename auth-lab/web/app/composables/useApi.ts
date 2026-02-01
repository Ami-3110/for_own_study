// web/app/composables/useApi.ts
export const useApi = () => {
  const config = useRuntimeConfig()
  const auth = useAuth()

  const REFRESH_PATH = '/api/jwt/refresh'
  const LOGOUT_PATH  = '/api/jwt/logout'

  let refreshing: Promise<void> | null = null

  const baseFetch = $fetch.create({
    baseURL: config.public.apiBase,
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })

  const refresh = async (rid: string) => {
    if (!refreshing) {
      console.log(`[api][${rid}] refresh:start`)
      refreshing = baseFetch(REFRESH_PATH, { method: 'POST' })
        .then(() => console.log(`[api][${rid}] refresh:success`))
        .finally(() => {
          console.log(`[api][${rid}] refresh:done (reset refreshing=null)`)
          refreshing = null
        }) as Promise<void>
    } else {
      console.log(`[api][${rid}] refresh:join (already refreshing)`)
    }
    await refreshing
  }

  // ★ここが本体：hookじゃなく try/catch で制御する
  const api = async <T>(request: any, options: any = {}): Promise<T> => {
    const rid = Math.random().toString(36).slice(2, 8)
    const url = typeof request === 'string' ? request : String(request)

    // リトライは1回だけ
    const anyOpt = options as any
    const retried = !!anyOpt.__retried

    try {
      return await baseFetch<T>(request, options)
    } catch (e: any) {
      const status = e?.response?.status

      console.log(`[api][${rid}] catch status=${status} url=${url}`)

      // logoutは触らない
      if (url.includes(LOGOUT_PATH)) throw e

      // 401以外はそのまま
      if (status !== 401) throw e

      // refresh自体が401なら延命不可
      if (url.includes(REFRESH_PATH)) {
        console.log(`[api][${rid}] 401 on refresh itself -> clear`)
        auth.clear()
        throw e
      }

      // 2回目は諦める
      if (retried) {
        console.log(`[api][${rid}] already retried -> clear`)
        auth.clear()
        throw e
      }

      anyOpt.__retried = true
      console.log(`[api][${rid}] mark __retried=true`)

      try {
        await refresh(rid)
      } catch (re) {
        console.log(`[api][${rid}] refresh failed -> clear`)
        auth.clear()
        throw e
      }

      console.log(`[api][${rid}] retry original request`)
      const res = await baseFetch<T>(request, options)
      console.log(`[api][${rid}] retry success`)
      return res
    }
  }

  return api
}
