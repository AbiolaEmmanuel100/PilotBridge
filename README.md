# PilotBridge — Demonstration Prototype

A simple, static information tool that helps users explore possible reasons an international payment might fail and see fictional sample options.  

**This version processes no payments, issues no cards, and contains no real provider data.**

## Important disclaimers

- All provider records are fictional and labelled **DEMO — NOT A REAL PROVIDER**.
- Fee notes and limitations are illustrative only.
- The site does not collect, transmit, or store feedback or personal information.
- No connection is made to any live payment service or to the separate Receipt Pilot project.

## Project structure

```
pilotbridge/
├── index.html          # Main page
├── styles.css          # Styles (mobile-first)
├── app.js              # Filtering and rendering logic
├── data/
│   ├── problems.json   # Four approved problem categories
│   └── providers.json  # Fictional sample providers
└── README.md
```

## Run locally

1. Open a terminal in the `pilotbridge` folder.
2. Start a simple local server (required so the browser can load the JSON files):

   ```bash
   # Python 3
   python -m http.server 8000
   ```

   Or use any other static server you prefer.

3. Open http://localhost:8000 in your browser.
4. Select a problem, fill the short form, and click “Show sample options”.

You can also open `index.html` directly in some browsers, but fetching local JSON may be blocked; a local server is recommended.

## Deploy to Netlify (when you are ready)

1. Create a new site on Netlify.
2. Drag-and-drop the entire `pilotbridge` folder, or connect a Git repository containing these files.
3. Publish directory: the folder that contains `index.html` (root of this project).
4. No build command is needed.
5. Netlify will provide HTTPS automatically.

Keep this site completely separate from any other projects.

## Testing notes

The prototype was manually reviewed for:

- All four problem categories appear and can be selected.
- Filtering by country, purpose, and payment method returns only matching sample records.
- A clear “no sample options” message appears when nothing matches.
- Reset clears selections and hides results.
- Every provider card shows the exact “DEMO — NOT A REAL PROVIDER” badge.
- Dynamic text is inserted with `textContent` (no HTML injection).
- The feedback button states that data is not transmitted or saved.
- Layout is usable at narrow mobile widths (CSS is mobile-first).
- No external dependencies, API keys, or production credentials are present.

## Next steps (after your review)

- Replace sample data with real, verified provider information only after checking official documentation.
- Add genuine feedback collection only after reviewing privacy implications.
- Consider a database only if structured admin updates become necessary.
