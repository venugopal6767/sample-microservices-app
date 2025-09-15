
from flask import Flask, jsonify
from prometheus_client import Counter, generate_latest, CONTENT_TYPE_LATEST
import os

app = Flask(__name__)
EVENTS = [
    {"id":1,"name":"Kubernetes Workshop","capacity":100},
    {"id":2,"name":"ELK Hands-on","capacity":50}
]

c = Counter('events_requests_total','Total events requests')

@app.route('/events')
def list_events():
    c.inc()
    return jsonify(EVENTS)

@app.route('/metrics')
def metrics():
    resp = generate_latest()
    return resp, 200, {'Content-Type': CONTENT_TYPE_LATEST}

@app.route('/health')
def health():
    return 'OK', 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT',5000)))
