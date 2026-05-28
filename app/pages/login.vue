<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4">
    <UCard class="w-full max-w-md shadow-xl">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold text-primary-600">ورود به سامانه</h1>
          <p class="text-slate-500 dark:text-slate-400 mt-1">لطفاً وارد حساب کاربری خود شوید</p>
        </div>
      </template>

      <!-- RTL-aware tab buttons -->
      <div class="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1 mb-6">
        <button
          type="button"
          @click="activeTab = 'password'"
          :class="[
            'flex-1 py-2 text-sm font-medium transition-all rounded-e-lg',
            activeTab === 'password'
              ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm rounded-e-none'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          ]"
        >
          ورود با رمز عبور
        </button>
        <button
          type="button"
          @click="activeTab = 'otp'"
          :class="[
            'flex-1 py-2 text-sm font-medium transition-all  rounded-s-lg',
            activeTab === 'otp'
              ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm rounded-s-none'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          ]"
        >
          ورود با رمز یکبار مصرف
        </button>
      </div>

      <UForm :state="form" @submit="handleSubmit" class="space-y-4">
        <UFormField label="نام کاربری یا شماره همراه" name="username" required>
          <UInput
            v-model="form.username"
            placeholder="نام کاربری یا 09123456789"
            size="lg"
            input-class="text-left py-3 px-4"
            :disabled="loading"
          />
        </UFormField>

        <UFormField v-if="activeTab === 'password'" label="رمز عبور" name="password" required>
          <UInput
            v-model="form.password"
            type="password"
            placeholder="رمز عبور خود را وارد کنید"
            size="lg"
            input-class="text-left py-3 px-4"
            :disabled="loading"
          />
        </UFormField>

        <UFormField v-if="activeTab === 'otp'" label="رمز یکبار مصرف" name="otp" required>
          <div class="flex gap-2">
            <UInput
              v-model="form.otp"
              type="text"
              placeholder="کد ۶ رقمی"
              size="lg"
              class="flex-1"
              input-class="text-left py-3 px-4"
              :disabled="loading || !otpSent"
            />
            <UButton
              color="primary"
              variant="outline"
              :loading="sendingOtp"
              :disabled="!form.username || sendingOtp || otpCooldown > 0"
              @click="sendOtp"
            >
              {{ otpCooldown > 0 ? `${otpCooldown} ثانیه` : 'ارسال کد' }}
            </UButton>
          </div>
          <p v-if="otpSent && !otpCooldown" class="text-sm text-green-600 mt-1">
            کد یکبار مصرف به شماره همراه شما ارسال شد.
          </p>
        </UFormField>

        <div v-if="error" class="mt-2">
          <UAlert color="red" :title="error" />
        </div>

        <UButton
          type="submit"
          color="primary"
          block
          size="lg"
          :loading="loading"
          :disabled="loading"
        >
          {{ loading ? 'در حال ورود...' : 'ورود' }}
        </UButton>

        <div class="text-center text-sm mt-4">
          <NuxtLink to="/forgot-password" class="text-primary-600 hover:underline">
            رمز عبور خود را فراموش کرده‌اید؟
          </NuxtLink>
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'guest' });

const { $api } = useNuxtApp();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const activeTab = ref(route.query.tab === 'otp' ? 'otp' : 'password');

const form = reactive({
  username: '',
  password: '',
  otp: '',
});

const loading = ref(false);
const error = ref('');
const otpSent = ref(false);
const sendingOtp = ref(false);
const otpCooldown = ref(0);
let cooldownTimer: NodeJS.Timeout;

const handleSubmit = async () => {
  error.value = '';
  loading.value = true;

  try {
    if (activeTab.value === 'password') {
      if (!form.username || !form.password) {
        error.value = 'لطفاً نام کاربری و رمز عبور را وارد کنید';
        return;
      }
      const response = await $api.post('/account/sign-in-by-password', {
        userName: form.username,
        password: form.password,
      });
      const data = response.data.data;
      authStore.setAuth(data);
      const redirect = sessionStorage.getItem('redirectAfterLogin') || data.panelUrl || '/';
      sessionStorage.removeItem('redirectAfterLogin');
      await router.push(redirect);
    } else {
      if (!form.username || !form.otp) {
        error.value = 'لطفاً شماره همراه و کد یکبار مصرف را وارد کنید';
        return;
      }
      const response = await $api.post('/account/sign-in-by/otp', {
        cellphone: form.username,
        otp: form.otp,
      });
      const data = response.data.data;
      authStore.setAuth(data);
      const redirect = sessionStorage.getItem('redirectAfterLogin') || data.panelUrl || '/';
      sessionStorage.removeItem('redirectAfterLogin');
      await router.push(redirect);
    }
  } catch (err: any) {
    console.error(err);
    if (err.response?.status === 401) {
      error.value = 'نام کاربری، رمز عبور یا کد وارد شده صحیح نیست';
    } else if (err.code === 'ERR_NETWORK') {
      error.value = 'خطا در ارتباط با سرور. لطفاً مجدد تلاش کنید';
    } else {
      error.value = err.response?.data?.message || 'خطا در ورود به سیستم';
    }
  } finally {
    loading.value = false;
  }
};

const sendOtp = async () => {
  if (!form.username) {
    error.value = 'لطفاً شماره همراه خود را وارد کنید';
    return;
  }
  sendingOtp.value = true;
  error.value = '';
  try {
    await $api.post('/account/send-otp', { cellphone: form.username });
    otpSent.value = true;
    otpCooldown.value = 60;
    cooldownTimer = setInterval(() => {
      if (otpCooldown.value <= 1) {
        clearInterval(cooldownTimer);
        otpCooldown.value = 0;
      } else {
        otpCooldown.value--;
      }
    }, 1000);
  } catch (err: any) {
    error.value = err.response?.data?.message || 'ارسال کد با خطا مواجه شد';
  } finally {
    sendingOtp.value = false;
  }
};

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer);
});
</script>