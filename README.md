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
- La app ya maneja la verificación: al registrarse muestra el aviso con botón *Reenviar correo*, y si alguien intenta entrar sin confirmar le ofrece reenviarlo. Añade la URL de la app en **Authentication → URL Configuration → Redirect URLs** para que el enlace del correo vuelva a ella.
- **Confirmar a mano a un usuario** (p. ej. si el correo no llega): `npm run confirm-user -- correo@ejemplo.com`, o en el SQL Editor:

```sql
update auth.users set email_confirmed_at = now() where email = 'CORREO' and email_confirmed_at is null;
```
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

## Idioma de la app (español → inglés)

La interfaz arranca en español y se va pasando a inglés a medida que ella aprende. Cada texto de `src/lib/strings.js` es `[español, English, nivel]`; un nivel se abre cuando ha *aprendido* cierto número de lecciones (`TIER` en `src/lib/i18n-core.js`: 3, 6, 10, 20, 32, 45). Las palabras sueltas cambian primero; las explicaciones largas, al final. Una lección cuenta como aprendida si la terminó o si selló su módulo con el examen. En **Yo → Idioma** se puede forzar todo en español o todo en inglés.

Los textos de apoyo de cada lección (`intro`, `goal`, `subtitle`) tienen versión en español en `src/content/es.js` y pasan a inglés cuando ya va 12 lecciones más adelante.

## Contenido complementario bloqueado

Pinturas, poemas, recomendaciones de inglés libre, consignas de escritura, consejos y el Estudio solo se abren cuando ella ya vio la gramática que necesitan: cada elemento de `src/content/library.js` tiene `needs: 'm3l3'` (la lección que lo habilita). Mientras tanto aparece bloqueado, diciendo qué lección lo abre. El tutor IA recibe la lista de temas ya estudiados (`known`) para no pasarse de su nivel.

## Sesiones interrumpidas

Si sale de una lección, repaso o examen a medias, el avance se guarda en `localStorage` (`src/lib/drafts.js`) después de cada respuesta: pregunta actual, racha, puntos y las preguntas que van a repetirse. Al volver, la lección/examen/repaso ofrece *Continuar donde lo dejé* y *Hoy* muestra la sesión pendiente. El tiempo de estudio también se guarda al cerrar o esconder la pestaña (`keepalive`).

## Explicaciones resaltadas

En el contenido, `**así**` marca el término clave: negrita en color vino con trazo de marcador dorado. El texto de ayuda en español va en un panel aparte con etiqueta, la regla en inglés es la línea principal y las trampas ("Ojo") tienen su propio recuadro. En las respuestas, lo que sigue a una flecha (`→ is`) se resalta solo.
