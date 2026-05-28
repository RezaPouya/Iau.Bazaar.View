<template>
  <div class="max-w-lg mx-auto">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold">پروفایل کاربری</h1>
          <UIcon name="i-heroicons-user-circle" class="w-8 h-8 text-primary-600" />
        </div>
      </template>

      <div class="space-y-3">
        <div class="flex justify-between border-b pb-2">
          <span class="font-semibold">نام کاربری:</span>
          <span>{{ user.userName || '—' }}</span>
        </div>
        <div class="flex justify-between border-b pb-2">
          <span class="font-semibold">نام:</span>
          <span>{{ user.firstName || '—' }}</span>
        </div>
        <div class="flex justify-between border-b pb-2">
          <span class="font-semibold">نام خانوادگی:</span>
          <span>{{ user.lastName || '—' }}</span>
        </div>
        <div class="flex justify-between border-b pb-2">
          <span class="font-semibold">شماره همراه:</span>
          <span>{{ user.phoneNumber || '—' }}</span>
        </div>
        <div class="flex justify-between border-b pb-2">
          <span class="font-semibold">نقش:</span>
          <span>{{ user.roleTitle || user.role || '—' }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold">شناسه کاربر:</span>
          <span>{{ user.userId || '—' }}</span>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { jwtDecode } from 'jwt-decode';

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
});

const authStore = useAuthStore();
const user = ref({
  userId: authStore.user?.userId || '',
  userName: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  role: authStore.user?.role || '',
  roleTitle: '',
});

// Decode token to get extra claims
if (authStore.accessToken) {
  try {
    const decoded: any = jwtDecode(authStore.accessToken);
    user.value.userName = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '';
    user.value.firstName = decoded.fname || '';
    user.value.lastName = decoded.lname || '';
    user.value.phoneNumber = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone'] || '';
    user.value.role = decoded.role || authStore.user?.role || '';
    const roleMap: Record<string, string> = {
      Admin: 'مدیر سامانه',
      Operator: 'اپراتور',
      Customer: 'مشتری',
      LegalCustomer: 'مشتری حقوقی',
      UniversityUser: 'کاربر دانشگاه',
      GrowthCenterUser: 'کاربر مرکز رشد',
      CompanyUser: 'کاربر شرکت',
    };
    user.value.roleTitle = roleMap[user.value.role] || user.value.role;
  } catch (e) {
    console.error('Failed to decode token', e);
  }
}
</script>