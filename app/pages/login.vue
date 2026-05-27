<template>
  <div
    class="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 rounded-7px"
  >
    <div
      class="w-full max-w-md bg-white dark:bg-slate-800 shadow-2xl p-8 rounded-7px"

    >
      <div class="text-center mb-8 rounded-5px">
        <h1 class="text-3xl font-bold text-primary-600">ورود به سامانه</h1>

        <p class="text-slate-500 mt-2">لطفا وارد حساب کاربری خود شوید</p>
      </div>

      <form class="space-y-3"  @submit.prevent="login">
        <div>
          <label class="block mb-2 text-sm"> ایمیل </label>
          <input v-model="username" type="text" class="w-full p-1 rounded-5px border text-left"/>
        </div>

        <div>
          <label class="block mb-2 text-sm"> رمز عبور </label>
          <input v-model="password" type="password"  class="w-full p-1 rounded-5px border text-left"/>
          <div class="flex justify-between mb-1 mt-1">
            <a href="#" class="text-sm text-primary-600 hover:text-primary-700 transition">
              فراموشی رمز عبور؟
            </a>
          </div>

        </div>

        <button
          class="w-full bg-primary-600 hover:bg-primary-700 transition py-3 font-bold"
    
        >
          ورود
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">

const username = ref('')
const password = ref('')

const loading = ref(false)

const auth = useAuthStore()

const { $api } = useNuxtApp()

const login = async () => {

  try {

    loading.value = true

    const response = await $api.post(
      '/account/sign-in-by-password',
      {
        userName: username.value,
        password: password.value
      }
    )

    const data = response.data.data

    auth.setAuth(data)

    return navigateTo(
      data.panelUrl || '/'
    )

  } catch (e: any) {

    console.error(e)

  } finally {

    loading.value = false
  }
}
</script>