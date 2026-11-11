<template>
  <div class="space-y-4">
    <header class="space-y-1">
      <p class="text-xs font-extrabold uppercase tracking-[0.14em] text-primary">My Learners</p>
      <h1 class="text-[1.65rem] font-extrabold leading-tight text-ink">Learner profile</h1>
      <p class="text-sm text-muted">Every child is different. No diagnosis, no prescriptions.</p>
    </header>

    <div class="flex gap-2 overflow-x-auto pb-1">
      <button
        v-for="person in learners"
        :key="person.id"
        type="button"
        class="min-h-11 shrink-0 rounded-full px-4 text-sm font-bold"
        :class="person.id === activeLearner.id ? 'bg-primary text-white' : 'bg-surface text-ink'"
        @click="selectLearner(person.id)"
      >
        {{ person.preferredName || 'New learner' }}
      </button>
      <button
        type="button"
        class="min-h-11 shrink-0 rounded-full border border-dashed border-primary/40 px-4 text-sm font-bold text-primary"
        @click="addLearner()"
      >
        + Add
      </button>
    </div>

    <section class="space-y-4 rounded-[16px] bg-surface p-4 shadow-sm">
      <p class="text-xs font-extrabold uppercase tracking-wide text-secondary">Section A · Basic</p>

      <label class="block space-y-1.5">
        <span class="text-sm font-bold">Preferred name</span>
        <input
          v-model="form.preferredName"
          type="text"
          placeholder="e.g. Myles"
          class="min-h-12 w-full rounded-xl border border-black/10 bg-canvas px-3 text-[16px] outline-none focus:border-primary"
        />
      </label>

      <label class="block space-y-1.5">
        <span class="text-sm font-bold">Age</span>
        <input
          v-model.number="form.age"
          type="number"
          min="2"
          max="12"
          inputmode="numeric"
          placeholder="2–12"
          class="min-h-12 w-full rounded-xl border border-black/10 bg-canvas px-3 text-[16px] outline-none focus:border-primary"
          @change="onAgeEntered"
        />
      </label>

      <div class="space-y-2">
        <p class="text-sm font-bold">Interests <span class="font-semibold text-muted">(up to 3)</span></p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="chip in interestOptions"
            :key="chip"
            type="button"
            class="min-h-11 rounded-full px-3.5 text-sm font-bold"
            :class="form.interests.includes(chip) ? 'bg-primary text-white' : 'bg-canvas text-ink'"
            @click="toggleInterest(chip)"
          >
            {{ chip }}
          </button>
        </div>
        <div class="flex gap-2">
          <input
            v-model="customInterest"
            type="text"
            placeholder="Add another"
            class="min-h-12 flex-1 rounded-xl border border-black/10 bg-canvas px-3 text-[16px] outline-none focus:border-primary"
            @keydown.enter.prevent="addCustomInterest"
          />
          <button
            type="button"
            class="min-h-12 rounded-xl bg-primary px-4 font-bold text-white"
            @click="addCustomInterest"
          >
            Add
          </button>
        </div>
      </div>
    </section>

    <section class="space-y-3">
      <p class="px-1 text-xs font-extrabold uppercase tracking-wide text-secondary">
        Section B · Age-based checklists
      </p>

      <div
        v-if="loadingChecklists"
        class="flex min-h-32 flex-col items-center justify-center gap-3 rounded-[16px] bg-surface p-6 text-center shadow-sm"
      >
        <div class="size-8 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" />
        <p class="font-bold text-ink">
          Generating age-appropriate checklists for {{ form.age }}-year-old...
        </p>
      </div>

      <p v-else-if="!form.checklists" class="rounded-[16px] bg-surface px-4 py-6 text-center text-sm text-muted shadow-sm">
        Enter an age (2–12) to generate checklists.
      </p>

      <template v-else>
        <ChecklistCard
          :title="form.checklists.sensory.title"
          :subtitle="form.checklists.sensory.subtitle"
          :groups="form.checklists.sensory.groups"
          start-open
        />
        <ChecklistCard
          :title="form.checklists.communication.title"
          :subtitle="form.checklists.communication.subtitle"
          :items="form.checklists.communication.items"
        />
        <ChecklistCard
          :title="form.checklists.social.title"
          :subtitle="form.checklists.social.subtitle"
          :items="form.checklists.social.items"
        />
        <ChecklistCard
          :title="form.checklists.feeding.title"
          :subtitle="form.checklists.feeding.subtitle"
          :items="form.checklists.feeding.items"
          :notes="form.checklists.feeding.notes"
          @update:notes="form.checklists.feeding.notes = $event"
        />
      </template>
    </section>

    <section class="space-y-3 rounded-[16px] bg-surface p-4 shadow-sm">
      <p class="text-xs font-extrabold uppercase tracking-wide text-secondary">Section C · Strengths & battery</p>

      <label class="block space-y-1.5">
        <span class="text-sm font-bold">Strengths</span>
        <textarea
          v-model="form.strengths"
          rows="3"
          placeholder="What already works well?"
          class="min-h-24 w-full rounded-xl border border-black/10 bg-canvas px-3 py-2.5 text-[16px] outline-none focus:border-primary"
        />
      </label>

      <div class="space-y-3">
        <p class="text-sm font-bold">Battery notes</p>
        <label v-for="level in batteryLevels" :key="level.key" class="block space-y-1.5">
          <span class="text-sm font-bold" :class="level.color">{{ level.label }}</span>
          <textarea
            v-model="form.batteryNotes[level.key]"
            rows="2"
            :placeholder="level.placeholder"
            class="min-h-16 w-full rounded-xl border border-black/10 bg-canvas px-3 py-2.5 text-[16px] outline-none focus:border-primary"
          />
        </label>
      </div>
    </section>

    <p v-if="error" class="text-sm font-bold text-secondary">{{ error }}</p>
    <p v-if="savedAt" class="text-sm font-bold text-primary">Saved on this device.</p>

    <button
      type="button"
      class="min-h-14 w-full rounded-[16px] bg-primary text-base font-extrabold text-white shadow-sm"
      @click="save"
    >
      Save profile
    </button>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import ChecklistCard from '../components/ChecklistCard.vue'
import { generateChecklists } from '../lib/api.js'
import { ageGroupFor } from '../lib/checklistsByAge.js'
import { useGuardian } from '../stores/useGuardian.js'

const SUGGESTED = ['scooter', 'painting', 'blocks', 'dinosaurs', 'music', 'water', 'trains', 'animals']
const batteryLevels = [
  { key: 'green', label: 'Green', color: 'text-primary', placeholder: 'What green looks like for this child' },
  { key: 'yellow', label: 'Yellow', color: 'text-amber-700', placeholder: 'What yellow looks like for this child' },
  { key: 'red', label: 'Red', color: 'text-secondary', placeholder: 'What red looks like for this child' },
]

const { learners, activeLearner, selectLearner, addLearner, updateLearner } = useGuardian()

const form = reactive(cloneLearner(activeLearner.value))
const customInterest = ref('')
const loadingChecklists = ref(false)
const error = ref('')
const savedAt = ref('')
const lastGeneratedGroup = ref(form.checklists?.ageGroup || null)

const interestOptions = computed(() => {
  const extra = form.interests.filter((item) => !SUGGESTED.includes(item))
  return [...SUGGESTED, ...extra]
})

watch(
  () => activeLearner.value?.id,
  () => {
    Object.assign(form, cloneLearner(activeLearner.value))
    lastGeneratedGroup.value = form.checklists?.ageGroup || null
    savedAt.value = ''
    error.value = ''
    if (form.age && !form.checklists) onAgeEntered()
  },
)

watch(
  () => form.checklists,
  (value) => {
    if (!value || loadingChecklists.value) return
    updateLearner({ checklists: value })
  },
  { deep: true },
)

onMounted(() => {
  if (form.age && !form.checklists) onAgeEntered()
})

function cloneLearner(learner) {
  return JSON.parse(JSON.stringify(learner))
}

function toggleInterest(chip) {
  const i = form.interests.indexOf(chip)
  if (i >= 0) form.interests.splice(i, 1)
  else if (form.interests.length < 3) form.interests.push(chip)
}

function addCustomInterest() {
  const value = customInterest.value.trim().toLowerCase()
  if (!value) return
  if (!form.interests.includes(value) && form.interests.length < 3) {
    form.interests.push(value)
  }
  customInterest.value = ''
}

async function onAgeEntered() {
  const age = Number(form.age)
  if (!age || age < 2 || age > 12) return

  const group = ageGroupFor(age)
  if (form.checklists && lastGeneratedGroup.value === group) return

  loadingChecklists.value = true
  error.value = ''
  try {
    const data = await generateChecklists(age)
    form.checklists = data
    lastGeneratedGroup.value = data.ageGroup
    updateLearner({
      preferredName: form.preferredName.trim(),
      age: form.age,
      interests: [...form.interests],
      checklists: data,
    })
  } catch (err) {
    error.value = err.message
  } finally {
    loadingChecklists.value = false
  }
}

function save() {
  updateLearner({
    preferredName: form.preferredName.trim(),
    age: form.age,
    interests: [...form.interests],
    checklists: form.checklists,
    strengths: form.strengths,
    batteryNotes: { ...form.batteryNotes },
  })
  savedAt.value = new Date().toISOString()
}
</script>
