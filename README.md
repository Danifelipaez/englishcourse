# Inglés para mi amor

Rutina diaria de inglés A1 → B1 (12 módulos, 60 lecciones, 780 ejercicios, historia serializada *Letters from New York*), con racha, combos, caja de memoria, exámenes, tutor IA (Gemini) y panel admin.

Stack: Vite + React · Supabase (auth + Postgres con RLS) · una función serverless en Vercel (`api/tutor.js`).

## Desplegar en Vercel

1. Sube la carpeta a un repo de GitHub e impórtalo en Vercel (framework: Vite, se detecta solo).
2. En **Settings → Environment Variables** agrega:

| Variable | Valor |
|---|---|
| `VITE_SUPABASE_URL` | URL del proyecto (Supabase → Settings → API) |
| `VITE_SUPABASE_ANON_KEY` | anon public key (Supabase → Settings → API Keys) |
| `GEMINI_API_KEY` | tu key de Google AI Studio (solo servidor) |
| `GEMINI_MODEL` | opcional, por defecto `gemini-flash-latest` |

3. Deploy.

## Supabase

- El esquema ya está aplicado. Para re-aplicarlo (es idempotente): `npm run db` (usa `DATABASE_URL` de `.env.local`).
- **Authentication → URL Configuration**: pon la URL de Vercel en *Site URL* (para el correo de confirmación).
- Opcional: **Authentication → Sign In / Providers → Email** desactiva *Confirm email* si no quieren confirmar por correo.
- **Hacerte admin**: crea tu cuenta en la app y luego, en el SQL Editor:

```sql
update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'TU_EMAIL');
```

## Local

```bash
npm install
npm run dev
```

`npm test` corre el self-check de la lógica (racha, protectores, combos, caja de memoria).

## Reglas del juego

- Meta diaria: ≥ 20 min, con teoría ≥ lo que ella elige (10–20 min). La teoría se cuenta sola en lecciones, repaso, exámenes y estudio; el inglés libre con el cronómetro de *Free*.
- Racha: cada 7 días gana un protector (máx. 2) que salva un día perdido. El admin puede restaurar días o regalar protectores.
- Puntos: 10 por respuesta × multiplicador de combo (×1 → ×5 cada 3 seguidas) + 50 por día cumplido + 20 por lección + 150 por examen aprobado.
- Exámenes: 70 % para sellar el módulo y abrir el siguiente; se pueden presentar antes para saltar un módulo.
