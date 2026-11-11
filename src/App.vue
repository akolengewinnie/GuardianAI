<template>
  <div class="mx-auto min-h-dvh max-w-md px-4 pt-6 safe-bottom">
    <header class="mb-5 text-center">
      <p class="text-xl font-extrabold tracking-tight text-ink">Guardian</p>
      <p class="text-xs font-semibold text-muted">A little more guidance. A little less overwhelm.</p>
    </header>
    <RouterView />
    <div class="mt-8">
      <SafetyFooter />
    </div>
    <AppNav />
  </div>
</template>

<script setup>
import AppNav from './components/AppNav.vue'
import SafetyFooter from './components/SafetyFooter.vue'
</script>
