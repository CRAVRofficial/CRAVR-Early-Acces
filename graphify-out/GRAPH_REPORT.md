# Graph Report - .  (2026-07-27)

## Corpus Check
- Corpus is ~19,048 words - fits in a single context window. You may not need a graph.

## Summary
- 40 nodes · 42 edges · 10 communities (7 shown, 3 thin omitted)
- Extraction: 93% EXTRACTED · 2% INFERRED · 5% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.95)
- Token cost: 84,330 input · 0 output

## Community Hubs (Navigation)
- Brevo Integration & Attributes
- script.js Form Logic
- Cloudflare Bridge Setup
- Worker Request Handling
- Brand & Hero Imagery
- Cinzel Font Licensing
- HTML Waitlist Form
- CRAVR Logo Asset
- Bridge Endpoint Placeholder
- Montserrat Font Licensing

## God Nodes (most connected - your core abstractions)
1. `Cloudflare Worker Bridge Function` - 6 edges
2. `Waitlist Form (#waitlist-form)` - 6 edges
3. `CRAVR Premium-Journal Brand` - 6 edges
4. `fetch()` - 4 edges
5. `corsHeaders()` - 3 edges
6. `json()` - 3 edges
7. `Brevo API` - 3 edges
8. `Cinzel Font` - 3 edges
9. `Montserrat Font` - 3 edges
10. `isValidEmail()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `CRAVR Premium-Journal Brand` --references--> `CRAVR Vektor Logo`  [EXTRACTED]
  index.html → assets/logo.svg
- `Cinzel Font` --conceptually_related_to--> `CRAVR Premium-Journal Brand`  [AMBIGUOUS]
  fonts/Cinzel/OFL.txt → index.html
- `Montserrat Font` --conceptually_related_to--> `CRAVR Premium-Journal Brand`  [AMBIGUOUS]
  fonts/Montserrat/OFL.txt → index.html
- `CRAVR Premium-Journal Brand` --references--> `Neoclassical Building Hero Image (dramatic colonnade at dusk)`  [EXTRACTED]
  index.html → assets/background-original.jpg
- `Cloudflare Worker Bridge Function` --references--> `script.js`  [EXTRACTED]
  bridge/README.md → index.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Waitlist Form to Brevo Signup Pipeline** — index_waitlist_form, bridge_readme_cloudflare_worker, bridge_readme_brevo_api, bridge_readme_brevo_api_key_secret [EXTRACTED 1.00]
- **Price Signal Capture Flow** — index_price_signal_field, bridge_readme_price_signal_attribute, bridge_readme_brevo_api [EXTRACTED 1.00]
- **CRAVR Brand Identity Assets** — assets_logo_cravr_vektor_logo, assets_background_original_neoclassical_building_image, index_cravr_brand [INFERRED 0.85]

## Communities (10 total, 3 thin omitted)

### Community 0 - "Brevo Integration & Attributes"
Cohesion: 0.33
Nodes (6): Brevo API, BREVO_API_KEY Secret, CRAVR Early Access List (Brevo ID 5), KI - Claude Code Setup (Vault Note), PRICE_SIGNAL Brevo Contact Attribute, PRICE_SIGNAL Radio Fieldset

### Community 1 - "script.js Form Logic"
Cohesion: 0.33
Nodes (4): emailInput, form, messageEl, submitButton

### Community 2 - "Cloudflare Bridge Setup"
Cohesion: 0.40
Nodes (5): Bennett (Setup Owner), Cloudflare Worker Bridge Function, GitHub Pages, Sicherheits-Review Step, worker.js

### Community 3 - "Worker Request Handling"
Cohesion: 0.80
Nodes (4): corsHeaders(), fetch(), isValidEmail(), json()

### Community 4 - "Brand & Hero Imagery"
Cohesion: 0.50
Nodes (4): Neoclassical Building Hero Image (dramatic colonnade at dusk), CRAVR Premium-Journal Brand, PLACEHOLDER_DATENSCHUTZ_URL, styles.css

### Community 5 - "Cinzel Font Licensing"
Cohesion: 0.50
Nodes (4): Cinzel Font, The Cinzel Project Authors (NDISCOVER), SIL Open Font License v1.1 (Cinzel), SIL Open Font License v1.1 (Montserrat)

### Community 6 - "HTML Waitlist Form"
Cohesion: 0.50
Nodes (4): Email Input Field, script.js, Submit Button (Platz sichern), Waitlist Form (#waitlist-form)

## Ambiguous Edges - Review These
- `CRAVR Premium-Journal Brand` → `Cinzel Font`  [AMBIGUOUS]
  index.html · relation: conceptually_related_to
- `CRAVR Premium-Journal Brand` → `Montserrat Font`  [AMBIGUOUS]
  index.html · relation: conceptually_related_to

## Knowledge Gaps
- **18 isolated node(s):** `form`, `emailInput`, `messageEl`, `submitButton`, `worker.js` (+13 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `CRAVR Premium-Journal Brand` and `Cinzel Font`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `CRAVR Premium-Journal Brand` and `Montserrat Font`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `Waitlist Form (#waitlist-form)` connect `HTML Waitlist Form` to `Bridge Endpoint Placeholder`, `Brevo Integration & Attributes`, `Cloudflare Bridge Setup`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **Why does `PRICE_SIGNAL Radio Fieldset` connect `Brevo Integration & Attributes` to `HTML Waitlist Form`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Why does `Cloudflare Worker Bridge Function` connect `Cloudflare Bridge Setup` to `HTML Waitlist Form`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **What connects `form`, `emailInput`, `messageEl` to the rest of the system?**
  _18 weakly-connected nodes found - possible documentation gaps or missing edges._