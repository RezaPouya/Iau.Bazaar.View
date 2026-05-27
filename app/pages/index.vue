<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-primary-600 mb-4">خوش آمدید</h1>
      <p class="text-slate-600 dark:text-slate-400 mb-8">به سامانه خوش آمدید</p>
      
      <div v-if="auth.isAuthenticated">
        <p class="mb-4">شما وارد سیستم شده‌اید</p>
        <button 
          @click="handleLogout"
          class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition"
        >
          خروج
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
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore();
const { logout } = useLogout();

const handleLogout = async () => {
  await logout();
};
</script>