from app import ma
from models import Survey, Question

class QuestionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Question
        include_fk = True

class SurveySchema(ma.SQLAlchemyAutoSchema):
    questions = ma.Nested(QuestionSchema, many=True)
    class Meta:
        model = Survey
