// Marks a user's email as confirmed so they can sign in without the confirmation link.
// Usage: npm run confirm-user -- user@example.com   (uses DATABASE_URL from .env.local)
import pg from 'pg'
const email = process.argv[2]?.trim().toLowerCase()
if (!email) { console.error('Usage: npm run confirm-user -- user@example.com'); process.exit(1) }
const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await client.connect()
const { rows } = await client.query(
  'update auth.users set email_confirmed_at = coalesce(email_confirmed_at, now()) where lower(email) = $1 returning email, email_confirmed_at',
  [email])
console.log(rows.length ? `OK -> ${rows[0].email} confirmed at ${rows[0].email_confirmed_at.toISOString()}` : `No user found with email ${email}`)
await client.end()
process.exitCode = rows.length ? 0 : 1
