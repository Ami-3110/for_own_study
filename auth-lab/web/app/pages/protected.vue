<!-- web/app/pages/protected.vue -->

<template>
  <div>
    <h1>Protected</h1>

    <div style="margin: 8px 0;">
      <button :disabled="loading" @click="loadMe(false)">me</button>
      <button :disabled="loading" @click="loadMe(true)">me(force)</button>
      <button :disabled="loading" @click="logout">logout</button>
    </div>

    <p v-if="loading">loading...</p>

    <pre v-else-if="auth.user.value">{{ auth.user.value }}</pre>

    <p v-else style="color:#666">No user loaded yet</p>

    <p v-if="error && !auth.user.value" style="color:#c00">{{ error }}</p>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const auth = useAuth()
const loading = ref(false)
const error = ref<string | null>(null)

const loadMe = async (force: boolean) => {
  loading.value = true
  error.value = null
  try {
    await auth.me(force) // ← userはuseAuthのstateに入る想定
    error.value = null   // ← 最終成功したらエラー消す
  } catch (e: any) {
    console.log('[protected] loadMe failed', e)
    error.value = e?.data?.message ?? e?.message ?? 'me failed'
  } finally {
    loading.value = false
  }
}

const logout = async () => {
  await auth.logout()
}
</script>
