from flask import Blueprint, request, jsonify
from app import db
from models import Response
import requests

bp = Blueprint('responses', __name__)

SURVEYS_BASE = 'http://surveys-service:5001/api/surveys'

def validate_against_survey(survey_id, answers):
    r = requests.get(f'{SURVEYS_BASE}/{survey_id}')
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
            opts = q.get('metadata', {}).get('options', [])
            if ans not in opts:
                return False, f'answer {ans} not in options for question {qid}'
    return True, None

@bp.route('/', methods=['POST'])
def submit_response():
    data = request.get_json()
    survey_id = data.get('survey_id')
    answers = data.get('answers', {})
    ok, err = validate_against_survey(survey_id, answers)
    if not ok:
        return jsonify({'error': err}), 400
    resp = Response(survey_id=survey_id, participant=data.get('participant'), answers=answers)
    db.session.add(resp); db.session.commit()
    return jsonify({'id': resp.id}), 201

@bp.route('/survey/<int:survey_id>', methods=['GET'])
def list_by_survey(survey_id):
    items = Response.query.filter_by(survey_id=survey_id).all()
    return jsonify([{'id':r.id, 'participant':r.participant, 'answers':r.answers, 'created_at':r.created_at.isoformat()} for r in items])
