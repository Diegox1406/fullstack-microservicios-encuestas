from flask import Blueprint, request, jsonify
from app import db
from models import Survey, Question
from schemas import SurveySchema, QuestionSchema

bp = Blueprint('surveys', __name__)
survey_schema = SurveySchema()
surveys_schema = SurveySchema(many=True)
question_schema = QuestionSchema()
questions_schema = QuestionSchema(many=True)

@bp.route('/', methods=['POST'])
def create_survey():
    data = request.get_json()
    s = Survey(title=data.get('title'), description=data.get('description'))
    db.session.add(s); db.session.commit()
    return survey_schema.jsonify(s), 201

@bp.route('/', methods=['GET'])
def list_surveys():
    all_s = Survey.query.all()
    return surveys_schema.jsonify(all_s)

@bp.route('/<int:id>', methods=['GET'])
def get_survey(id):
    s = Survey.query.get_or_404(id)
    return survey_schema.jsonify(s)

@bp.route('/<int:id>', methods=['DELETE'])
def delete_survey(id):
    s = Survey.query.get_or_404(id)
    db.session.delete(s); db.session.commit()
    return '', 204

@bp.route('/<int:survey_id>/questions', methods=['POST'])
def add_question(survey_id):
    Survey.query.get_or_404(survey_id)
    data = request.get_json()
    q = Question(survey_id=survey_id, text=data['text'], qtype=data['qtype'], metadata=data.get('metadata', {}))
    db.session.add(q); db.session.commit()
    return question_schema.jsonify(q), 201

@bp.route('/<int:survey_id>/questions', methods=['GET'])
def list_questions(survey_id):
    Survey.query.get_or_404(survey_id)
    qs = Question.query.filter_by(survey_id=survey_id).all()
    return questions_schema.jsonify(qs)
