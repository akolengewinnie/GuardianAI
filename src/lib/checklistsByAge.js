export function ageGroupFor(age) {
  const n = Number(age)
  if (n >= 2 && n <= 4) return '2-4'
  if (n >= 5 && n <= 7) return '5-7'
  if (n >= 8 && n <= 12) return '8-12'
  return null
}

function item(id, label, checked = true) {
  return { id, label, checked }
}

function group(id, label, items) {
  return { id, label, items }
}

const SENSORY = {
  '2-4': [
    group('visual', 'Visual', [
      item('vis-dim', 'Prefers dim lights'),
      item('vis-pictures', 'Looks at picture books'),
      item('vis-flash', 'Avoids flashing lights'),
    ]),
    group('auditory', 'Auditory', [
      item('aud-loud', 'Sensitive to loud sounds'),
      item('aud-songs', 'Enjoys nursery rhymes'),
      item('aud-ears', 'Covers ears'),
    ]),
    group('tactile', 'Tactile', [
      item('tac-water', 'Likes water play'),
      item('tac-sticky', 'Avoids sticky textures'),
      item('tac-hugs', 'Seeks hugs / deep pressure'),
    ]),
    group('movement', 'Movement', [
      item('mov-swing', 'Enjoys being swung'),
      item('mov-bounce', 'Seeks bouncing'),
      item('mov-dizzy', 'Gets dizzy easily'),
    ]),
    group('taste', 'Taste/Smell', [
      item('tas-familiar', 'Prefers familiar foods'),
      item('tas-smells', 'Sensitive to smells'),
    ]),
  ],
  '5-7': [
    group('visual', 'Visual', [
      item('vis-dim', 'Prefers dim lights'),
      item('vis-bright', 'Likes bright colors'),
      item('vis-flash', 'Avoids flashing'),
    ]),
    group('auditory', 'Auditory', [
      item('aud-loud', 'Sensitive to loud sounds'),
      item('aud-music', 'Enjoys music'),
      item('aud-ears', 'Covers ears'),
    ]),
    group('tactile', 'Tactile', [
      item('tac-draw', 'Likes drawing/painting'),
      item('tac-sticky', 'Avoids sticky textures'),
      item('tac-pressure', 'Seeks deep pressure'),
    ]),
    group('movement', 'Movement', [
      item('mov-scooter', 'Enjoys scooter/swinging'),
      item('mov-jump', 'Seeks jumping'),
      item('mov-dizzy', 'Gets dizzy easily'),
    ]),
    group('taste', 'Taste/Smell', [
      item('tas-familiar', 'Prefers familiar foods'),
      item('tas-smells', 'Sensitive to smells'),
    ]),
  ],
  '8-12': [
    group('visual', 'Visual', [
      item('vis-dim', 'Prefers dim lights'),
      item('vis-color', 'Likes organizing by color'),
      item('vis-flash', 'Avoids flashing screens'),
    ]),
    group('auditory', 'Auditory', [
      item('aud-loud', 'Sensitive to loud sounds'),
      item('aud-headphones', 'Enjoys music with headphones'),
      item('aud-crowds', 'Covers ears in crowds'),
    ]),
    group('tactile', 'Tactile', [
      item('tac-crafts', 'Likes drawing/crafts'),
      item('tac-sticky', 'Avoids sticky textures'),
      item('tac-pressure', 'Seeks deep pressure'),
    ]),
    group('movement', 'Movement', [
      item('mov-bike', 'Enjoys scooter/bike'),
      item('mov-breaks', 'Seeks movement breaks'),
      item('mov-dizzy', 'Gets dizzy easily'),
    ]),
    group('taste', 'Taste/Smell', [
      item('tas-familiar', 'Prefers familiar foods'),
      item('tas-smells', 'Sensitive to smells'),
    ]),
  ],
}

const COMMUNICATION = {
  '2-4': [
    item('com-sounds', 'Uses sounds or gestures'),
    item('com-words', 'Uses single words'),
    item('com-points', 'Points to show needs'),
    item('com-aac', 'Uses pictures / AAC'),
    item('com-looks', 'Looks toward familiar people'),
    item('com-help', 'Requests help with a gesture'),
    item('com-onestep', 'Follows one-step directions'),
    item('com-names', 'Names familiar objects with support'),
  ],
  '5-7': [
    item('com-words', 'Uses single words'),
    item('com-sentences', 'Uses short sentences'),
    item('com-points', 'Points to show needs'),
    item('com-aac', 'Uses pictures / AAC'),
    item('com-greets', 'Greets familiar people'),
    item('com-help', 'Requests help'),
    item('com-answers', 'Answers simple questions'),
    item('com-shares', 'Shares about day with support'),
  ],
  '8-12': [
    item('com-sentences', 'Uses full sentences'),
    item('com-starts', 'Starts conversations with support'),
    item('com-aac', 'Uses pictures / AAC when needed'),
    item('com-greets', 'Greets familiar people independently'),
    item('com-help', 'Requests help with words'),
    item('com-answers', 'Answers questions about the day'),
    item('com-opinions', 'Shares opinions with support'),
    item('com-multistep', 'Follows 2–3 step directions'),
  ],
}

const SOCIAL = {
  '2-4': [
    item('soc-near', 'Plays near others'),
    item('soc-turns', 'Takes turns with toys (with support)'),
    item('soc-looks', 'Looks at others during play'),
    item('soc-shares', 'Shares toys with prompting'),
    item('soc-familiar', 'Shows preference for familiar people'),
    item('soc-greets', 'Greets with a gesture'),
  ],
  '5-7': [
    item('soc-turns', 'Takes turns with support'),
    item('soc-alongside', 'Plays alongside others'),
    item('soc-group', 'Joins group play for short time'),
    item('soc-shares', 'Shares toys with prompting'),
    item('soc-prefs', 'Recognizes own vs others’ preferences'),
    item('soc-greets', 'Greets with words/gestures'),
  ],
  '8-12': [
    item('soc-turns', 'Takes turns independently'),
    item('soc-group', 'Joins group play'),
    item('soc-shares', 'Shares materials with prompting'),
    item('soc-prefs', 'Recognizes others’ preferences'),
    item('soc-greets', 'Greets with words'),
    item('soc-conflict', 'Solves simple peer conflicts with support'),
  ],
}

const FEEDING = {
  '2-4': [
    item('fed-family', 'Eats with family'),
    item('fed-textures', 'Tries new textures with support'),
    item('fed-smooth', 'Prefers smooth / pureed foods'),
    item('fed-touch', 'Touches but not tastes new foods'),
    item('fed-spoon', 'Uses fingers or spoon with support'),
    item('fed-cup', 'Drinks from open cup with support'),
    item('fed-table', 'Stays at table a few minutes'),
  ],
  '5-7': [
    item('fed-family', 'Eats with family'),
    item('fed-textures', 'Tries new textures with support'),
    item('fed-soft', 'Prefers soft foods'),
    item('fed-touch', 'Touches but not tastes new foods'),
    item('fed-spoon', 'Uses spoon with support'),
    item('fed-cup', 'Drinks from open cup'),
    item('fed-table', 'Stays at table 10+ mins'),
  ],
  '8-12': [
    item('fed-family', 'Eats with family'),
    item('fed-new', 'Tries new foods with support'),
    item('fed-utensils', 'Uses utensils independently'),
    item('fed-cup', 'Drinks from open cup'),
    item('fed-table', 'Stays at table 15+ mins'),
    item('fed-prep', 'Helps with simple meal prep'),
    item('fed-touch-taste', 'Touches then tastes new foods'),
  ],
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

export function generateChecklists(age) {
  const n = Number(age)
  const ageGroup = ageGroupFor(n)
  if (!ageGroup) {
    return { error: 'Age must be between 2 and 12.' }
  }

  return {
    age,
    ageGroup,
    generatedAt: new Date().toISOString(),
    source: 'mock-ai-v1',
    sensory: {
      title: 'Sensory Preferences Checklist',
      subtitle: 'Age-based',
      groups: clone(SENSORY[ageGroup]),
    },
    communication: {
      title: 'Communication Checklist',
      subtitle: `Age-based for ${n}y`,
      items: clone(COMMUNICATION[ageGroup]),
    },
    social: {
      title: 'Social Checklist',
      subtitle: `Age-based for ${n}y`,
      items: clone(SOCIAL[ageGroup]),
    },
    feeding: {
      title: 'Feeding Observations Checklist',
      subtitle: 'Age-based',
      items: clone(FEEDING[ageGroup]),
      notes: '',
    },
  }
}

export function flattenChecked(checklists) {
  if (!checklists) return []
  const out = []

  for (const group of checklists.sensory?.groups || []) {
    for (const item of group.items || []) {
      if (item.checked) {
        out.push({ category: 'Sensory', group: group.label, id: item.id, label: item.label })
      }
    }
  }
  for (const [key, category] of [
    ['communication', 'Communication'],
    ['social', 'Social'],
    ['feeding', 'Feeding'],
  ]) {
    for (const item of checklists[key]?.items || []) {
      if (item.checked) {
        out.push({ category, id: item.id, label: item.label })
      }
    }
  }
  return out
}
