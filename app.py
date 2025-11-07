# app.py - Python Flask Server (Log Collector)
import json
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS 
from pathlib import Path

# --- Configuration ---
LOG_FILE_PATH = Path("application_logs.jsonl") 
SERVER_PORT = 5000

app = Flask(__name__)
CORS(app) # Enable cross-origin requests for development

@app.route('/api/log_collector', methods=['POST'])
def log_collector():
    """
    Receives a JSON log event from the client and writes it to the log file.
    """
    if not request.is_json:
        return jsonify({"message": "Missing JSON in request"}), 400

    log_data = request.get_json()
    
    # 1. Add Server-Side Context
    log_data['server_timestamp'] = datetime.utcnow().isoformat() + 'Z'
    log_data['source_ip_actual'] = request.remote_addr # Capture the actual IP from the request

    # 2. Write the Log Data to the JSONL file
    try:
        # Open the file in append mode ('a') and write the JSON object followed by a newline
        with open(LOG_FILE_PATH, 'a', encoding='utf-8') as f:
            f.write(json.dumps(log_data))
            f.write('\n')
        
        print(f"✅ LOG WRITTEN: {log_data.get('event_type', 'UNKNOWN')} for user {log_data.get('user_id', 'N/A')}")
        return jsonify({"message": "Log event recorded successfully", "status": "ok"}), 200
        
    except Exception as e:
        print(f"🚨 ERROR writing log file: {e}")
        return jsonify({"message": f"Server error while logging: {str(e)}"}), 500


if __name__ == '__main__':
    print(f"--- Starting Flask Log Collector Backend ---")
    print(f"Listening on port {SERVER_PORT} for logs.")
    print(f"Logs will be written to: {LOG_FILE_PATH.resolve()}")
    app.run(port=SERVER_PORT, debug=True, use_reloader=False)