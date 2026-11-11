<template>
  <div class="space-y-4">
    <header class="space-y-1">
      <p class="text-xs font-extrabold uppercase tracking-[0.14em] text-primary">Log & Progress</p>
      <h1 class="text-[1.65rem] font-extrabold leading-tight text-ink">Notice, don’t score</h1>
      <p class="text-sm text-muted">Checklist practice for {{ activeLearner.preferredName || 'your learner' }} this week.</p>
    </header>

    <section class="rounded-[16px] bg-surface p-4 shadow-sm">
      <p class="text-xs font-extrabold uppercase tracking-wide text-secondary">Weekly summary</p>
      <p class="mt-2 text-[17px] font-bold leading-snug text-ink">{{ weeklyLine }}</p>
      <p class="mt-1 text-xs text-muted">No score. Educational support only.</p>
    </section>

    <section v-if="openPlan" class="space-y-3 rounded-[16px] bg-surface p-4 shadow-sm">
      <p class="text-xs font-extrabold uppercase tracking-wide text-secondary">Today’s plan</p>
      <h2 class="text-lg font-extrabold">{{ openPlan.title }}</h2>
      <p class="text-sm text-muted">{{ openPlan.focus }} · {{ openPlan.time }} min · {{ openPlan.battery }} battery</p>
      <p class="rounded-xl bg-canvas px-3 py-2.5 text-sm font-semibold">Supports: {{ supportLine(openPlan) }}</p>

      <form class="space-y-3" @submit.prevent="markDone">
        <div class="space-y-2">
          <p class="text-sm font-bold">Battery after</p>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="level in ['Green', 'Yellow', 'Red']"
              :key="level"
              type="button"
              class="min-h-12 rounded-xl text-sm font-extrabold"
              :class="log.battery === level ? batteryClass[level] : 'bg-canvas text-ink'"
              @click="log.battery = level"
            >
              {{ level }}
            </button>
          </div>
        </div>

        <label class="block space-y-1.5">
          <span class="text-sm font-bold">Response method</span>
          <select
            v-model="log.responseMethod"
            class="min-h-12 w-full rounded-xl border border-black/10 bg-canvas px-3 text-[16px] outline-none focus:border-primary"
          >
            <option v-for="method in methods" :key="method" :value="method">{{ method }}</option>
          </select>
        </label>

        <label class="block space-y-1.5">
          <span class="text-sm font-bold">Observation</span>
          <textarea
            v-model="log.observation"
            rows="3"
            placeholder="What did you notice? Keep it kind and specific."
            class="min-h-24 w-full rounded-xl border border-black/10 bg-canvas px-3 py-2.5 text-[16px] outline-none focus:border-primary"
          />
        </label>

        <div class="space-y-2">
          <p class="text-sm font-bold">Practiced (auto-ticked)</p>
          <label
            v-for="item in practiced"
            :key="item.id + item.category"
            class="flex min-h-12 items-start gap-3"
          >
            <input type="checkbox" checked disabled class="mt-1 size-5 accent-primary" />
            <span class="text-[15px] leading-snug">{{ item.category }} — {{ item.label }}</span>
          </label>
        </div>

        <button type="submit" class="min-h-14 w-full rounded-[16px] bg-primary text-base font-extrabold text-white">
          Mark Done
        </button>
      </form>
    </section>

    <p v-else class="rounded-[16px] bg-surface px-4 py-6 text-center text-sm text-muted shadow-sm">
      Generate a plan first, then come back to mark it done.
    </p>

    <section v-if="logs.length" class="space-y-2">
      <p class="px-1 text-xs font-extrabold uppercase tracking-wide text-muted">Recent logs</p>
      <article
        v-for="entry in logs"
        :key="entry.id"
        class="space-y-1.5 rounded-[16px] bg-surface p-4 shadow-sm"
      >
        <p class="text-xs font-extrabold uppercase tracking-wide text-primary">
          {{ formatDate(entry.at) }} · {{ entry.battery }} · {{ entry.responseMethod }}
        </p>
        <p class="text-sm font-bold">{{ entry.planTitle }}</p>
        <p class="text-sm leading-snug text-ink">{{ entry.observation || 'No observation noted.' }}</p>
        <p class="text-xs text-muted">
          Practiced: {{ (entry.practicedItems || []).map((i) => `${i.category} — ${i.label}`).join('; ') }}
        </p>
      </article>
    </section>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useGuardian } from '../stores/useGuardian.js'

const methods = ['Spoken words', 'Gesture', 'Pointing', 'Picture / AAC', 'Drawing', 'Movement']
const batteryClass = {
  Green: 'bg-primary text-white',
  Yellow: 'bg-amber-500 text-white',
  Red: 'bg-secondary text-white',
}

const { activeLearner, latestPlan, logs, addLog, updatePlan } = useGuardian()

const openPlan = computed(() =>
  latestPlan.value && latestPlan.value.status !== 'done' ? latestPlan.value : null,
)

const practiced = computed(() => openPlan.value?.supports || [])

const log = reactive({
  battery: latestPlan.value?.battery || 'Yellow',
  responseMethod: 'Spoken words',
  observation: '',
})

const weeklyLine = computed(() => {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const counts = {}
  for (const entry of logs.value) {
    if (new Date(entry.at).getTime() < weekAgo) continue
    for (const item of entry.practicedItems || []) {
      counts[item.category] = (counts[item.category] || 0) + 1
    }
  }
  const parts = Object.entries(counts).map(([category, n]) => `${n} ${category}`)
  if (!parts.length) return 'Practiced: nothing logged yet this week. No score.'
  return `Practiced: ${parts.join(', ')} items. No score.`
})

function supportLine(plan) {
  return (plan.supports || []).map((item) => `${item.category} - ${item.label}`).join(' + ')
}

function markDone() {
  const plan = openPlan.value
  if (!plan) return
  addLog({
    id: crypto.randomUUID(),
    learnerId: activeLearner.value.id,
    planId: plan.id,
    planTitle: plan.title,
    at: new Date().toISOString(),
    battery: log.battery,
    responseMethod: log.responseMethod,
    observation: log.observation.trim(),
    practicedItems: [...(plan.supports || [])],
  })
  updatePlan(plan.id, { status: 'done' })
  log.observation = ''
}

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })
}
</script>
