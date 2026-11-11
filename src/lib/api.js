import { generateChecklists as mockChecklists } from './checklistsByAge.js'
import { generatePlan as mockPlan } from './generatePlan.js'

async function post(path, body) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Request failed')
  return data
}

function wait(ms = 700) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function generateChecklists(age) {
  try {
    return await post('/api/generate-checklists', { age })
  } catch {
    await wait()
    const data = mockChecklists(age)
    if (data.error) throw new Error(data.error)
    return data
  }
}

export async function generatePlan(payload) {
  try {
    return await post('/api/generate-plan', payload)
  } catch {
    await wait()
    return mockPlan(payload)
  }
}
