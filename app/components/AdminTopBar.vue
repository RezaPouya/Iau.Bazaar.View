<template>
  <header
    class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-3"
  >
    <div class="flex items-center justify-between">
      <!-- Right side: placeholder (could add page title, breadcrumbs, etc.) -->
      <div></div>

      <!-- Left side (RTL -> left is opposite side) -->
      <div class="flex items-center gap-4">
        <!-- Role badge (optional) -->
        <div class="hidden sm:block text-sm text-slate-500 dark:text-slate-400">
          نقش: {{ userRole }}
        </div>

        <!-- Profile dropdown -->
        <UDropdown
          :items="dropdownItems"
          :popper="{ placement: 'bottom-start' }"
        >
          <UButton color="gray" variant="ghost" class="flex items-center gap-2">
            <UIcon name="i-heroicons-user-circle" class="w-6 h-6" />
            <span class="hidden md:inline">{{ userName || 'کاربر' }}</span>
          </UButton>
        </UDropdown>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useLogout } from '../composables/useLogout';

const auth = useAuthStore();
const router = useRouter();
const { logout } = useLogout();

// Get user info from store
const user = computed(() => auth.user);
const userName = computed(() => {
  // You can extend AuthUser type later to include full name
  return user.value?.userId ? `کاربر ${user.value.userId}` : 'پروفایل';
});
const userRole = computed(() => user.value?.role || '');

// Dropdown items
const dropdownItems = [
  [
    {
      label: 'پروفایل من',
      icon: 'i-heroicons-user',
      click: () => navigateTo('/admin/profile'),
    },
    {
      label: 'تغییر رمز عبور',
      icon: 'i-heroicons-key',
      click: () => navigateTo('/admin/change-password'),
    },
    {
      label: 'خروج از سیستم',
      icon: 'i-heroicons-arrow-right-start-on-rectangle',
      click: async () => {
        await logout();
        await navigateTo('/login');
      },
    },
  ],
];
</script>
