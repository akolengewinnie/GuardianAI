import { generateChecklists } from '../src/lib/checklistsByAge.js'
import { generatePlan } from '../src/lib/generatePlan.js'

async function readJson(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString('utf8')
  if (!raw) return {}
  return JSON.parse(raw)
}

function send(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

async function handle(req, res, url) {
  if (req.method !== 'POST') {
    send(res, 405, { error: 'POST only' })
    return true
  }

  try {
    const body = await readJson(req)
    await new Promise((resolve) => setTimeout(resolve, 700))

    if (url.pathname === '/api/generate-checklists') {
      const result = generateChecklists(body.age)
      if (result.error) {
        send(res, 400, result)
        return true
      }
      send(res, 200, result)
      return true
    }

    if (url.pathname === '/api/generate-plan') {
      if (!body.learner) {
        send(res, 400, { error: 'learner is required' })
        return true
      }
      const plan = generatePlan({
        learner: body.learner,
        battery: body.battery || 'Yellow',
        time: body.time || 15,
        focus: body.focus || 'Communication',
      })
      send(res, 200, plan)
      return true
    }
  } catch (error) {
    send(res, 500, { error: error.message || 'Mock AI failed' })
    return true
  }

  return false
}

function attach(middlewares) {
  middlewares.use(async (req, res, next) => {
    const url = new URL(req.url, 'http://localhost')
    if (!url.pathname.startsWith('/api/')) {
      next()
      return
    }
    const handled = await handle(req, res, url)
    if (!handled) next()
  })
}

export function mockApiPlugin() {
  return {
    name: 'guardian-mock-api',
    configureServer(server) {
      attach(server.middlewares)
    },
    configurePreviewServer(server) {
      attach(server.middlewares)
    },
  }
}
