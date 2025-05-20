// Global state
let pdfDoc = null;
let currentPage = 1;
let scale = 1.0;
let canvas = null;
let ctx = null;
let geminiApiKey = '';
let chatHistory = [];
let isAnalyzing = false;
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let canvasPosition = { x: 0, y: 0 };

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    checkApiKey();
    setupFileUpload();
});

function checkApiKey() {
    geminiApiKey = localStorage.getItem('gemini_api_key');
    if (!geminiApiKey) {
        // Redirect to API key setup page
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

function setupFileUpload() {
    const fileInput = document.getElementById('pdfUpload');
    const dropArea = document.getElementById('dropArea');
    const fileInfo = document.getElementById('fileInfo');
    const fileError = document.getElementById('fileError');
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    // Highlight drop area when file is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    // Remove highlight when file leaves the drop area
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false);
    
    // Handle file selection through the file input
    fileInput.addEventListener('change', handleFiles, false);
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight() {
        dropArea.classList.add('highlight');
    }
    
    function unhighlight() {
        dropArea.classList.remove('highlight');
        dropArea.classList.remove('error');
    }
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles({ target: { files: files } });
    }
    
    async function handleFiles(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Reset error state
        fileError.style.display = 'none';
        
        // Validate file type
        if (file.type !== 'application/pdf') {
            fileError.textContent = 'Please select a valid PDF file.';
            fileError.style.display = 'block';
            dropArea.classList.add('error');
            return;
        }
        
        // Display file info
        fileInfo.textContent = `Selected: ${file.name} (${formatFileSize(file.size)})`;
        fileInfo.style.display = 'block';
        
        // Show loading spinner
        const loadingSpinner = document.getElementById('loadingSpinner');
        loadingSpinner.style.display = 'block';
        
        try {
            // Read the file as an array buffer
            const arrayBuffer = await readFileAsArrayBuffer(file);
            
            // Initialize PDF viewer
            await initViewer(arrayBuffer, file.name);
            
            // Hide setup container and show viewer
            document.getElementById('setupContainer').style.display = 'none';
            document.getElementById('viewerContainer').style.display = 'flex';
            
        } catch (error) {
            fileError.textContent = 'Failed to load PDF: ' + error.message;
            fileError.style.display = 'block';
            dropArea.classList.add('error');
        } finally {
            loadingSpinner.style.display = 'none';
        }
    }
}

function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(new Error('Failed to read file'));
        reader.readAsArrayBuffer(file);
    });
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
}

async function initViewer(pdfData, fileName) {
    try {
        // Initialize PDF.js
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        // Load PDF
        const loadingTask = pdfjsLib.getDocument({ data: pdfData });
        pdfDoc = await loadingTask.promise;

        // Update UI
        document.getElementById('pdfFileName').textContent = fileName;
        document.getElementById('totalPages').textContent = pdfDoc.numPages;

        // Setup canvas
        canvas = document.getElementById('pdfCanvas');
        ctx = canvas.getContext('2d');

        // Clear chat history from previous sessions
        clearChat();

        // Render first page
        await renderPage(1);
        
        // Setup event listeners
        setupEventListeners();
        
        // Add system message
        addSystemMessage(`Loaded "${fileName}" with ${pdfDoc.numPages} pages`);
        
        // Update zoom level and fit to width
        // wait 2 seconds before fitting to width
        setTimeout(() => {
            fitToWidth();
        }, 200);

    } catch (error) {
        throw new Error('Failed to load PDF: ' + error.message);
    }
}

async function renderPage(pageNum) {
    if (!pdfDoc) return;

    try {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale });

        // Set canvas dimensions
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render the page
        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };

        await page.render(renderContext).promise;

        // Update UI
        currentPage = pageNum;
        document.getElementById('currentPage').textContent = pageNum;
        updateNavigationButtons();

        // Reset canvas position when changing pages
        canvasPosition = { x: 0, y: 0 };
        document.getElementById('canvasContainer').style.transform = 'translate(0px, 0px)';

    } catch (error) {
        showError('Failed to render page: ' + error.message);
    }
}

function setupEventListeners() {
    // Navigation
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            renderPage(currentPage - 1);
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        if (currentPage < pdfDoc.numPages) {
            renderPage(currentPage + 1);
        }
    });

    document.getElementById('navPrev').addEventListener('click', () => {
        if (currentPage > 1) {
            renderPage(currentPage - 1);
        }
    });

    document.getElementById('navNext').addEventListener('click', () => {
        if (currentPage < pdfDoc.numPages) {
            renderPage(currentPage + 1);
        }
    });

    // Zoom controls
    document.getElementById('zoomIn').addEventListener('click', () => {
        scale = Math.min(scale * 1.2, 3.0);
        renderPage(currentPage);
        updateZoomDisplay();
    });

    document.getElementById('zoomOut').addEventListener('click', () => {
        scale = Math.max(scale / 1.2, 0.25);
        renderPage(currentPage);
        updateZoomDisplay();
    });

    document.getElementById('fitToWidth').addEventListener('click', () => {
        fitToWidth();
    });

    // Analyze slide
    document.getElementById('analyzeSlide').addEventListener('click', () => {
        analyzeCurrentSlide();
    });

    document.getElementById('analyzeSlide2').addEventListener('click', () => {
        analyzeCurrentSlide();
    });

    // Chat functionality
    document.getElementById('sendMessage').addEventListener('click', sendChatMessage);
    document.getElementById('chatInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    });

    // Auto-resize textarea
    document.getElementById('chatInput').addEventListener('input', autoResizeTextarea);

    // Clear chat
    document.getElementById('clearChat').addEventListener('click', clearChat);

    // Back to setup
    document.getElementById('backToSetup').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    // Upload new PDF
    document.getElementById('uploadNew').addEventListener('click', () => {
        document.getElementById('viewerContainer').style.display = 'none';
        document.getElementById('setupContainer').style.display = 'flex';
        document.getElementById('fileInfo').style.display = 'none';
        document.getElementById('pdfUpload').value = '';
    });

    // Mouse wheel zoom
    document.getElementById('pdfViewer').addEventListener('wheel', (e) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
            scale = Math.max(0.25, Math.min(3.0, scale * zoomFactor));
            renderPage(currentPage);
            updateZoomDisplay();
        }
    });

    // Canvas dragging
    canvas.addEventListener('mousedown', startDrag);
    canvas.addEventListener('mousemove', drag);
    canvas.addEventListener('mouseup', endDrag);
    canvas.addEventListener('mouseleave', endDrag);

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeydown);
}

function updateNavigationButtons() {
    document.getElementById('prevPage').disabled = currentPage <= 1;
    document.getElementById('nextPage').disabled = currentPage >= pdfDoc.numPages;
    document.getElementById('navPrev').style.display = currentPage <= 1 ? 'none' : 'block';
    document.getElementById('navNext').style.display = currentPage >= pdfDoc.numPages ? 'none' : 'block';
}

function updateZoomDisplay() {
    document.getElementById('zoomLevel').textContent = Math.round(scale * 100) + '%';
}

function fitToWidth() {
    const viewerWidth = document.getElementById('pdfViewer').clientWidth;
    const canvasWidth = canvas.width / scale; // Get the natural width
    const newScale = (viewerWidth - 40) / canvasWidth; // 40px for padding
    scale = Math.max(0.25, Math.min(3.0, newScale));
    renderPage(currentPage);
    updateZoomDisplay();
}

// Canvas dragging functionality
function startDrag(e) {
    isDragging = true;
    dragStart.x = e.clientX - canvasPosition.x;
    dragStart.y = e.clientY - canvasPosition.y;
    canvas.style.cursor = 'grabbing';
}

function drag(e) {
    if (!isDragging) return;
    
    canvasPosition.x = e.clientX - dragStart.x;
    canvasPosition.y = e.clientY - dragStart.y;
    
    const container = document.getElementById('canvasContainer');
    container.style.transform = `translate(${canvasPosition.x}px, ${canvasPosition.y}px)`;
}

function endDrag() {
    isDragging = false;
    canvas.style.cursor = 'grab';
}

// Keyboard shortcuts
function handleKeydown(e) {
    // Don't handle keyboard shortcuts when in chat input
    if (document.activeElement === document.getElementById('chatInput')) {
        return;
    }
    
    switch(e.key) {
        case 'ArrowLeft':
            if (currentPage > 1) renderPage(currentPage - 1);
            break;
        case 'ArrowRight':
            if (currentPage < pdfDoc.numPages) renderPage(currentPage + 1);
            break;
        case 'Home':
            renderPage(1);
            break;
        case 'End':
            renderPage(pdfDoc.numPages);
            break;
        case '=':
        case '+':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                scale = Math.min(scale * 1.2, 3.0);
                renderPage(currentPage);
                updateZoomDisplay();
            }
            break;
        case '-':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                scale = Math.max(scale / 1.2, 0.25);
                renderPage(currentPage);
                updateZoomDisplay();
            }
            break;
    }
}

// Chat functionality
async function analyzeCurrentSlide() {
    if (isAnalyzing || !canvas) return;

    try {
        isAnalyzing = true;
        updateAnalyzeButton(true);

        // Convert canvas to base64
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        
        // Add user-like message
        addSystemMessage(`Analyzing page ${currentPage}...`);

        // Send to Gemini API
        const message = `Please analyze this slide (page ${currentPage}) and provide a clear explanation of its content, key points, and any important details.`;
        chatHistory.push({ role: 'user', content: message });
        
        await sendToGemini(message, imageData);

    } catch (error) {
        addErrorMessage('Failed to analyze slide: ' + error.message);
    } finally {
        isAnalyzing = false;
        updateAnalyzeButton(false);
    }
}

async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message || isAnalyzing) return;

    try {
        // Add user message
        addUserMessage(message);
        
        // Clear input and update UI
        input.value = '';
        input.focus();
        autoResizeTextarea();
        
        // Add to chat history
        chatHistory.push({ role: 'user', content: message });
        updateChatStats();
        
        // Get current slide as context
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        
        // Send to Gemini API
        await sendToGemini(message, imageData);
        
    } catch (error) {
        addErrorMessage('Failed to send message: ' + error.message);
    }
}

async function sendToGemini(message, imageData = null) {
    try {
        // Construct parts array with text and optionally image
        const parts = [{ text: message }];

        if (imageData) {
            // Strip the data URL prefix to get just the base64 data
            const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
            
            parts.push({
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: base64Data  // Just the base64 data without the prefix
                }
            });
        }

        // Construct the prompt to request a formatted response
        const systemPrompt = `You are a helpful assistant to help students prepare for exams. Users will ask
questions about slides in a pdf, or questions mostly about in the context of the provided images.
Elaborate on hard terms if they are complex or missing context.
IMPORTANT: Format your response as a JSON object with two properties: 'content' containing your actual response,
and 'type' which should be either 'text' for plain text or 'markdown' when you're using markdown
formatting with headings, lists, code blocks, or other formatting.
Use markdown formatting when possible.`;

        const requestBody = {
            contents: [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }]
                },
                {
                    role: "user",
                    parts: parts
                }
            ]
        };

        const typingIndicator = addTypingIndicator();

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        removeTypingIndicator(typingIndicator);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `Network error: ${response.status}`);
        }

        const data = await response.json();

        let reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
        
        // Try to parse the response as JSON
        let parsedReply;
        let contentType = 'text'; // Default to text
        
        try {
            let jsonString = extractJsonString(reply);
            parsedReply = JSON.parse(jsonString);
            if (parsedReply.content && parsedReply.type) {
                reply = parsedReply.content;
                contentType = parsedReply.type;
            }
        } catch (error) {
            // If not valid JSON, use the response as-is
            console.log('Response was not in expected JSON format, using raw response', error);
        }
        
        addAssistantMessage(reply, contentType);
        chatHistory.push({ role: 'assistant', content: reply, type: contentType });
        updateChatStats();

    } catch (error) {
        addErrorMessage('Failed to communicate with Gemini API: ' + error.message);
        console.error('Error details:', error);
    }
}  

function extractJsonString(str) {
    // Find the first occurrence of a JSON-like structure
    const jsonStart = str.indexOf('{');
    const jsonEnd = str.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        return str.substring(jsonStart, jsonEnd + 1);
    }
    return str; // Return the original string if no JSON-like structure is found
}

function addUserMessage(message) {
    const messageElement = createMessageElement('user', message);
    document.getElementById('chatMessages').appendChild(messageElement);
    scrollToBottom();
}

function addAssistantMessage(message, type = 'text') {
    const messageElement = createMessageElement('assistant', message, "markdown");
    document.getElementById('chatMessages').appendChild(messageElement);
    scrollToBottom();
}

function addSystemMessage(message) {
    const messageElement = createMessageElement('system', message);
    document.getElementById('chatMessages').appendChild(messageElement);
    scrollToBottom();
}

function addErrorMessage(message) {
    const messageElement = createMessageElement('error', message);
    document.getElementById('chatMessages').appendChild(messageElement);
    scrollToBottom();
}

// Add typing indicator to show AI is processing
function addTypingIndicator() {
    const typingElement = document.createElement('div');
    typingElement.className = 'message assistant typing';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const dots = document.createElement('div');
    dots.className = 'typing-dots';
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot';
        dots.appendChild(dot);
    }
    
    content.appendChild(dots);
    typingElement.appendChild(content);
    
    document.getElementById('chatMessages').appendChild(typingElement);
    scrollToBottom();
    
    return typingElement;
}

// Remove typing indicator when response is ready
function removeTypingIndicator(element) {
    element?.parentNode?.removeChild(element);
}

function createMessageElement(role, content, type = 'text') {
    const message = document.createElement('div');
    message.className = `message ${role}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    // Handle different content types
    if (type === 'markdown' && typeof marked !== 'undefined') {
        messageContent.innerHTML = marked.parse(content);
        message.classList.add('markdown');
    } else {
        messageContent.textContent = content;
    }
    
    message.appendChild(messageContent);

    if (role !== 'system' && role !== 'error') {
        const messageMeta = document.createElement('div');
        messageMeta.className = 'message-meta';
        
        // Add message type indicator if not basic text
        if (type !== 'text') {
            const typeIndicator = document.createElement('span');
            typeIndicator.className = 'message-type';
            typeIndicator.textContent = type;
            messageMeta.appendChild(typeIndicator);
        }
        
        const timeIndicator = document.createElement('span');
        timeIndicator.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        messageMeta.appendChild(timeIndicator);
        
        message.appendChild(messageMeta);
    }

    return message;
}

function clearChat() {
    document.getElementById('chatMessages').innerHTML = '';
    chatHistory = [];
    addSystemMessage('Chat cleared. You can start a new conversation.');
    updateChatStats();
}

function updateChatStats() {
    const stats = document.getElementById('chatStats');
    const userMessages = chatHistory.filter(msg => msg.role === 'user').length;
    const aiMessages = chatHistory.filter(msg => msg.role === 'assistant').length;
    stats.textContent = `Messages: ${userMessages} from you, ${aiMessages} from AI`;
}

function autoResizeTextarea() {
    const textarea = document.getElementById('chatInput');
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
}

function updateAnalyzeButton(disabled) {
    const analyzeBtn = document.getElementById('analyzeSlide');
    analyzeBtn.disabled = disabled;
    analyzeBtn.classList.toggle('disabled', disabled);
}

function showError(message) {
    addErrorMessage(message);
    console.error(message);
}

function scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}