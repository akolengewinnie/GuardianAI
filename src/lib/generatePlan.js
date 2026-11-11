import { flattenChecked } from './checklistsByAge.js'

const FOCUS_TO_CATEGORY = {
  Reading: 'Communication',
  Maths: 'Communication',
  Communication: 'Communication',
  Sensory: 'Sensory',
  Social: 'Social',
  Feeding: 'Feeding',
}

function pick(items, count = 1) {
  return items.slice(0, count)
}

function findByKeywords(checked, keywords) {
  return checked
    .map((item) => {
      const label = item.label.toLowerCase()
      const score = keywords.findIndex((word) => label.includes(word))
      return { item, score: score === -1 ? 99 : score }
    })
    .filter((entry) => entry.score < 99)
    .sort((a, b) => a.score - b.score)
    .map((entry) => entry.item)
}

function firstInterest(learner) {
  return learner.interests?.[0] || 'a favourite activity'
}

function interestPhrase(learner) {
  const list = (learner.interests || []).filter(Boolean)
  if (!list.length) return 'something familiar'
  if (list.length === 1) return list[0]
  return `${list[0]} and ${list[1]}`
}

export function generatePlan({ learner, battery, time, focus }) {
  const minutes = Number(time) || 15
  const name = learner.preferredName || 'your learner'
  const checked = flattenChecked(learner.checklists)
  const focusCategory = FOCUS_TO_CATEGORY[focus] || 'Communication'
  const focusItems = checked.filter((item) => item.category === focusCategory)
  const sensory = checked.filter((item) => item.category === 'Sensory')
  const communication = checked.filter((item) => item.category === 'Communication')
  const interest = firstInterest(learner)
  const interests = interestPhrase(learner)

  const movement = findByKeywords(sensory, ['scooter', 'swing', 'jump', 'bike', 'movement', 'bounce'])
  const drawing = findByKeywords(sensory, ['draw', 'paint', 'craft', 'color', 'bright'])
  const help = findByKeywords(communication, ['help', 'request'])
  const sentences = findByKeywords(communication, ['sentence', 'question', 'share', 'word'])
  const feedingSoft = findByKeywords(checked, ['soft', 'familiar', 'touch', 'spoon', 'cup', 'table'])

  const supports = []
  const addSupport = (item) => {
    if (!item) return
    if (supports.some((s) => s.category === item.category && s.label === item.label)) return
    supports.push({ category: item.category, label: item.label, id: item.id })
  }

  const batteryCue = {
    Green: `Energy looks steady. Keep it playful and let ${name} lead a little.`,
    Yellow: `Keep it short and supported. Pause if ${name} starts to fade.`,
    Red: `Stay with the familiar. Low demand, lots of comfort, easy to stop.`,
  }[battery] || `Follow ${name}’s pace.`

  const plan = buildActivity({
    name,
    minutes,
    focus,
    battery,
    interest,
    interests,
    movement,
    drawing,
    help,
    sentences,
    feedingSoft,
    focusItems,
  })

  plan.supports.forEach(addSupport)
  pick(focusItems, 2).forEach(addSupport)
  if (focus !== 'Sensory') pick(movement.length ? movement : sensory, 1).forEach(addSupport)
  if (!supports.length) pick(checked, 2).forEach(addSupport)

  return {
    id: crypto.randomUUID(),
    learnerId: learner.id,
    createdAt: new Date().toISOString(),
    battery,
    time: minutes,
    focus,
    title: plan.title,
    summary: plan.summary,
    steps: plan.steps,
    materials: plan.materials,
    why: `${batteryCue} Educational support only — not a lesson prescription.`,
    supports: supports.slice(0, 3),
    status: 'ready',
    source: 'mock-ai-v1',
  }
}

function buildActivity(ctx) {
  const { name, minutes, focus, battery, interest, interests, movement, drawing, help, sentences, feedingSoft, focusItems } = ctx
  const moveLabel = movement[0]?.label || 'a short movement break'
  const helpLabel = help[0]?.label || 'Requests help'
  const drawLabel = drawing[0]?.label || 'Likes drawing/painting'
  const talkLabel = sentences[0]?.label || focusItems[0]?.label || 'Uses short sentences'
  const feedLabel = feedingSoft[0]?.label || 'Prefers familiar foods'
  const low = battery === 'Red'

  if (focus === 'Reading') {
    return {
      title: low ? `Quiet ${interest} picture look` : `${capitalize(interest)} letter hunt`,
      summary: `A ${minutes}-minute reading moment woven into ${interests}.`,
      materials: ['2–4 familiar letters or word cards', interest, 'a favourite book or pictures'],
      supports: [
        help[0] && { category: 'Communication', label: helpLabel, id: help[0].id },
        movement[0] && { category: 'Sensory', label: movement[0].label, id: movement[0].id },
      ].filter(Boolean),
      steps: low
        ? [
            `Sit somewhere calm with ${name}. Offer one familiar book or picture.`,
            `Name 1–2 letters or pictures. Wait. Accept pointing, a word, or a look.`,
            `If ${name} wants ${interest} nearby, that’s fine. Stop while it still feels easy.`,
          ]
        : [
            `Set out ${minutes} minutes and 3 letter cards ${name} already knows.`,
            `Invite a ${interest} ride or walk between cards. Model one word, then wait.`,
            `Celebrate any request for help (${helpLabel.toLowerCase()}). End with a favourite page.`,
          ],
    }
  }

  if (focus === 'Maths') {
    return {
      title: low ? `Gentle counting with ${interest}` : `Count-and-go with ${interest}`,
      summary: `Number play for ${minutes} minutes using ${interests}.`,
      materials: ['5 familiar objects', interest, 'optional number cards 1–5'],
      supports: [
        sentences[0] && { category: 'Communication', label: talkLabel, id: sentences[0].id },
        movement[0] && { category: 'Sensory', label: movement[0].label, id: movement[0].id },
      ].filter(Boolean),
      steps: [
        `Place 3–5 favourite items in a line. Count them slowly with ${name}.`,
        low
          ? `Touch each object together. No need to say the number if a point or look is easier.`
          : `Move, jump, or scooter to the next object after each count if ${moveLabel.toLowerCase()} fits.`,
        `Ask “how many?” once. Accept any response. Put materials away together.`,
      ],
    }
  }

  if (focus === 'Communication') {
    return {
      title: low ? `One-word check-in` : `Help me / tell me game`,
      summary: `Practice everyday language for ${minutes} minutes.`,
      materials: ['two picture choices', 'a small preferred item', interest],
      supports: [
        help[0] && { category: 'Communication', label: helpLabel, id: help[0].id },
        movement[0] && { category: 'Sensory', label: movement[0].label, id: movement[0].id },
      ].filter(Boolean),
      steps: [
        `Offer two clear choices (including ${interest}). Wait longer than feels comfortable.`,
        `Model ${helpLabel.toLowerCase()} once: “help, please” or a picture. Do not insist on speech.`,
        `If energy allows, draw or paint one thing from the day (${drawLabel.toLowerCase()}).`,
      ],
    }
  }

  if (focus === 'Sensory') {
    return {
      title: low ? `Calm body, familiar feel` : `${capitalize(interest)} body break`,
      summary: `A ${minutes}-minute sensory pause matched to ${name}’s checklist.`,
      materials: [interest, 'optional soft pressure (cushion/blanket)', 'dimmer lighting if possible'],
      supports: pick(movement.length ? movement : drawing.length ? drawing : ctx.focusItems, 2),
      steps: [
        `Check lights and sound. Dim if ${name} prefers it.`,
        low
          ? `Offer a familiar movement or pressure for a few minutes. Stay nearby. No extra asks.`
          : `Invite ${interest} or ${moveLabel.toLowerCase()} for most of the time. Keep language light.`,
        `Finish with a still moment (sit, squeeze, or look at a favourite colour).`,
      ],
    }
  }

  if (focus === 'Social') {
    return {
      title: low ? `Side-by-side play` : `Short turn-taking with ${interest}`,
      summary: `Low-pressure social practice for ${minutes} minutes.`,
      materials: [interest, 'one extra toy to share', 'a timer if useful'],
      supports: pick(focusItems, 2),
      steps: [
        `Start alongside ${name}, not face-to-face. Copy their play with ${interest}.`,
        `Take one short turn. Prompt sharing only once if it still feels easy.`,
        `End after a success, even a tiny one. Name what went well in plain words.`,
      ],
    }
  }

  return {
    title: low ? `Familiar food, no pressure` : `Look, touch, maybe taste`,
    summary: `A ${minutes}-minute feeding observation with ${name}.`,
    materials: ['one familiar food', 'one new or less-preferred food nearby', 'usual cup or spoon'],
    supports: [
      feedingSoft[0] && { category: 'Feeding', label: feedLabel, id: feedingSoft[0].id },
      help[0] && { category: 'Communication', label: helpLabel, id: help[0].id },
    ].filter(Boolean),
    steps: [
      `Sit together if ${name} eats with family. Keep the familiar food as the main offer.`,
      `Invite looking or touching the new food. Tasting is optional. ${feedLabel}.`,
      `Notice how long ${name} stays. Log what was touched, smelled, or tasted — no score.`,
    ],
  }
}

function capitalize(text) {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}
