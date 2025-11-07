# 🔒 Security Log Collector and Anomaly Dashboard

A full-stack application (Python Flask + HTML/CSS/JS) designed to simulate a secure login process, collect comprehensive authentication logs in real-time, and display a simulated User Behavior Analysis (UBA) dashboard.

This project is structured for easy integration with a Machine Learning pipeline for anomaly detection (the next planned step).

## 🚀 How to Run the Application

This application requires two separate terminal processes to run the backend and the frontend.

### Prerequisites

1.  **Python 3.x** must be installed.
2.  Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```

### Step 1: Start the Backend (Log Collector)

This server receives all login attempts (SUCCESS/FAILURE/BRUTE FORCE) from the browser and writes them to the `application_logs.jsonl` file.

1.  Open your first terminal window in the project directory.
2.  Run the Flask server:
    ```bash
    python app.py
    ```
    The server will run on `http://127.0.0.1:5000`. Keep this window open.

### Step 2: Start the Frontend (Login Page)

This server hosts the HTML/JavaScript files that users interact with.

1.  Open a **second terminal** window in the project directory.
2.  Run a simple Python web server:
    ```bash
    python -m http.server 8000
    ```
3.  Open your browser and navigate to: `http://localhost:8000`

### Step 3: Test and Generate Logs

1.  **Generate Data:** Use the login form at `http://localhost:8000`.
2.  **Success Credentials:** `Username: admin` with one of the passwords: `0391`, `0561`, or `0586`.
3.  **Simulate Brute Force:** Try 5 or more failed logins with the same username to trigger a `CRITICAL` log event and see the **Insider Anomaly** warning on the dashboard.
4.  **View Logs:** Successful logins redirect you to the dashboard, showing the simulated security analysis based on the attempts logged in that session. All structured logs are permanently saved in `application_logs.jsonl`.

---

## 📁 Project Contents

* `app.py`: Flask server for log collection (`/api/log_collector`).
* `index.html`: Login Form.
* `dashboard.html`: Simulated Security Analysis and Log History Dashboard.
* `security_logger.js`: Frontend logic, including brute force tracking and log transmission.
* `requirements.txt`: Python dependencies (Flask, Flask-CORS).
* `.gitignore`: Tells Git to ignore `application_logs.jsonl`, `__pycache__`, etc."# security-log-app" 
