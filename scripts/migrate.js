// Runs supabase/schema.sql against DATABASE_URL (idempotent). Usage: npm run db
import pg from 'pg'
import { readFileSync } from 'node:fs'
const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await client.connect()
await client.query(readFileSync(new URL('../supabase/schema.sql', import.meta.url), 'utf8'))
const { rows } = await client.query("select table_name from information_schema.tables where table_schema='public' order by 1")
console.log('OK ->', rows.map(r => r.table_name).join(', '))
await client.end()
