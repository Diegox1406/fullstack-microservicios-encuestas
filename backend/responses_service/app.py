from flask import Flask, Blueprint, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy.dialects.sqlite import JSON
from datetime import datetime
import requests

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////data/responses.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)

db = SQLAlchemy(app)

# Model
class Response(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    survey_id = db.Column(db.Integer, nullable=False)
    participant = db.Column(db.String, nullable=True)
    answers = db.Column(JSON, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Routes
bp = Blueprint('responses', __name__)
SURVEYS_BASE = 'http://surveys-service:5001/api/surveys'

def validate_against_survey(survey_id, answers):
    try:
        r = requests.get(f'{SURVEYS_BASE}/{survey_id}', timeout=5)
        if r.status_code != 200:
            return False, 'Survey not found'
        survey = r.json()
        qmap = {q['id']: q for q in survey.get('questions', [])}
        for qid_str, ans in answers.items():
            try:
                qid = int(qid_str)
            except:
                return False, f'invalid question id {qid_str}'
            q = qmap.get(qid)
            if not q:
                return False, f'question {qid} not in survey'
            qtype = q.get('qtype')
            if qtype == 'multiple':
                opts = q.get('question_metadata', {}).get('options', [])  # Cambio aquí
                if ans not in opts:
                    return False, f'answer {ans} not in options for question {qid}'
        return True, None
    except Exception as e:
        return False, str(e)

@bp.route('/', methods=['POST'])
def submit_response():
    data = request.get_json()
    survey_id = data.get('survey_id')
    answers = data.get('answers', {})
    ok, err = validate_against_survey(survey_id, answers)
    if not ok:
        return jsonify({'error': err}), 400
    resp = Response(survey_id=survey_id, participant=data.get('participant'), answers=answers)
    db.session.add(resp)
    db.session.commit()
    return jsonify({'id': resp.id}), 201

@bp.route('/survey/<int:survey_id>', methods=['GET'])
def list_by_survey(survey_id):
    items = Response.query.filter_by(survey_id=survey_id).all()
    return jsonify([{'id':r.id, 'participant':r.participant, 'answers':r.answers, 'created_at':r.created_at.isoformat()} for r in items])

app.register_blueprint(bp, url_prefix='/api/responses')

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)
