from flask import Flask, request, jsonify
from flask_cors import CORS
import csv
import os
from datetime import datetime

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app, resources={r"/api/*": {"origins": "*"}})

REG_PATH = os.path.join(os.path.dirname(__file__), 'registrations.csv')

# Ensure CSV has header
if not os.path.exists(REG_PATH):
    with open(REG_PATH, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['timestamp_iso', 'team', 'email', 'track', 'user_agent', 'remote_addr'])

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json(silent=True) or {}
    team = (data.get('team') or '').strip()
    email = (data.get('email') or '').strip()
    track = (data.get('track') or '').strip()

    if not team or not email or not track:
        return jsonify({"ok": False, "error": "Missing required fields"}), 400

    with open(REG_PATH, 'a', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([
            datetime.utcnow().isoformat() + 'Z',
            team,
            email,
            track,
            request.headers.get('User-Agent', ''),
            request.remote_addr or ''
        ])

    return jsonify({"ok": True})

@app.route('/')
def root():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5050))
    app.run(host='0.0.0.0', port=port)