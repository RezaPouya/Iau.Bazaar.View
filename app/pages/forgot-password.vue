<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <h1 class="text-2xl font-bold text-primary-600 text-center">فراموشی رمز عبور</h1>
        <p class="text-center text-slate-500 dark:text-slate-400 mt-1">
          رمز عبور خود را با استفاده از شماره همراه بازیابی کنید
        </p>
      </template>

      <UForm :state="form" @submit="handleSubmit" class="space-y-4">
        <UFormGroup label="شماره همراه" name="mobile" required>
          <UInput
            v-model="form.mobile"
            placeholder="09123456789"
            size="lg"
            :disabled="loading || step === 'reset'"
          />
        </UFormGroup>

        <UFormGroup v-if="step === 'reset'" label="کد تأیید" name="otp" required>
          <UInput
            v-model="form.otp"
            placeholder="کد ۶ رقمی"
            size="lg"
            :disabled="loading"
          />
        </UFormGroup>

        <UFormGroup v-if="step === 'reset'" label="رمز عبور جدید" name="password" required>
          <UInput
            v-model="form.password"
            type="password"
            placeholder="رمز عبور جدید"
            size="lg"
            :disabled="loading"
          />
        </UFormGroup>

        <UFormGroup v-if="step === 'reset'" label="تکرار رمز عبور جدید" name="confirmPassword" required>
          <UInput
            v-model="form.confirmPassword"
            type="password"
            placeholder="تکرار رمز عبور"
            size="lg"
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
          size="lg"
          :loading="loading"
        >
          {{ step === 'request' ? 'ارسال کد تأیید' : 'بازنشانی رمز عبور' }}
        </UButton>

        <div class="text-center text-sm mt-4">
          <NuxtLink to="/login" class="text-primary-600 hover:underline">
            بازگشت به صفحه ورود
          </NuxtLink>
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'guest' });

const { $api } = useNuxtApp();
const router = useRouter();

const step = ref<'request' | 'reset'>('request');
const form = reactive({
  mobile: '',
  otp: '',
  password: '',
  confirmPassword: '',
});
const loading = ref(false);
const error = ref('');
const success = ref('');

const handleSubmit = async () => {
  error.value = '';
  success.value = '';

  if (step.value === 'request') {
    if (!form.mobile) {
      error.value = 'لطفاً شماره همراه خود را وارد کنید';
      return;
    }
    loading.value = true;
    try {
      await $api.post('/account/send-forget-password-otp', { cellphone: form.mobile });
      step.value = 'reset';
      success.value = 'کد تأیید به شماره همراه شما ارسال شد.';
    } catch (err: any) {
      error.value = err.response?.data?.message || 'خطا در ارسال کد';
    } finally {
      loading.value = false;
    }
  } else {
    // reset password
    if (!form.otp || !form.password || !form.confirmPassword) {
      error.value = 'لطفاً تمام فیلدها را پر کنید';
      return;
    }
    if (form.password !== form.confirmPassword) {
      error.value = 'رمز عبور و تکرار آن مطابقت ندارند';
      return;
    }
    loading.value = true;
    try {
      await $api.post('/account/forget-password', {
        cellphone: form.mobile,
        otp: form.otp,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      success.value = 'رمز عبور با موفقیت تغییر کرد. در حال انتقال به صفحه ورود...';
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      error.value = err.response?.data?.message || 'بازنشانی رمز عبور با خطا مواجه شد';
    } finally {
      loading.value = false;
    }
  }
};
</script>