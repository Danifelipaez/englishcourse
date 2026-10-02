import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Dev only: serve /api/tutor locally the way Vercel does (put GEMINI_API_KEY in .env.local to try it)
const devApi = () => ({
  name: 'dev-api',
  configureServer(server) {
    Object.assign(process.env, loadEnv('development', process.cwd(), ''))
    server.middlewares.use('/api/tutor', async (req, res) => {
      let raw = ''
      for await (const c of req) raw += c
      req.body = raw ? JSON.parse(raw) : {}
      res.status = c => ((res.statusCode = c), res)
      res.json = o => { res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(o)) }
      const { default: handler } = await server.ssrLoadModule('/api/tutor.js')
      handler(req, res)
    })
  },
})

export default defineConfig({ plugins: [react(), devApi()] })
