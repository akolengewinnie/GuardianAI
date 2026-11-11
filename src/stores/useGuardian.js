import { computed, reactive } from 'vue'
import { loadState, saveState, blankLearner } from '../lib/storage.js'

const state = reactive(loadState())

function persist() {
  saveState(state)
}

export function useGuardian() {
  const learners = computed(() => state.learners)
  const activeLearner = computed(
    () => state.learners.find((l) => l.id === state.activeLearnerId) || state.learners[0],
  )
  const plans = computed(() =>
    state.plans.filter((p) => p.learnerId === activeLearner.value?.id),
  )
  const logs = computed(() =>
    state.logs.filter((l) => l.learnerId === activeLearner.value?.id),
  )
  const latestPlan = computed(() => plans.value[0] || null)

  function selectLearner(id) {
    state.activeLearnerId = id
    persist()
  }

  function addLearner() {
    const learner = blankLearner()
    state.learners.unshift(learner)
    state.activeLearnerId = learner.id
    persist()
    return learner
  }

  function updateLearner(patch) {
    const learner = activeLearner.value
    if (!learner) return
    Object.assign(learner, patch, { updatedAt: new Date().toISOString() })
    persist()
  }

  function savePlan(plan) {
    state.plans.unshift(plan)
    persist()
    return plan
  }

  function updatePlan(id, patch) {
    const plan = state.plans.find((p) => p.id === id)
    if (!plan) return
    Object.assign(plan, patch)
    persist()
  }

  function addLog(entry) {
    state.logs.unshift(entry)
    persist()
    return entry
  }

  return {
    learners,
    activeLearner,
    plans,
    logs,
    latestPlan,
    selectLearner,
    addLearner,
    updateLearner,
    savePlan,
    updatePlan,
    addLog,
  }
}
