from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from datetime import timedelta
import requests

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'change-this-secret-key-in-production'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)  # Token dura 24 horas
jwt = JWTManager(app)
CORS(app, resources={r"/*": {"origins": "*"}})

SERVICES = {
    'surveys': 'http://surveys-service:5001',
    'responses': 'http://responses-service:5002',
    'reports': 'http://reports-service:5003'
}

# Base de datos de usuarios en memoria
USERS = {'admin': 'password123'}

@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
    
    if username in USERS:
        return jsonify({'error': 'Username already exists'}), 409
    
    USERS[username] = password
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if USERS.get(username) == password:
        token = create_access_token(identity=username)
        return jsonify({'access_token': token}), 200
    return jsonify({'error': 'Invalid credentials'}), 401

def proxy_request(service_name, path):
    url = f"{SERVICES[service_name]}{path}"
    method = request.method
    headers = {k: v for k, v in request.headers if k.lower() not in ['host', 'content-length']}
    
    try:
        resp = requests.request(
            method=method,
            url=url,
            json=request.get_json() if request.is_json else None,
            headers=headers,
            params=request.args,
            timeout=30
        )
        return resp.content, resp.status_code, resp.headers.items()
    except requests.RequestException as e:
        return jsonify({'error': f'Service unavailable: {str(e)}'}), 503

@app.route('/api/surveys', methods=['GET', 'POST'])
@app.route('/api/surveys/', methods=['GET', 'POST'])
@app.route('/api/surveys/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE'])
@jwt_required()
def surveys_proxy(path=''):
    full_path = f'/api/surveys/{path}' if path else '/api/surveys/'
    return proxy_request('surveys', full_path)

@app.route('/api/responses', methods=['GET', 'POST'])
@app.route('/api/responses/', methods=['GET', 'POST'])
@app.route('/api/responses/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE'])
@jwt_required()
def responses_proxy(path=''):
    full_path = f'/api/responses/{path}' if path else '/api/responses/'
    return proxy_request('responses', full_path)

@app.route('/api/reports/<path:path>', methods=['GET', 'POST'])
@jwt_required()
def reports_proxy(path):
    return proxy_request('reports', f'/api/reports/{path}')

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'users': len(USERS)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
