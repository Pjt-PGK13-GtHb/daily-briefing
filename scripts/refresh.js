#!/usr/bin/env node
// ─── DAILY BRIEFING REFRESH SCRIPT ────────────────────────────────────────
// Called by GitHub Actions (manual trigger or cron).
// Reads PROMPTS, calls Claude API, writes JSON files to data/.
// Usage: node scripts/refresh.js [ai|finance|world|india|sports|rates|all]
// Requires env: ANTHROPIC_API_KEY

const https = require('https');
const fs    = require('fs');
const path  = require('path');
const PROMPTS = require('./prompts.js');

const API_KEY = process.env.ANTHROPIC_API_KEY;
const DATA_DIR = path.join(__dirname, '..', 'data');
const MODEL    = 'claude-sonnet-4-6';
const MAX_TOK  = 8000;

if (!API_KEY) { console.error('❌  ANTHROPIC_API_KEY not set'); process.exit(1); }

// ── Tabs to refresh (from CLI arg, default = all except rates) ─────────────
const ARG  = (process.argv[2] || 'all').toLowerCase();
const TODO = ARG === 'all'
  ? ['ai', 'finance', 'world', 'india', 'sports']
  : ARG === 'rates'
  ? ['rates']
  : [ARG];

// ── Claude API call ────────────────────────────────────────────────────────
function callClaude(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOK,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{ role: 'user', content: prompt }]
    });

    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type':       'application/json',
        'x-api-key':          API_KEY,
        'anthropic-version':  '2023-06-01',
        'Content-Length':     Buffer.byteLength(body)
      }
    }, res => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.error) { reject(new Error(parsed.error.message)); return; }
          // Extract text from content array (may include tool_use blocks)
          const text = (parsed.content || [])
            .filter(b => b.type === 'text')
            .map(b => b.text)
            .join('');
          resolve(text);
        } catch(e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Extract JSON from Claude response ─────────────────────────────────────
function extractJSON(text) {
  // Strip markdown code fences if present
  const clean = text.replace(/^```json?\s*/i, '').replace(/\s*```\s*$/,'').trim();
  // Find outermost { ... }
  const start = clean.indexOf('{');
  const end   = clean.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON object found in response');
  return JSON.parse(clean.slice(start, end + 1));
}

// ── Merge rates-only response into existing finance.json ──────────────────
function mergeRates(ratesObj) {
  const fp = path.join(DATA_DIR, 'finance.json');
  const existing = JSON.parse(fs.readFileSync(fp, 'utf8'));
  existing.meta.rates = ratesObj;
  // Update quick rates from rate strip values
  existing.meta.quickRates.gold22k = ratesObj.gold22k.value;
  existing.meta.quickRates.silver  = ratesObj.silver.value;
  fs.writeFileSync(fp, JSON.stringify(existing, null, 2));
  console.log('  ✅  Merged rates into finance.json');
}

// ── Write full tab JSON ────────────────────────────────────────────────────
function writeTab(tab, data) {
  const fp = path.join(DATA_DIR, `${tab}.json`);
  fs.writeFileSync(fp, JSON.stringify(data, null, 2));
  console.log(`  ✅  Wrote ${tab}.json`);
}

// ── Validate response has minimum required keys ────────────────────────────
function validate(tab, data) {
  if (!data.meta) throw new Error('Missing meta key');
  if (tab === 'ai'      && (!data.ai      || !data.tech))    throw new Error('Missing ai/tech arrays');
  if (tab === 'finance' && !data.stories)                    throw new Error('Missing stories array');
  if (tab === 'world'   && !data.stories)                    throw new Error('Missing stories array');
  if (tab === 'india'   && (!data.india   || !data.chennai)) throw new Error('Missing india/chennai arrays');
  if (tab === 'sports'  && (!data.cricket || !data.football)) throw new Error('Missing sport arrays');
  return true;
}

// ── Main ───────────────────────────────────────────────────────────────────
(async () => {
  console.log(`\n🚀  Daily Briefing Refresh — tabs: [${TODO.join(', ')}]\n`);

  for (const tab of TODO) {
    console.log(`▶  Refreshing: ${tab}`);
    try {
      const prompt = PROMPTS[tab];
      if (!prompt) { console.warn(`  ⚠️  No prompt found for tab "${tab}" — skipping`); continue; }

      const raw  = await callClaude(prompt);
      if (!raw || raw.trim().length < 20) throw new Error('Empty or too-short response');

      if (tab === 'rates') {
        // rates returns a flat object, not the full finance structure
        const ratesObj = extractJSON(raw);
        mergeRates(ratesObj);
      } else {
        const data = extractJSON(raw);
        validate(tab, data);
        writeTab(tab, data);
      }

      // Polite delay between API calls
      if (TODO.indexOf(tab) < TODO.length - 1) {
        await new Promise(r => setTimeout(r, 2000));
      }
    } catch (err) {
      console.error(`  ❌  Failed to refresh ${tab}:`, err.message);
      // Don't exit — continue with remaining tabs
      process.exitCode = 1;
    }
  }

  console.log('\n✅  Refresh complete\n');
})();
