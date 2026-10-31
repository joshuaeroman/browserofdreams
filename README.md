# Browser of Dreams 🌀

**A retro web simulator & temporal AI dream engine.** Pick any URL and any date in
history — or the future — and an LLM authors an authentic, era-appropriate webpage
on the fly, while an image model paints period banner ads and news photography.

![Browser of Dreams demo](docs/screenshot.png)

The image above is real output: `nycnews.com` on **September 11, 2001**, generated in
"Grounded" mode — the New York mayoral primary morning, teal-metric weather boxes and all.

## Play

**Live demo:** host this repo on GitHub Pages (`main` branch, `/` root) and open the URL.
**Or locally:** the repo ships a prebuilt `dist/`, so a plain static server is enough:

```bash
git clone <your-fork-url>
cd browserOfDreams
npm install
npm run build        # only needed after editing src/
npm run serve        # http://localhost:8765
```

You'll need to BYOK (bring your own keys) — see [Providers](#providers) below. Keys are
configured in-app via ⚙ **Settings**.

## What it does

- **Time-travel the web.** Enter any real or hypothetical URL plus any date
  from 1969 to 2150. The era engine picks a theme (BBS, Mosaic, Netscape, Web 2.0,
  modern, future) and the text model authors the page with period-accurate HTML/CSS/JS.
- **Era-adaptive image generation.** Banner ads and editorial photos via a dedicated
  image model, or text-model pixel art / SVG (Pixel ≤1999, SVG ≥2000 in auto mode).
- **Cultural zeitgeist.** The model also suggests 10 memes/keywords for the chosen date,
  which subtly flavor content.
- **Timeline Reality Dial.** 0% = strict historical accuracy ("Grounded"); 100% = the
  model may invent an Alternate History branch.
- **Streaming, retro-styled.** Pages stream in live behind an authentic dial-up
  transfer dialog; a Recent History cache lets you re-open past dreams instantly.
- **Installable PWA.** Works offline as a standalone "browser" app thanks to a
  service worker that caches only the app shell (API traffic is never cached).

## Providers

Configure one or more under ⚙ **Settings** → *Providers*, then pick the text/image
pair in the bottom bar before dreaming.

| Provider | Works from GitHub Pages? | Notes |
| --- | --- | --- |
| **OpenRouter** | ✅ Out of the box | Largest model catalog; [request a key](https://openrouter.ai/keys) |
| **Command Code** | ✅ Out of the box | Text-only (the Provider API has no image endpoint). Claude models default to `/provider/v1/messages` and everything else to `/provider/v1/chat/completions` (a model's fetched `supported_endpoints` overrides the default); [get a key](https://commandcode.ai/studio/). CORS preflight allows only `Content-Type` and `Authorization`, which is exactly what the adapter sends |
| **Google AI Studio (GEMINI API)** | ✅ Out of the box | Express API keys |
| **Google Cloud Vertex AI (Agent Platform)** | ✅ API key (Express) / gcloud access token | Access tokens are short-lived — re-paste after expiry |
| **OpenCode (Zen / Go)** | ❌ **Disabled in code** | opencode.ai omits `Access-Control-Allow-Origin` on inference POST routes, so direct browser calls are blocked by CORS. The adapter lives on in `src/providers/opencode/`; re-enable via the `disabled` flags in `src/core/settings.js` and the registry entries in `src/providers/registry.js` |

## Storage & privacy — please read

- **API keys are stored in your browser's `localStorage`** in plaintext. They are sent
  **directly to the provider you configure** and nowhere else — this app has no server
  of its own. Avoid using this demo on a shared computer; 🔑 rotate keys you've used here.
- Dreamed pages, images, and meme lists are also cached in `localStorage`
  (🧹 *Settings → Clear Cached Pages & Images* wipes everything).
- Generated pages render inside a **sandboxed, same-origin iframe**. Treat everything a
  dream serves you as fiction never to be trusted with real credentials — it is simulated
  retro fiction, after all.

## Architecture

```
index.html            App shell (retro chrome, modals, iframe viewport)
manifest.webmanifest  PWA manifest
sw.js                 Service worker (app-shell precache only)
build.mjs             esbuild bundling → dist/
src/
  main.js             Boot & wiring 🧩
  core/               Settings, state, era engine, cache, URLs, navigation
  providers/          OpenRouter · Command Code · Gemini (AI Studio/Vertex) · OpenCode adapters
  prompts/            Dream page / memes / text-art prompt builders
  features/           Image generation, memes, text art, PWA
  bridge/             Injected into each dream: link triage + resolution runtime
  ui/                 DOM refs, toolbar, modals, status bar, home screen
  data/               Featured portals, bookmarks, fallback memes
  styles/             Era theming & retro chrome CSS
tests/                node --test suites (76 tests)
```

```bash
npm test              # build + run full test suite
npm run watch         # rebuild dist/ on change
npm run icons         # regenerate PWA icon set (requires Python)
```

## Release checklist (for maintainers)

1. Edit `src/`, then `npm test` (regenerates `dist/`).
2. ✈️ **Bump the app-shell version** (`CACHE_NAME` in `sw.js`, plus the matching `dist/app.js?v=` and `dist/app.css?v=` in `index.html` and `PRECACHE_ASSETS`) so installed clients pick up the new build.
3. Verify the "Build" stamp in ⚙ Settings matches the release time.
4. Commit `dist/` — GitHub Pages serves the app straight from the repo root.

Had enough of dreams? `npm run app` launches a local build in a dedicated window.

## Disclaimer

All pages, ads, and memes are **AI-generated historical fiction**. "Grounded" mode aims
for authentic facts of the target date but can still get details wrong — the past is a
foreign country, and this app prints postcards from memory.

## License

[MIT](LICENSE) © The Browser of Dreams Authors. Generated content belongs to whoever
dreamed it — mind your provider's terms.
