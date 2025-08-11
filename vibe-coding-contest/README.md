# Vibe Coding Contest — Static Site

A unique, design-forward landing page and micro-site for the Vibe Coding Contest. Built as a simple, framework-free static site you can deploy anywhere.

## Quick start

- Serve locally (Python):

```bash
cd /workspace/vibe-coding-contest
python3 -m http.server 8080
# open http://localhost:8080
```

- Or serve with Node:

```bash
npx --yes serve -l 8080
# open http://localhost:8080
```

## Customize

- Update dates in `index.html` and `script.js` (the `START_TIME`) to your real schedule
- Replace copy in sections: `About`, `Tracks`, `Schedule`, `Prizes`, `Rules`, `FAQ`
- Tweak colors in `styles.css` by editing `:root` CSS variables
- Add sponsor logos or links to the footer

## Deploy

- Static hosting works anywhere (GitHub Pages, Netlify, Vercel, S3)
- No build step required — just upload the three files

## Backend (optional)

To save registrations locally, run the Flask API alongside the static site.

```bash
cd /workspace/vibe-coding-contest
pip3 install -r requirements.txt
python3 app.py  # serves API at http://localhost:5050
```

The frontend posts to `http://localhost:5050/api/register` and saves entries to `registrations.csv`.

## Backend (Node alternative)

This repo also includes a Node/Express server that both serves the static site and handles registrations.

```bash
cd /workspace/vibe-coding-contest
npm install
npm run dev  # http://localhost:5050
```

The frontend will work out of the box since it posts to `http://localhost:5050/api/register`.