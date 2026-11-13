# llm-proxy-log explainer video: script

Video: [../proxy-log-explainer.mp4](../proxy-log-explainer.mp4) · 55 s · 1920×1080 · 30 fps · no audio ·
Remotion, all scenes in [`src/Composition.tsx`](src/Composition.tsx). Every message, field value and number
comes from the recorded demo (`demo/data/demo.db`, recorded 2026-11-13 on the free model) and is copied
into [`src/real.ts`](src/real.ts); `public/dashboard.png` is a real screenshot of `dashboard/server.py --demo`
(dark theme) with omar's T-322 session open.

Re-render:
```bash
cd explainers/video && npm ci
npx remotion render ProxyLogExplainer out/raw.mp4 --browser-executable=/opt/pw-browsers/chromium
ffmpeg -i out/raw.mp4 -c:v libx264 -crf 31 -tune animation -pix_fmt yuv420p -movflags +faststart ../proxy-log-explainer.mp4
```

| # | Time | Scene | On screen |
|---|---|---|---|
| 1 | 0:00–0:04 | Title | Ledger mark, name, "An LLM proxy that logs every call, per user". |
| 2 | 0:04–0:11 | The problem | Four agents, one key; the provider shows totals, not people. Three questions nobody can answer. |
| 3 | 0:11–0:18 | One change | The OpenAI client with the proxy's base URL, a dummy key and X-Agent-User / X-Agent-Dept. |
| 4 | 0:18–0:30 | One real call | Omar's T-322 question; six steps through the proxy; the `calls` row 4 filling in. |
| 5 | 0:30–0:40 | The gateway | Rate limit, backoff, fallback, spend cap (since start), cache; the demo: 130/130 free, $0. |
| 6 | 0:40–0:49 | Read it back | Dashboard screenshot zooming into the transcript; calls, sessions, users, tokens, latency. |
| 7 | 0:49–0:55 | Outro | "Every call, written down", the no-key command, the blueprint, the repo URL. |
