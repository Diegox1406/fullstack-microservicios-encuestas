from flask import Flask, Blueprint, jsonify, send_file
from flask_cors import CORS
import requests
import io
import pandas as pd

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    bp = Blueprint('reports', __name__)
    RESPONSES_BASE = 'http://responses-service:5002/api/responses'
    SURVEYS_BASE = 'http://surveys-service:5001/api/surveys'

    @bp.route('/survey/<int:survey_id>/stats', methods=['GET'])
    def survey_stats(survey_id):
        try:
            rs = requests.get(f'{RESPONSES_BASE}/survey/{survey_id}', timeout=5)
            ss = requests.get(f'{SURVEYS_BASE}/{survey_id}', timeout=5)
            if rs.status_code != 200 or ss.status_code != 200:
                return jsonify({'error': 'survey or responses not available'}), 502
            responses = rs.json()
            survey = ss.json()
            stats = {}
            for q in survey.get('questions', []):
                qid = str(q['id'])
                qtype = q['qtype']
                vals = [r['answers'].get(qid) for r in responses if qid in r['answers']]
                if qtype in ('multiple',):
                    counts = {}
                    for v in vals:
                        counts[v] = counts.get(v, 0) + 1
                    stats[qid] = {'text': q['text'], 'counts': counts}
                elif qtype == 'scale':
                    nums = [float(v) for v in vals if v is not None]
                    stats[qid] = {'text': q['text'], 'count': len(nums), 'mean': sum(nums)/len(nums) if nums else None}
                else:
                    stats[qid] = {'text': q['text'], 'responses': vals}
            return jsonify({'survey': survey['title'], 'stats': stats})
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @bp.route('/survey/<int:survey_id>/export/excel', methods=['GET'])
    def export_excel(survey_id):
        try:
            rs = requests.get(f'{RESPONSES_BASE}/survey/{survey_id}', timeout=5)
            if rs.status_code != 200:
                return jsonify({'error': 'responses not available'}), 502
            df = pd.DataFrame(rs.json())
            output = io.BytesIO()
            with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
                df.to_excel(writer, index=False, sheet_name='responses')
            output.seek(0)
            return send_file(output, download_name=f'survey_{survey_id}_responses.xlsx', as_attachment=True)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    app.register_blueprint(bp, url_prefix='/api/reports')
    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003, debug=True)
