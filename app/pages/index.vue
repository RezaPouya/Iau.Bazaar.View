<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-primary-600 mb-4">خوش آمدید</h1>
      <p class="text-slate-600 dark:text-slate-400 mb-8">به سامانه خوش آمدید</p>

      <ClientOnly>
        <div v-if="auth.isAuthenticated">
          <p class="mb-4">شما وارد سیستم شده‌اید</p>
          <p class="mb-4 text-sm text-slate-500">نقش: {{ auth.user?.role }}</p>
          <button
            @click="handleLogout"
            :disabled="isLoggingOut"
            class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
          >
            {{ isLoggingOut ? 'در حال خروج...' : 'خروج' }}
          </button>
        </div>

        <div v-else>
          <NuxtLink
            to="/login"
            class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition"
          >
            ورود به سیستم
          </NuxtLink>
        </div>

        <template #fallback>
          <div
            class="w-32 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse mx-auto"
          ></div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
// Disable SSR for this page to prevent hydration mismatch
definePageMeta({
  ssr: false,
});

const auth = useAuthStore();
const { logout } = useLogout();
const isLoggingOut = ref(false);

const handleLogout = async () => {
  if (isLoggingOut.value) return;
  isLoggingOut.value = true;
  try {
    await logout();
  } finally {
    isLoggingOut.value = false;
  }
};
</script>
