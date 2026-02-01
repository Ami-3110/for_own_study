<!-- web/app/pages/login.vue -->
<template>
  <div style="padding: 24px;">
    <h1>Login (JWT)</h1>

    <div style="margin-top: 12px;">
      <label>
        Email
        <input v-model="email" type="email" style="display:block; width: 320px; margin-top: 4px;" />
      </label>
    </div>

    <div style="margin-top: 12px;">
      <label>
        Password
        <input v-model="password" type="password" style="display:block; width: 320px; margin-top: 4px;" />
      </label>
    </div>

    <div style="margin-top: 16px;">
      <button @click="login" :disabled="loading">
        {{ loading ? 'logging in...' : 'login' }}
      </button>
    </div>

    <p v-if="error" style="margin-top: 12px; color: #c00;">{{ error }}</p>

  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'guest',
})

const api = useApi()

const email = ref('test@example.com')
const password = ref('password')
const loading = ref(false)
const error = ref<string | null>(null)

const login = async () => {
  loading.value = true
  error.value = null

  try {
    await api('/api/jwt/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    })

    await navigateTo('/protected')
  } catch (e: any) {
    console.error(e)
    error.value = e?.data?.message ?? e?.message ?? 'login failed'
  } finally {
    loading.value = false
  }
}

</script>
