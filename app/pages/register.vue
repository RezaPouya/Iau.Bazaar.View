<template>
  <div class="min-h-screen flex items-center justify-center">
    <UCard class="w-full max-w-md text-center">
      <h1 class="text-2xl font-bold mb-4">ثبت نام</h1>
      <p class="mb-6">ثبت نام با استفاده از شماره همراه انجام می‌شود.</p>
      <UButton to="/login?tab=otp" color="primary" block>
        رفتن به صفحه ورود (رمز یکبار مصرف)
      </UButton>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'guest' });
</script>