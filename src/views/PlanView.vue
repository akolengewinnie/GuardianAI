<template>
  <div class="space-y-4">
    <header class="space-y-1">
      <p class="text-xs font-extrabold uppercase tracking-[0.14em] text-primary">Today's Plan</p>
      <h1 class="text-[1.65rem] font-extrabold leading-tight text-ink">
        A little more guidance.
      </h1>
      <p class="text-sm text-muted">A little less overwhelm. For {{ activeLearner.preferredName || 'your learner' }}.</p>
    </header>

    <section class="space-y-4 rounded-[16px] bg-surface p-4 shadow-sm">
      <div class="space-y-2">
        <p class="text-sm font-bold">Battery right now</p>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="level in batteries"
            :key="level"
            type="button"
            class="min-h-12 rounded-xl text-sm font-extrabold"
            :class="battery === level ? tone[level] : 'bg-canvas text-ink'"
            @click="battery = level"
          >
            {{ level }}
          </button>
        </div>
        <p class="text-xs leading-snug text-muted">
          {{ activeLearner.batteryNotes?.[battery.toLowerCase()] }}
        </p>
      </div>

      <div class="space-y-2">
        <p class="text-sm font-bold">Time</p>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="mins in [15, 30, 45]"
            :key="mins"
            type="button"
            class="min-h-12 rounded-xl text-sm font-extrabold"
            :class="time === mins ? 'bg-primary text-white' : 'bg-canvas text-ink'"
            @click="time = mins"
          >
            {{ mins }} min
          </button>
        </div>
      </div>

      <div class="space-y-2">
        <p class="text-sm font-bold">Focus</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="item in focuses"
            :key="item"
            type="button"
            class="min-h-11 rounded-full px-3.5 text-sm font-bold"
            :class="focus === item ? 'bg-primary text-white' : 'bg-canvas text-ink'"
            @click="focus = item"
          >
            {{ item }}
          </button>
        </div>
      </div>
    </section>

    <p v-if="!activeLearner.checklists" class="rounded-[16px] bg-surface px-4 py-4 text-sm text-muted shadow-sm">
      Save a learner profile with checklists first. The plan uses those observations.
    </p>

    <p v-if="error" class="text-sm font-bold text-secondary">{{ error }}</p>

    <button
      type="button"
      class="min-h-14 w-full rounded-[16px] bg-primary text-base font-extrabold text-white shadow-sm disabled:opacity-50"
      :disabled="loading || !activeLearner.checklists"
      @click="createPlan"
    >
      {{ loading ? 'Generating…' : 'Generate Plan' }}
    </button>

    <article v-if="latestPlan" class="space-y-3 rounded-[16px] bg-surface p-4 shadow-sm">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-xs font-extrabold uppercase tracking-wide text-secondary">{{ latestPlan.focus }} · {{ latestPlan.time }} min · {{ latestPlan.battery }}</p>
          <h2 class="text-xl font-extrabold text-ink">{{ latestPlan.title }}</h2>
        </div>
        <span
          class="rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase"
          :class="latestPlan.status === 'done' ? 'bg-primary/15 text-primary' : 'bg-canvas text-muted'"
        >
          {{ latestPlan.status }}
        </span>
      </div>
      <p class="text-sm leading-relaxed text-ink">{{ latestPlan.summary }}</p>
      <ol class="space-y-2">
        <li v-for="(step, i) in latestPlan.steps" :key="i" class="flex gap-3 text-[15px] leading-snug">
          <span class="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-extrabold text-primary">{{ i + 1 }}</span>
          <span>{{ step }}</span>
        </li>
      </ol>
      <p class="text-sm text-muted"><span class="font-bold text-ink">Materials:</span> {{ latestPlan.materials.join(', ') }}</p>
      <p class="rounded-xl bg-canvas px-3 py-2.5 text-sm font-semibold leading-snug text-ink">
        Supports: {{ supportLine(latestPlan) }}
      </p>
      <p class="text-xs leading-snug text-muted">{{ latestPlan.why }}</p>
      <RouterLink
        v-if="latestPlan.status !== 'done'"
        to="/progress"
        class="flex min-h-12 items-center justify-center rounded-xl bg-secondary text-sm font-extrabold text-white"
      >
        Log this on Progress
      </RouterLink>
    </article>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { generatePlan } from '../lib/api.js'
import { useGuardian } from '../stores/useGuardian.js'

const batteries = ['Green', 'Yellow', 'Red']
const focuses = ['Reading', 'Maths', 'Communication', 'Sensory', 'Social', 'Feeding']
const tone = {
  Green: 'bg-primary text-white',
  Yellow: 'bg-amber-500 text-white',
  Red: 'bg-secondary text-white',
}

const { activeLearner, latestPlan, savePlan } = useGuardian()

const battery = ref('Yellow')
const time = ref(15)
const focus = ref('Reading')
const loading = ref(false)
const error = ref('')

async function createPlan() {
  loading.value = true
  error.value = ''
  try {
    const plan = await generatePlan({
      learner: JSON.parse(JSON.stringify(activeLearner.value)),
      battery: battery.value,
      time: time.value,
      focus: focus.value,
    })
    savePlan(plan)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

function supportLine(plan) {
  return (plan.supports || []).map((item) => `${item.category} - ${item.label}`).join(' + ')
}
</script>
