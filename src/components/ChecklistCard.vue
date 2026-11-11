<template>
  <section class="overflow-hidden rounded-[16px] bg-surface shadow-sm">
    <button
      type="button"
      class="flex min-h-14 w-full items-center justify-between gap-3 px-4 py-3 text-left"
      :aria-expanded="open"
      @click="open = !open"
    >
      <div>
        <h3 class="text-base font-extrabold text-ink">{{ title }}</h3>
        <p v-if="subtitle" class="text-xs font-semibold text-muted">{{ subtitle }}</p>
      </div>
      <span class="text-muted" aria-hidden="true">{{ open ? '▾' : '▸' }}</span>
    </button>

    <div v-if="open" class="space-y-4 border-t border-black/5 px-4 pb-4 pt-3">
      <div v-for="group in groups" :key="group.id" class="space-y-2">
        <p class="text-xs font-extrabold uppercase tracking-wide text-primary">{{ group.label }}</p>
        <label
          v-for="item in group.items"
          :key="item.id"
          class="flex min-h-12 items-start gap-3 rounded-xl px-1 py-1.5"
        >
          <input
            v-model="item.checked"
            type="checkbox"
            class="mt-1 size-5 shrink-0 accent-primary"
          />
          <span class="text-[15px] leading-snug text-ink">{{ item.label }}</span>
        </label>
      </div>

      <label
        v-for="item in items"
        :key="item.id"
        class="flex min-h-12 items-start gap-3 rounded-xl px-1 py-1.5"
      >
        <input
          v-model="item.checked"
          type="checkbox"
          class="mt-1 size-5 shrink-0 accent-primary"
        />
        <span class="text-[15px] leading-snug text-ink">{{ item.label }}</span>
      </label>

      <label v-if="notes !== undefined" class="block space-y-1.5">
        <span class="text-xs font-extrabold uppercase tracking-wide text-muted">Notes</span>
        <textarea
          :value="notes"
          rows="2"
          placeholder="e.g. touched mashed potatoes"
          class="min-h-16 w-full rounded-xl border border-black/10 bg-canvas px-3 py-2.5 text-[15px] text-ink outline-none focus:border-primary"
          @input="$emit('update:notes', $event.target.value)"
        />
      </label>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: String,
  subtitle: String,
  groups: { type: Array, default: () => [] },
  items: { type: Array, default: () => [] },
  notes: { type: String, default: undefined },
  startOpen: { type: Boolean, default: false },
})

defineEmits(['update:notes'])

const open = ref(props.startOpen)
</script>
