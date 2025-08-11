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