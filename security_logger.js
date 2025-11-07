// security_logger.js

const MAX_ATTEMPTS = 5; 
const SUCCESS_PASSWORDS = ["0391", "0561", "0586"];
const LOG_ENDPOINT = 'http://127.0.0.1:5000/api/log_collector'; 
const REDIRECT_DASHBOARD = 'dashboard.html';

// Load or initialize failed attempts and log history from session storage
let failedAttempts = JSON.parse(sessionStorage.getItem('failedAttempts')) || {};
let logHistory = JSON.parse(sessionStorage.getItem('logHistory')) || [];

const logForm = document.getElementById('login-form');
const logMessage = document.getElementById('log-message');

function saveState() {
    sessionStorage.setItem('failedAttempts', JSON.stringify(failedAttempts));
    sessionStorage.setItem('logHistory', JSON.stringify(logHistory));
}

async function sendLogEvent(logData) {
    // 1. Add to Client-Side History (Simulate data being added to log file)
    logHistory.push(logData);
    saveState();
    
    // 2. Send to Flask Backend (For actual log file collection)
    try {
        const response = await fetch(LOG_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(logData)
        });
        return response.ok;
    } catch (error) {
        console.error('Error sending log. Is the Flask server running?', error);
        return false;
    }
}


logForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = event.target.username.value;
    const password = event.target.password.value;
    const isSuccess = username === "admin" && SUCCESS_PASSWORDS.includes(password); 

    const ipAddress = "192.168.1.101"; // Placeholder IP
    
    // 1. Check Brute Force / Anomaly Status
    let status = isSuccess ? "SUCCESS" : "FAILURE";
    let eventType = "LOGIN_ATTEMPT";
    let isBruteForce = false;

    if (!isSuccess) {
        failedAttempts[username] = (failedAttempts[username] || 0) + 1;
        if (failedAttempts[username] >= MAX_ATTEMPTS) {
            isBruteForce = true;
            eventType = "SECURITY_BRUTE_FORCE_CANDIDATE";
        }
    } else {
        delete failedAttempts[username]; // Reset count on success
    }
    
    // 2. Build the Comprehensive Security Log Event (JSON)
    const logEvent = {
        timestamp: new Date().toISOString(),
        level: isSuccess ? "INFO" : (isBruteForce ? "CRITICAL" : "WARNING"),
        'src-ip': ipAddress, 
        'user_id': username, 
        'action': status, 
        'event_type': eventType,
        'is_successful': isSuccess,
        'failed_count_user': failedAttempts[username] || 0,
        'is_brute_force_candidate': isBruteForce,
        'user_agent': navigator.userAgent, 
    };

    // 3. Send the Log Event
    const logSent = await sendLogEvent(logEvent);

    // 4. Update UI Message & Redirect
    logMessage.classList.remove('hidden', 'success', 'error');
    if (logSent) {
        if (isSuccess) {
            logMessage.classList.add('success');
            logMessage.textContent = `Login SUCCESS! Redirecting to dashboard...`;
            // Redirect to the dashboard page on success
            setTimeout(() => { window.location.href = REDIRECT_DASHBOARD; }, 1000);
        } else {
            logMessage.classList.add('error');
            logMessage.textContent = isBruteForce ? `CRITICAL: Brute force detected. Logged.` : `Login FAILURE for ${username}. Logged.`;
        }
    } else {
        logMessage.classList.add('error');
        logMessage.textContent = `ERROR: Logging failed. Check console.`;
    }
});