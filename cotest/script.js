(function () {
  const root = document.documentElement;
  const toggleThemeButton = document.getElementById('toggleTheme');
  const runButton = document.getElementById('runDemo');
  const clearButton = document.getElementById('clearLog');
  const logEl = document.getElementById('log');
  const progressBar = document.getElementById('progressBar');
  const yearEl = document.getElementById('year');
  const scenarioEl = document.getElementById('scenario');
  const retriesEl = document.getElementById('retries');
  const verboseEl = document.getElementById('verbose');

  // Update year
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Persisted theme
  const THEME_KEY = 'cotest:theme';
  const initialTheme = localStorage.getItem(THEME_KEY) || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  if (initialTheme === 'light') {
    root.setAttribute('data-theme', 'light');
  }

  function toggleTheme() {
    const isLight = root.getAttribute('data-theme') === 'light';
    if (isLight) {
      root.removeAttribute('data-theme');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }

  toggleThemeButton?.addEventListener('click', toggleTheme);

  function log(line, opts = {}) {
    const time = new Date().toLocaleTimeString();
    const prefix = opts.muted ? '[..]' : '[ok]';
    const el = document.createElement('div');
    el.innerHTML = `<span class="muted">${time}</span> ${prefix} ${line}`;
    logEl?.appendChild(el);
    logEl?.scrollTo({ top: logEl.scrollHeight });
  }

  function clearLog() {
    if (logEl) logEl.textContent = '';
    if (progressBar) progressBar.style.width = '0%';
  }

  clearButton?.addEventListener('click', clearLog);

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  async function runDemoOnce({ scenario, verbose }) {
    const totalSteps = 9;
    log(`Scenario: ${scenario}`);
    if (verbose) log('Bootstrapping demo environment…', { muted: true });
    for (let step = 1; step <= totalSteps; step += 1) {
      const pct = Math.floor((step / totalSteps) * 100);
      if (progressBar) progressBar.style.width = `${pct}%`;
      switch (step) {
        case 1: verbose && log('Checking dependencies'); break;
        case 2: verbose && log('Seeding test data'); break;
        case 3: log('Spinning up worker…'); break;
        case 4: log('Hitting endpoint /health'); break;
        case 5: log('Validating response schema'); break;
        case 6: verbose && log('Capturing snapshot'); break;
        case 7: log('Asserting status === 200'); break;
        case 8: log('Measuring performance'); break;
        case 9: log('Tearing down…', { muted: true }); break;
      }
      await sleep(180 + Math.random() * 240);
    }
    const ok = Math.random() > 0.1; // 90% success
    if (ok) {
      log('Result: PASS ✅');
    } else {
      log('Result: FLAKY ⚠️ Retrying…');
    }
    return ok;
  }

  async function runDemo() {
    runButton.disabled = true;
    clearLog();
    const scenario = scenarioEl?.value || 'api';
    const retries = Number(retriesEl?.value || 0);
    const verbose = Boolean(verboseEl?.checked);

    let attempt = 0;
    let success = false;
    while (attempt <= retries && !success) {
      attempt += 1;
      log(`Attempt ${attempt}/${retries + 1}`);
      // eslint-disable-next-line no-await-in-loop
      success = await runDemoOnce({ scenario, verbose });
      if (!success && attempt <= retries) {
        await sleep(350);
      }
    }

    if (success) {
      const duration = 800 + Math.floor(Math.random() * 600);
      log(`All checks green in ~${duration}ms`);
      celebrate(progressBar);
    } else {
      log('Final: FAIL ❌ Please inspect logs.');
    }

    runButton.disabled = false;
  }

  runButton?.addEventListener('click', runDemo);

  function celebrate(anchor) {
    if (!anchor) return;
    const burst = document.createElement('div');
    burst.className = 'burst';
    const rect = anchor.getBoundingClientRect();
    burst.style.left = `${rect.left + rect.width}px`;
    burst.style.top = `${rect.top}px`;
    document.body.appendChild(burst);
    requestAnimationFrame(() => burst.classList.add('go'));
    setTimeout(() => burst.remove(), 1200);
  }

  // Minimal styles for celebration burst, injected to keep CSS file focused
  const style = document.createElement('style');
  style.textContent = `
  .burst { position: fixed; width: 6px; height: 6px; border-radius: 50%; background: var(--primary); box-shadow:
    0 0 0 0 var(--primary),
    0 0 0 0 var(--primary),
    0 0 0 0 var(--primary),
    0 0 0 0 var(--primary),
    0 0 0 0 var(--primary),
    0 0 0 0 var(--primary);
    transform: translate(-16px, -2px);
    opacity: 0.9;
  }
  .burst.go { animation: burst 1.1s ease forwards; }
  @keyframes burst {
    0% { box-shadow:
      -10px -6px 0 0 var(--primary),
      6px -8px 0 0 var(--primary-strong),
      10px 0 0 0 var(--primary),
      -6px 10px 0 0 var(--primary-strong),
      8px 12px 0 0 var(--primary),
      -12px 6px 0 0 var(--primary-strong); opacity: 1; }
    100% { box-shadow:
      -30px -20px 0 0 transparent,
      18px -24px 0 0 transparent,
      28px 0 0 0 transparent,
      -18px 28px 0 0 transparent,
      24px 34px 0 0 transparent,
      -36px 18px 0 0 transparent; opacity: 0; }
  }`;
  document.head.appendChild(style);
})();