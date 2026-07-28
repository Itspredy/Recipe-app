# Running the app

The UI is a full Expo Router app built from the Organic design. Recipes are
stored **on-device** with AsyncStorage (no native build needed), and recipe
import calls a small Express + Groq backend so the API key never ships in the
app. Six sample recipes seed on first launch.

## Option A — Preview in a browser (fastest)

```bash
cd Recipe
npx expo start --web --port 8081
```

Open <http://localhost:8081>. This is what was used to verify every screen.

## Option B — On your iPhone with Expo Go

The share-sheet import is deferred (it needs a native dev build), so the app now
runs in **Expo Go** — no Xcode, no EAS build required.

1. Install **Expo Go** from the App Store.
2. On your PC:
   ```bash
   cd Recipe
   npx expo start
   ```
3. Scan the QR code with the iPhone Camera (or from inside Expo Go). Phone and PC
   must be on the same Wi-Fi.

Recipe import already points at the deployed backend
(`EXPO_PUBLIC_API_URL` in `Recipe/.env`), so **paste-a-link import works on the
phone out of the box**.

## Option C — Run the import backend locally

Only needed if you want the backend on your own machine instead of the deployed
one.

```bash
cd backend
cp .env.example .env      # paste your GROQ_API_KEY (https://console.groq.com/keys)
npm install && npm run dev   # listens on http://localhost:8787
```

Then point the app at your PC's LAN IP (find it with `ipconfig`):

```
# Recipe/.env
EXPO_PUBLIC_API_URL=http://192.168.1.10:8787
```

`localhost` won't work from a physical phone — it resolves to the phone itself.

## What works

- **Library** — greeting, search, category chips, "cook it again" featured card, 2-col grid, empty state
- **Add** — bottom sheet → paste-a-link import (live, via Groq) or type-it-in manual entry
- **Detail** — hero, stat pills, Ingredients / Instructions / Notes tabs, live servings scaler, tap-to-check ingredients, favourite toggle, editable notes
- **Cook mode** — progress bar, big step text, per-step ingredient chips, countdown timer parsed from the step, prev/next
- **Done** — star rating → saves to Cooked history
- **Search / Cooked / Profile** — filters, stats, and a persisted light/dark toggle

## Notes / next steps

- Real photos come from imports; seed recipes use themed gradient tiles.
- `src/db/recipes.ts` and `src/db/schema.ts` are the old SQLite layer, now unused
  (type-only imports, not bundled). Delete when convenient.
- To re-enable the share sheet, restore `+native-intent.ts` / `shareintent.tsx`
  from git history and cut an EAS dev build.
