// web/app/middleware/auth.ts

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuth()

console.log('[mw:auth] status', auth.status.value, 'user?', !!auth.user.value)
  // まず状態を整える（Cookie見るだけ）
  await auth.init()

  // ログインの可能性すらない → 即ログインへ
  // if (auth.status.value === 'guest') {
  //  return navigateTo('/login')
  //  }

  // まだ確定してない（tokenはある）→ meで確定させる
  if (auth.status.value === 'unknown') {
    try {
      await auth.me()
    } catch {
      return navigateTo('/login')
    }
  }

  // 最終チェック：userが取れなければ未ログイン扱い
  if (!auth.user.value) {
    return navigateTo('/login')
  }
})
