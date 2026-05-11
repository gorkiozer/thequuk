# TheQuuk

> Şehrin duygusal hafıza katmanı — a living emotional memory layer on top of the real city.

A premium, mobile-first web prototype where users leave memories attached to real places on a stylized Istanbul map.

## Tech stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** for styling
- **Mapbox GL JS** + **react-map-gl** for the map
- **Framer Motion** for transitions
- Mock data only — no backend yet

## Run locally

Prerequisites: **Node 18.17+** and **npm**.

```bash
# 1. Install dependencies
npm install

# 2. Add your Mapbox token
# Copy .env.local.example to .env.local and paste your token:
#   NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ...
# Free token (no credit card): https://account.mapbox.com/access-tokens/

# 3. Start dev server
npm run dev
# Open http://localhost:4040
```

### Open it on your phone (same Wi-Fi)

Find your computer's local IP (e.g. `192.168.1.10`) and open `http://192.168.1.10:4040` on mobile Safari / Chrome.

If your Mapbox token has URL restrictions, add the local IP to the allowed list, or use `localhost` via USB tethering / Tailscale / ngrok.

## Production build

```bash
npm run build
npm start
```

`npm run build` must complete without errors — Vercel runs the same command on every deploy.

## Push to GitHub

If this is your first time:

```bash
git init
git add .
git commit -m "TheQuuk prototype"
git branch -M main

# Create an empty repo on GitHub (no README/license), copy its URL, then:
git remote add origin https://github.com/YOUR_USERNAME/thequuk.git
git push -u origin main
```

If the repo already exists locally with commits, skip `git init` and just `git push`.

`.env.local` is gitignored — your token will not be committed.

## Deploy to Vercel

1. **Import the repo**
   - Go to <https://vercel.com/new>
   - Pick your `thequuk` GitHub repo and click **Import**
   - Vercel auto-detects "Next.js" — leave all defaults

2. **Add environment variable**
   - In project settings → **Environment Variables**, add:

     | Key | Value |
     |---|---|
     | `NEXT_PUBLIC_MAPBOX_TOKEN` | `pk.eyJ...` (your Mapbox public token) |

   - Apply to: Production, Preview, Development

3. **Deploy**
   - Click **Deploy** — first build runs in ~1-2 minutes
   - Live at `your-project.vercel.app`

After deploy, if you push new commits to `main` Vercel rebuilds automatically. Preview deploys are created for every PR / branch push.

### Mapbox URL allowlist (recommended for production)

In <https://account.mapbox.com/access-tokens/>, edit your token and add your Vercel domain (`*.vercel.app` or your custom domain) under "URL restrictions" so the token can't be used elsewhere.

## Project structure

```
app/
  layout.tsx                  root layout (fonts, viewport, safe-area)
  page.tsx                    onboarding (intro → mood → name → enter)
  globals.css                 Tailwind + custom keyframes
  (app)/
    layout.tsx                in-app shell (SideNav + BottomNav + page transition)
    map/page.tsx              full-bleed Mapbox map (the hero)
    explore/page.tsx          editorial Discover sections
    drop/page.tsx             drop-memory ritual (long-press)
    notifications/page.tsx    For You + Nearby tabs
    profile/page.tsx          social profile (Memories / Liked / Saved)
    quests/page.tsx           city whispers (unlisted)
  components/
    MapboxMap.tsx             map orchestrator
    BottomNav.tsx             mobile bottom tab bar
    SideNav.tsx               desktop sidebar
    map/                      map sub-components (mood layer, capsules, presence, signals, demo controls)
    profile/                  ProfilePhoto, PhotoUpload, edit modal, etc.
    DropMemoryModal.tsx       long-press ritual
lib/
  istanbulData.ts             32 districts + ~70 memories
  moodPalette.ts              15 mood colors
  profileData.ts              fake profile (gorkem) + clothing system data
  profilePhoto.ts             localStorage avatar + image compression
  useUserPresence.ts          simulated walking presence
  timeOfDay.ts                lightPreset by hour
  notifications + cityWhispers + nearbyNotifications + socialNotifications
public/
  logo.png                    app icon (add your own if missing)
```

## Mobile considerations

- `viewport-fit=cover` enabled — content respects safe areas
- BottomNav uses `env(safe-area-inset-bottom)` so iPhone home indicator doesn't overlap
- Fixed max width (440-480px) on bottom nav keeps it phone-shaped on desktop too
- The map auto-evolves with the real hour (dawn/day/dusk/night)
- Geolocation runs in the background — if denied or far from Istanbul, the demo simulates a walking path through Kadıköy

## Where the fake data lives

- **Memories** + districts: `lib/istanbulData.ts` (32 districts, ~70 memories with mood, type, district, coordinates, likes, timeAgo)
- **Personal notifications**: `lib/socialNotifications.ts`
- **Nearby notifications**: `lib/nearbyNotifications.ts`
- **City whispers**: `lib/cityWhispers.ts`
- **Fake users**: `lib/fakeUsers.ts`
- **Profile (gorkem)**: `lib/profileData.ts`

All deterministic across SSR + client.
