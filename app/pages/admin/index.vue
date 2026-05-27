<script setup>
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
});
</script>

<template>
  <div>
    <h1 class="text-4xl font-bold">Admin Dashboard</h1>
  </div>
</template>
