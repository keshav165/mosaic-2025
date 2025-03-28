from flask import Flask, request, jsonify, send_file
import os
from werkzeug.utils import secure_filename
import datetime
import csv

app = Flask(__name__)

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# CSV file path
CSV_FILE = 'registrations.csv'

@app.route('/register', methods=['POST'])
def register():
    try:
        # Get form data
        data = {
            'contest_name': request.form.get('contestName'),
            'college_name': request.form.get('collegeName'),
            'team_name': request.form.get('teamName'),
            'leader_name': request.form.get('leaderName'),
            'leader_phone': request.form.get('leaderPhone'),
            'leader_email': request.form.get('leaderEmail'),
            'hear_about': request.form.get('hearAbout'),
            'transaction_id': request.form.get('transactionId'),
            'registration_date': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }

        # Handle file upload
        if 'idProof' in request.files:
            file = request.files['idProof']
            if file.filename != '':
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)
                data['id_proof_file'] = filename

        # Write to CSV
        fieldnames = list(data.keys())
        file_exists = os.path.exists(CSV_FILE)

        with open(CSV_FILE, 'a', newline='') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            if not file_exists:
                writer.writeheader()
            writer.writerow(data)

        return jsonify({
            'status': 'success',
            'message': 'Registration successful'
        })

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/download', methods=['GET'])
def download():
    try:
        return send_file(CSV_FILE, as_attachment=True)
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
