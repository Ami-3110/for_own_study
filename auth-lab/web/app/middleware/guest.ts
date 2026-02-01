// web/app/middleware/guest.ts

export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuth()

  // まず状態を整える（軽い）
  await auth.init()

  // すでに user がいれば即リダイレクト
  if (auth.user.value) {
    return navigateTo('/protected')
  }

  // user が無いが、ログイン済みの可能性があるので me() で確認
  try {
    await auth.me()
    // me が成功した = ログイン済み
    return navigateTo('/protected')
  } catch {
    // 未ログイン → login 表示してOK
  }
})
