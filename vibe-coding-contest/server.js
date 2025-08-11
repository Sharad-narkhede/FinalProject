import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const REG_PATH = path.join(__dirname, 'registrations.csv');
if (!fs.existsSync(REG_PATH)) {
  fs.writeFileSync(REG_PATH, 'timestamp_iso,team,email,track,user_agent,remote_addr\n', 'utf-8');
}

app.post('/api/register', (req, res) => {
  const { team = '', email = '', track = '' } = req.body || {};
  if (!team.trim() || !email.trim() || !track.trim()) {
    return res.status(400).json({ ok: false, error: 'Missing required fields' });
  }
  const line = [new Date().toISOString(), team.replace(/,/g, ' '), email.replace(/,/g, ' '), track.replace(/,/g, ' '), (req.headers['user-agent']||'').replace(/,/g, ' '), req.ip || ''].join(',') + '\n';
  fs.appendFileSync(REG_PATH, line, 'utf-8');
  res.json({ ok: true });
});

app.use(express.static(__dirname));
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Vibe API+Static server listening on http://localhost:${PORT}`);
});