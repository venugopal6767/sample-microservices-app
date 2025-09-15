
from flask import Flask, jsonify, request
from prometheus_client import Counter, generate_latest, CONTENT_TYPE_LATEST
import os, requests

app = Flask(__name__)
BOOKINGS = []
c = Counter('booking_requests_total','Total booking requests')

EVENTS_URL = os.environ.get('EVENTS_URL','http://events-service:5000/events')

@app.route('/book', methods=['POST'])
def book():
    c.inc()
    body = request.json or {}
    BOOKINGS.append(body)
    return jsonify({'status':'ok','booking':body}), 201

@app.route('/bookings')
def list_bookings():
    return jsonify(BOOKINGS)

@app.route('/metrics')
def metrics():
    resp = generate_latest()
    return resp, 200, {'Content-Type': CONTENT_TYPE_LATEST}

@app.route('/health')
def health():
    return 'OK', 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT',5001)))
