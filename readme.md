# Expense Tracker

A personal income/expense tracker built with plain HTML, CSS and JavaScript. No frameworks, no build step.

## Files

- `index.html` — structure: balance card, add-entry form, category breakdown, transaction list
- `style.css` — all styling, including light/dark mode (auto-adapts to system theme)
- `script.js` — app logic: add/delete entries, balance calculation, category breakdown, localStorage persistence

## Features

- **Balance card** showing current balance, total income, and total expenses
- **Add entry form** with description, amount, category, and income/expense toggle
- **Category breakdown** — horizontal bar chart showing spending by category (built with plain CSS, no chart library)
- **Transaction history** — newest first, color-coded by type
- **Delete individual entries** or **clear all** (with confirmation)
- Everything persists across page reloads (stored in `localStorage`)

## How to run

Keep all files (`index.html`, `style.css`, `script.js`) in the **same folder**, then open `index.html` in any browser. No server or installation needed.

## How to customize

- **Categories**: edit the `<option>` list inside the `#categoryInput` select in `index.html`
- **Currency symbol**: change the `₹` in the `formatMoney()` function in `script.js`
- **Colors/fonts**: edit the CSS variables at the top of `style.css`

## Notes

Good project for practicing:
- Calculating totals and aggregating data by category
- Rendering a simple bar chart with plain CSS (no external chart library)
- `localStorage` for persistence
- Building a small multi-part UI (summary card + form + chart + list) that all stay in sync
-