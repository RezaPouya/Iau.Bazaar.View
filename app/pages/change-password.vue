<template>
  <div class="max-w-md mx-auto">
    <UCard>
      <template #header>
        <h1 class="text-xl font-bold">تغییر رمز عبور</h1>
      </template>

      <UForm :state="form" @submit="handleSubmit" class="space-y-4">
        <UFormGroup label="رمز عبور فعلی" name="currentPassword" required>
          <UInput
            v-model="form.currentPassword"
            type="password"
            placeholder="رمز فعلی خود را وارد کنید"
            :disabled="loading"
          />
        </UFormGroup>

        <UFormGroup label="رمز عبور جدید" name="newPassword" required>
          <UInput
            v-model="form.newPassword"
            type="password"
            placeholder="رمز جدید"
            :disabled="loading"
          />
        </UFormGroup>

        <UFormGroup label="تکرار رمز عبور جدید" name="confirmNewPassword" required>
          <UInput
            v-model="form.confirmNewPassword"
            type="password"
            placeholder="تکرار رمز جدید"
            :disabled="loading"
          />
        </UFormGroup>

        <div v-if="error" class="mt-2">
          <UAlert color="red" :title="error" />
        </div>
        <div v-if="success" class="mt-2">
          <UAlert color="green" :title="success" />
        </div>

        <UButton
          type="submit"
          color="primary"
          block
          :loading="loading"
        >
          تغییر رمز عبور
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
});

const { $api } = useNuxtApp();
const loading = ref(false);
const error = ref('');
const success = ref('');
const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
});

const handleSubmit = async () => {
  if (!form.currentPassword || !form.newPassword || !form.confirmNewPassword) {
    error.value = 'لطفاً تمام فیلدها را پر کنید';
    return;
  }
  if (form.newPassword !== form.confirmNewPassword) {
    error.value = 'رمز عبور جدید و تکرار آن مطابقت ندارند';
    return;
  }

  loading.value = true;
  error.value = '';
  success.value = '';
  try {
    await $api.post('/account/change-password', {
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
      confirmNewPassword: form.confirmNewPassword,
    });
    success.value = 'رمز عبور با موفقیت تغییر کرد';
    // clear form
    form.currentPassword = '';
    form.newPassword = '';
    form.confirmNewPassword = '';
  } catch (err: any) {
    error.value = err.response?.data?.message || 'خطا در تغییر رمز عبور';
  } finally {
    loading.value = false;
  }
};
</script>