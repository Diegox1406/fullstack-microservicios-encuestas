from app import db
from sqlalchemy.dialects.sqlite import JSON

class Survey(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.String)

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    survey_id = db.Column(db.Integer, db.ForeignKey('survey.id'), nullable=False)
    text = db.Column(db.String, nullable=False)
    qtype = db.Column(db.String, nullable=False)  # 'text', 'multiple', 'scale'
    metadata = db.Column(JSON, default={})  # options, scale range, etc.

    survey = db.relationship('Survey', backref=db.backref('questions', cascade='all,delete'))
