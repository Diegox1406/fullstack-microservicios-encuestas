from flask import Flask, Blueprint, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from sqlalchemy.dialects.sqlite import JSON

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////data/surveys.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)

db = SQLAlchemy(app)
ma = Marshmallow(app)

# Models
class Survey(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.String)

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    survey_id = db.Column(db.Integer, db.ForeignKey('survey.id'), nullable=False)
    text = db.Column(db.String, nullable=False)
    qtype = db.Column(db.String, nullable=False)
    question_metadata = db.Column(JSON, default={})  # Cambio aquí
    survey = db.relationship('Survey', backref=db.backref('questions', cascade='all,delete'))

# Schemas
class QuestionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Question
        include_fk = True

class SurveySchema(ma.SQLAlchemyAutoSchema):
    questions = ma.Nested(QuestionSchema, many=True)
    class Meta:
        model = Survey

survey_schema = SurveySchema()
surveys_schema = SurveySchema(many=True)
question_schema = QuestionSchema()
questions_schema = QuestionSchema(many=True)

# Routes
bp = Blueprint('surveys', __name__)

@bp.route('/', methods=['POST'])
def create_survey():
    data = request.get_json()
    s = Survey(title=data.get('title'), description=data.get('description'))
    db.session.add(s)
    db.session.commit()
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
    db.session.delete(s)
    db.session.commit()
    return '', 204

@bp.route('/<int:survey_id>/questions', methods=['POST'])
def add_question(survey_id):
    Survey.query.get_or_404(survey_id)
    data = request.get_json()
    q = Question(survey_id=survey_id, text=data['text'], qtype=data['qtype'], question_metadata=data.get('metadata', {}))  # Cambio aquí
    db.session.add(q)
    db.session.commit()
    return question_schema.jsonify(q), 201

@bp.route('/<int:survey_id>/questions', methods=['GET'])
def list_questions(survey_id):
    Survey.query.get_or_404(survey_id)
    qs = Question.query.filter_by(survey_id=survey_id).all()
    return questions_schema.jsonify(qs)

app.register_blueprint(bp, url_prefix='/api/surveys')

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
