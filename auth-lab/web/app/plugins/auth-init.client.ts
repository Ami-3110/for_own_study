// web/app/plugins/auth-init.client.ts

export default defineNuxtPlugin(async () => {
  const auth = useAuth()
  await auth.init()
})
