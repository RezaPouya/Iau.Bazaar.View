<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
    <div class="w-full max-w-md bg-white dark:bg-slate-800 shadow-2xl p-8 rounded-lg">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-primary-600">ورود به سامانه</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-2">لطفا وارد حساب کاربری خود شوید</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            نام کاربری یا شماره همراه
          </label>
          <input
            v-model="form.username"
            type="text"
            required
            class="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent text-left"
            :disabled="loading"
          />
        </div>

        <div>
          <label class="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            رمز عبور
          </label>
          <input
            v-model="form.password"
            type="password"
            required
            class="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent text-left"
            :disabled="loading"
          />
          <div class="flex justify-end mt-2">
            <a href="#" class="text-sm text-primary-600 hover:text-primary-700 transition">
              فراموشی رمز عبور؟
            </a>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-primary-600 hover:bg-primary-700 py-3 rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'در حال ورود...' : 'ورود' }}
        </button>
      </form>

      <div v-if="error" class="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm text-center">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'guest'
});

const form = reactive({
  username: '',
  password: ''
});

const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  if (!form.username || !form.password) {
    error.value = 'لطفا ایمیل و رمز عبور را وارد کنید';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const { $api } = useNuxtApp();
    const response = await $api.post('/account/sign-in-by-password', {
      userName: form.username,
      password: form.password
    });

    const data = response.data.data;
    const auth = useAuthStore();
    auth.setAuth(data);

    await navigateTo(data.panelUrl || '/');
  } catch (err: any) {
    console.error('Login error:', err);
    error.value = err.response?.data?.message || 'خطا در ورود به سیستم. لطفا مجددا تلاش کنید.';
  } finally {
    loading.value = false;
  }
};
</script>