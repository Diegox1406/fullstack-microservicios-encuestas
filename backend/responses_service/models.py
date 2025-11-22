from app import db
from sqlalchemy.dialects.sqlite import JSON
from datetime import datetime

class Response(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    survey_id = db.Column(db.Integer, nullable=False)
    participant = db.Column(db.String, nullable=True)
    answers = db.Column(JSON, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
