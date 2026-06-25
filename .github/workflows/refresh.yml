# ─── DAILY BRIEFING REFRESH WORKFLOW ─────────────────────────────────────
# Trigger manually from GitHub Actions tab (one button press).
# Runs: node scripts/refresh.js [tab]
# Requires: ANTHROPIC_API_KEY set in repo Settings → Secrets → Actions

name: Refresh Briefing Data

on:
  workflow_dispatch:
    inputs:
      tab:
        description: 'Which tab to refresh'
        required: true
        default: 'all'
        type: choice
        options:
          - all
          - ai
          - finance
          - rates
          - world
          - india
          - sports

jobs:
  refresh:
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Run refresh script
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: node scripts/refresh.js ${{ github.event.inputs.tab }}

      - name: Commit and push updated data files
        run: |
          git config user.name  "Briefing Bot"
          git config user.email "briefing-bot@users.noreply.github.com"
          git add data/*.json
          git diff --staged --quiet || git commit -m "chore: refresh ${{ github.event.inputs.tab }} — $(date -u +'%Y-%m-%d %H:%M UTC')"
          git push
