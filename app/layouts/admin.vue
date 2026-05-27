<template>
  <div class="min-h-screen bg-slate-100 dark:bg-slate-900">
    <!-- Sidebar -->
    <aside
      class="fixed right-0 top-0 h-screen w-64 bg-white dark:bg-slate-800 shadow-xl border-l border-slate-200 dark:border-slate-700"
    >
      <div class="p-6">
        <h1 class="text-2xl font-bold text-primary-600">پنل مدیریت</h1>
      </div>

      <nav class="px-4 space-y-2">
        <NuxtLink
          to="/admin"
          class="block p-3 rounded-xl hover:bg-primary-50 dark:hover:bg-slate-700"
        >
          داشبورد
        </NuxtLink>
      </nav>
    </aside>

    <!-- Content -->
    <main class="mr-64 p-8">
      <slot />
    </main>
  </div>
</template>
