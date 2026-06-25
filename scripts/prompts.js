// ─── DAILY BRIEFING PROMPTS ───────────────────────────────────────────────
// One source of truth for all tab refresh prompts.
// Used by refresh.js (GitHub Actions) and surfaced in the browser modal.

const BASE = `Output ONLY valid JSON with no markdown, no code fences, no preamble.
Each story object must have: id(int), rank(string "01".."07"), emoji, tags(array),
tLabels(array), title, why, summary, take,
links(array of {label,type,icon,url}), path(array of {n,title,desc,url}).`;

const PROMPTS = {

  ai: `Search live news for today's top 7 most important and viral AI stories
and separately the top 5 most important Technology stories (chips, cybersecurity,
media, regulation, big tech business moves — non-AI-specific).
Rank each list by impact and virality. Write full summaries with
"Why it matters" and "My take" for each.
${BASE}
Return a single JSON object matching this exact structure:
{
  "meta": {
    "date":"D Month YYYY","dateISO":"YYYY-MM-DD","editionLabel":"D Month YYYY",
    "trendLine":"...",
    "sodTitle":"...","sodBody":"...",
    "ticker":["item",...10 items],
    "archiveEntries":[{"date":"...","today":true,"hl":"..."},{"date":"...","today":false,"hl":"..."}],
    "aiCats":[{"label":"...","f":"regulation","n":3},...],
    "techCats":[{"label":"...","f":"bigtech","n":3},...]
  },
  "ai":[...7 story objects...],
  "tech":[...5 story objects...]
}`,

  finance: `Search live news for: today's Sensex and Nifty closing levels and % change,
top 5 gaining stocks on NSE with prices, key market-moving news,
today's gold 22K and 24K rates per gram in Chennai/Tamil Nadu,
today's silver rate per gram in Chennai, current petrol and diesel prices in Chennai.
Write full summaries with "Why it matters" and "My take" for each story.
${BASE}
Return a single JSON object matching this exact structure:
{
  "meta": {
    "date":"D Month YYYY","dateISO":"YYYY-MM-DD","editionLabel":"D Month YYYY",
    "trendLine":"...","sodTitle":"...","sodBody":"...",
    "rates":{
      "sensex":{"value":"XX,XXX.XX","change":"▼/▲ XXX (−/+X.XX%)","dir":"down/up","label":"Sensex"},
      "nifty":{"value":"XX,XXX.XX","change":"▼/▲ XXX (−/+X.XX%)","dir":"down/up","label":"Nifty 50"},
      "gold22k":{"value":"₹XX,XXX/g","change":"▲ vs yesterday","dir":"up","label":"Gold 22K (Chennai)"},
      "silver":{"value":"₹XXX/g","change":"▲ vs yesterday","dir":"up","label":"Silver (Chennai)"}
    },
    "quickRates":{"gold22k":"₹...","gold24k":"₹...","silver":"₹...","petrol":"₹...","diesel":"₹..."},
    "ticker":["item",...10 items],
    "archiveEntries":[{"date":"...","today":true,"hl":"..."},{"date":"...","today":false,"hl":"..."}],
    "cats":[{"label":"...","f":"market","n":6},...]
    "stocks":[{"rank":1,"name":"...","sector":"...","price":"₹...","change":"▲ x%","dir":"up"},...5],
    "etfs":[{"rank":1,"name":"...","meta":"...","val":"...","chg":"...","dir":"up"},...5],
    "mfs":[{"rank":1,"name":"...","meta":"...","val":"...","chg":"...","dir":"up"},...5]
  },
  "stories":[...8 story objects...]
}`,

  rates: `Search for ONLY these 4 values: today's Sensex closing value and % change,
Nifty 50 closing value and % change, gold 22K rate per gram in Chennai,
silver rate per gram in Chennai.
Return ONLY this JSON with no other text:
{
  "sensex":{"value":"XX,XXX.XX","change":"▼ XXX (−X.XX%)","dir":"down","label":"Sensex"},
  "nifty":{"value":"XX,XXX.XX","change":"▼ XXX (−X.XX%)","dir":"down","label":"Nifty 50"},
  "gold22k":{"value":"₹XX,XXX/g","change":"▲ vs yesterday","dir":"up","label":"Gold 22K (Chennai)"},
  "silver":{"value":"₹XXX/g","change":"● flat","dir":"up","label":"Silver (Chennai)"}
}`,

  world: `Search live news for today's top 5 most important and viral world news stories
(geopolitics, conflicts, diplomacy, major elections, significant global events).
Rank by global impact and virality. Write full summaries with "Why it matters" and "My take".
${BASE}
Return a single JSON object:
{
  "meta":{
    "date":"D Month YYYY","dateISO":"YYYY-MM-DD","editionLabel":"D Month YYYY",
    "trendLine":"...","sodTitle":"...","sodBody":"...",
    "ticker":["item",...10 items],
    "archiveEntries":[{"date":"...","today":true,"hl":"..."},{"date":"...","today":false,"hl":"..."}],
    "cats":[{"label":"...","f":"conflict","n":2},...]
  },
  "stories":[...5 story objects...]
}`,

  india: `Search live news for today's top 5 India national news stories AND top 5 Chennai/Tamil Nadu
local news stories. For India: politics, policy, economy, sports, major events.
For Chennai: civic news, local government, weather, culture, jobs.
Write full summaries with "Why it matters" and "My take" for each.
${BASE}
Return a single JSON object:
{
  "meta":{
    "date":"D Month YYYY","dateISO":"YYYY-MM-DD","editionLabel":"D Month YYYY",
    "trendLine":"...","sodTitle":"...","sodBody":"...","sodChennai":"...",
    "ticker":["item",...10 items],
    "archiveEntries":[{"date":"...","today":true,"hl":"..."},{"date":"...","today":false,"hl":"..."}],
    "indiaCats":[{"label":"...","f":"education","n":2},...],
    "chennaiCats":[{"label":"...","f":"civic","n":3},...]
  },
  "india":[...5 story objects...],
  "chennai":[...5 story objects...]
}`,

  sports: `Search live news for today's top 5 stories each in: Cricket, Football (soccer),
Tennis, and Formula 1. Include match results, upcoming fixtures, player news, and analysis.
Write full summaries with "Why it matters" and "My take" for each.
${BASE}
Return a single JSON object:
{
  "meta":{
    "date":"D Month YYYY","dateISO":"YYYY-MM-DD","editionLabel":"D Month YYYY",
    "trendLine":"...","sodTitle":"...","sodBody":"...",
    "ticker":["item",...10 items],
    "archiveEntries":[{"date":"...","today":true,"hl":"..."},{"date":"...","today":false,"hl":"..."}],
    "cats":[
      {"label":"🏏 Cricket","f":"cricket","n":5},
      {"label":"⚽ Football","f":"football","n":5},
      {"label":"🎾 Tennis","f":"tennis","n":5},
      {"label":"🏎️ Formula 1","f":"f1","n":5}
    ]
  },
  "cricket":[...5 story objects...],
  "football":[...5 story objects...],
  "tennis":[...5 story objects...],
  "f1":[...5 story objects...]
}`

};

// Export for Node.js (refresh.js) and browser (inline)
if (typeof module !== 'undefined') module.exports = PROMPTS;
