<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-20 border-t border-black/5 bg-surface/95 backdrop-blur"
    :style="{ paddingBottom: 'env(safe-area-inset-bottom)' }"
  >
    <ul class="mx-auto grid max-w-md grid-cols-3 px-2 py-2">
      <li v-for="item in items" :key="item.to">
        <RouterLink
          v-slot="{ href, navigate, isActive, isExactActive }"
          :to="item.to"
          custom
        >
          <a
            :href="href"
            class="flex min-h-12 flex-col items-center justify-center rounded-xl px-2 text-[13px] font-semibold"
            :class="(item.to === '/' ? isExactActive : isActive) ? 'bg-primary/10 text-primary' : 'text-muted'"
            @click="navigate"
          >
            {{ item.label }}
          </a>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup>
const items = [
  { to: '/', label: 'Learners' },
  { to: '/plan', label: "Today's Plan" },
  { to: '/progress', label: 'Progress' },
]
</script>
