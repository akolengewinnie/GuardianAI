import { generateChecklists } from './checklistsByAge.js'

const KEY = 'guardian.v1'

const defaultBatteryNotes = {
  green: 'Present, curious, can try a little more.',
  yellow: 'Okay with support. Keep it short.',
  red: 'Needs comfort and familiar things. Low demand.',
}

function blankLearner() {
  return {
    id: crypto.randomUUID(),
    preferredName: '',
    age: '',
    interests: [],
    checklists: null,
    strengths: '',
    batteryNotes: { ...defaultBatteryNotes },
    updatedAt: new Date().toISOString(),
  }
}

function seedMyles() {
  return {
    id: 'learner-myles',
    preferredName: 'Myles',
    age: 6,
    interests: ['scooter', 'painting', 'blocks'],
    checklists: generateChecklists(6),
    strengths: 'Curious, loves movement, lights up with colour and painting.',
    batteryNotes: {
      green: 'Bouncy, chatting in short sentences, wants scooter or painting.',
      yellow: 'Quieter, needs prompts, still okay with a short familiar activity.',
      red: 'Covers ears, wants dim light, needs familiar food and no extra asks.',
    },
    updatedAt: new Date().toISOString(),
  }
}

function emptyState() {
  const myles = seedMyles()
  return {
    learners: [myles],
    activeLearnerId: myles.id,
    plans: [],
    logs: [],
  }
}

function hydrateLearner(learner) {
  if (learner.age && !learner.checklists) {
    learner.checklists = generateChecklists(learner.age)
  }
  return learner
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return emptyState()
    const parsed = JSON.parse(raw)
    if (!parsed.learners?.length) return emptyState()
    return {
      learners: parsed.learners.map(hydrateLearner),
      activeLearnerId: parsed.activeLearnerId || parsed.learners[0].id,
      plans: parsed.plans || [],
      logs: parsed.logs || [],
    }
  } catch {
    return emptyState()
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export { blankLearner, defaultBatteryNotes }
