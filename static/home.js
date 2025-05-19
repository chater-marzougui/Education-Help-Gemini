// Global variables
let selectedFile = null;
let apiKeyValidated = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    // Load saved API key
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
        document.getElementById('apiKey').value = savedApiKey;
        updateApiKeyStatus(true);
        apiKeyValidated = true;
        updateLaunchButton();
    }
}

function setupEventListeners() {
    // API Key management
    document.getElementById('toggleApiKey').addEventListener('click', toggleApiKeyVisibility);
    document.getElementById('validateApiKey').addEventListener('click', validateApiKey);
    document.getElementById('saveApiKey').addEventListener('click', saveApiKey);
    document.getElementById('clearApiKey').addEventListener('click', clearApiKey);
    // Launch viewer
    document.getElementById('launchViewer').addEventListener('click', launchViewer);

    // API key input validation
    document.getElementById('apiKey').addEventListener('input', function() {
        apiKeyValidated = false;
        updateApiKeyStatus(false);
        updateLaunchButton();
    });
}

// API Key Management
function toggleApiKeyVisibility() {
    const input = document.getElementById('apiKey');
    const button = document.getElementById('toggleApiKey');
    
    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = '🙈';
        button.title = 'Hide API key';
    } else {
        input.type = 'password';
        button.textContent = '👁️';
        button.title = 'Show API key';
    }
}

async function launchViewer() {
    if (!apiKeyValidated) {
        showNotification('Please complete the setup first', 'warning');
        return;
    }

    try {
        showLoadingOverlay(true);
        // Navigate to viewer page
        window.location.href = 'viewer.html';
        
    } catch (error) {
        showLoadingOverlay(false);
        console.error(error);
        showNotification('Failed: ' + error.message, 'error');
    }
}

function showNotification(message, type = 'success') {
    const container = document.getElementById('notificationContainer');
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon;
    if (type === 'success') {
        icon = '✅';
    } else if (type === 'error') {
        icon = '❌';
    } else {
        icon = '⚠️';
    }
    notification.innerHTML = `
        <span style="font-size: 1.2rem;">${icon}</span>
        <span>${message}</span>
    `;
    
    container.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function showLoadingOverlay(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.add('show');
    } else {
        overlay.classList.remove('show');
    }
}

// Handle browser back button
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        // Page was loaded from cache (back button)
        showLoadingOverlay(false);
    }
});
async function validateApiKey() {
    const apiKey = document.getElementById('apiKey').value.trim();
    
    if (!apiKey) {
        showNotification('Please enter an API key', 'error');
        return;
    }

    try {
        showLoadingOverlay(true);
        
        // Test API key with a simple request
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: 'Hello' }]
                }]
            })
        });

        if (response.ok) {
            apiKeyValidated = true;
            updateApiKeyStatus(true);
            showNotification('API key validated successfully!', 'success');
        } else {
            apiKeyValidated = false;
            updateApiKeyStatus(false);
            const errorData = await response.json();
            showNotification(`Invalid API key: ${errorData.error?.message || 'Please check your key'}`, 'error');
        }
    } catch (error) {
        apiKeyValidated = false;
        updateApiKeyStatus(false);
        showNotification('Failed to validate API key. Please check your internet connection.', error.message);
        console.error('Error validating API key:', error);
    } finally {
        showLoadingOverlay(false);
        updateLaunchButton();
    }
}

function saveApiKey() {
    const apiKey = document.getElementById('apiKey').value.trim();
    
    if (!apiKey) {
        showNotification('Please enter an API key', 'error');
        return;
    }

    try {
        localStorage.setItem('gemini_api_key', apiKey);
        showNotification('API key saved successfully!', 'success');
        
        // Auto-validate after saving
        if (!apiKeyValidated) {
            validateApiKey();
        }
    } catch (error) {
        showNotification('Failed to save API key: ' + error.message, 'error');
    }
}

function clearApiKey() {
    localStorage.removeItem('gemini_api_key');
    document.getElementById('apiKey').value = '';
    apiKeyValidated = false;
    updateApiKeyStatus(false);
    updateLaunchButton();
    showNotification('API key cleared', 'success');
}

function updateApiKeyStatus(connected) {
    const status = document.getElementById('apiKeyStatus');
    
    if (connected) {
        status.className = 'api-key-status connected';
        status.innerHTML = '<span>✅</span><span>API Key Configured</span>';
    } else {
        status.className = 'api-key-status disconnected';
        status.innerHTML = '<span>🔑</span><span>API Key Not Configured</span>';
    }
}
// Launch viewer
function updateLaunchButton() {
    const button = document.getElementById('launchViewer');
    const canLaunch = apiKeyValidated;
    
    button.disabled = !canLaunch;
    
    if (canLaunch) {
        button.innerHTML = '<span>🚀</span>Launch PDF AI Viewer';
    } else if (!apiKeyValidated && !selectedFile) {
        button.innerHTML = '<span>⏳</span>Complete Setup to Launch';
    } else if (!apiKeyValidated) {
        button.innerHTML = '<span>🔑</span>Validate API Key to Launch';
    }
}