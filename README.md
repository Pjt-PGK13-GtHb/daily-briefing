# Daily Briefing

Prince's personal daily news briefing — AI & Tech, Finance (India), World News, India & Chennai, Sports.

## Structure
```
briefing/
├── index.html              ← Shell (never edit manually)
├── data/
│   ├── ai.json             ← AI + Tech stories
│   ├── finance.json        ← Markets, gold/silver, stocks/ETFs/MFs
│   ├── world.json          ← Top 5 world stories
│   ├── india.json          ← Top 5 India + 5 Chennai stories
│   └── sports.json         ← Cricket/Football/Tennis/F1
├── scripts/
│   ├── refresh.js          ← Node.js Claude API caller
│   └── prompts.js          ← All tab prompts (single source of truth)
└── .github/workflows/
    └── refresh.yml         ← Manual GitHub Actions trigger
```

## Setup (one time)

1. Push this folder to a GitHub repo
2. Go to Settings → Secrets → Actions → New secret
3. Name: `ANTHROPIC_API_KEY`, Value: your Claude API key
4. Go to Settings → Pages → Deploy from branch (main, / root)
5. Your URL: `https://yourusername.github.io/daily-briefing`

## Daily refresh (one button)

1. Go to your GitHub repo → Actions tab
2. Select "Refresh Briefing Data"
3. Click "Run workflow"
4. Choose which tab to refresh (or "all")
5. Done — GitHub Pages redeploys automatically in ~60 seconds

## Manual refresh (copy/paste method)

1. Open the briefing page → tap "Refresh" button
2. Choose what to refresh → copy the prompt
3. Paste into Claude at claude.ai
4. Save the returned JSON to the correct data/ file
5. Re-upload to Netlify Drop or push to GitHub

## Cost (GitHub Actions + Claude API)
- Rates only: ~$0.03 per run
- Single tab: ~$0.08–0.12 per run  
- All tabs:   ~$0.20–0.30 per run
- Daily full refresh = ~₹20–25/day = ~₹600–750/month max
