// --- Configuration ---
const NANO_API = "https://tawsif.is-a.dev/gemini/nano-banana";
const GITHUB_USER = "Gtajisan";
const API_TIMEOUT = 30000; // 30 second timeout

// --- DOM Elements ---
const els = {
    chat: document.getElementById('chat-container'),
    input: document.getElementById('user-input'),
    sendBtn: document.getElementById('send-btn'),
    fileInput: document.getElementById('file-upload'),
    contextBar: document.getElementById('context-bar'),
    contextThumb: document.getElementById('context-thumb'),
    contextStatus: document.getElementById('context-status'),
    settingsModal: document.getElementById('settings-modal'),
    apiKeyInput: document.getElementById('api-key-input'),
    devAvatar: document.getElementById('dev-avatar'),
    devName: document.getElementById('dev-name'),
    devLink: document.getElementById('dev-link')
};

// --- State ---
let state = {
    imageUrl: null,
    isUploading: false,
    isProcessing: false
};

// --- Init ---
window.addEventListener('load', () => {
    fetchDevProfile();
    // Disable send button initially
    if (els.sendBtn) els.sendBtn.disabled = true;
});

// --- Logic ---
function triggerUpload() {
    if(state.isProcessing || state.isUploading) return;
    if (els.fileInput) {
        els.fileInput.value = ''; 
        els.fileInput.click();
    }
}

if (els.fileInput) {
    els.fileInput.addEventListener('change', async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // UI Update
        const localUrl = URL.createObjectURL(file);
        appendUserMessage("Uploading image...", localUrl);
        showContextBar(localUrl, "Uploading to server...");
        state.isUploading = true;
        if (els.sendBtn) els.sendBtn.disabled = true;

        try {
            // Try to upload (checks for API Key, falls back to free host if none)
            const hostedUrl = await handleUploadStrategy(file);
            
            // Success
            state.imageUrl = hostedUrl;
            state.isUploading = false;
            updateContextStatus("Ready. Type your edit prompt.");
            enableInput();
            appendBotMessage("✅ Image received! What should I change?");

        } catch (error) {
            state.isUploading = false;
            hideContextBar();
            appendBotMessage(`❌ Upload Failed: ${error.message}`);
        }
    });
}

// --- Smart Upload Strategy ---
async function handleUploadStrategy(file) {
    try {
        // Try free hosting services (no API key needed)
        return await uploadToFreeService(file);
    } catch (e) {
        // Fallback: data URL for preview only (note: API won't accept this)
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsDataURL(file);
        });
    }
}

// Free image hosting (no API key needed)
async function uploadToFreeService(file) {
    // Strategy 1: Try 0x0.st (completely free, no limits)
    try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('https://0x0.st', { method: 'POST', body: formData });
        const url = await res.text();
        if (url.includes('http')) return url.trim();
    } catch (e) {}
    
    // Strategy 2: Try Catbox via CORS
    try {
        const formData = new FormData();
        formData.append('reqtype', 'fileupload');
        formData.append('fileToUpload', file);
        
        const res = await fetch('https://catbox.moe/user/api.php', { 
            method: 'POST', 
            body: formData,
            mode: 'cors'
        });
        const url = await res.text();
        if (url.includes('http')) return url.trim();
    } catch (e) {}
    
    // Strategy 3: Try PostImages (free, no key)
    try {
        const formData = new FormData();
        formData.append('upload', file);
        formData.append('type', 'file');
        
        const res = await fetch('https://postimages.org/api/1/upload', { 
            method: 'POST', 
            body: formData 
        });
        const data = await res.json();
        if (data.status === 200 && data.image?.url) {
            return data.image.url;
        }
    } catch (e) {}
    
    throw new Error("Could not upload to any free service");
}

// --- Edit Logic ---
async function sendMessage() {
    const text = els.input?.value.trim();
    if (!text || state.isProcessing) return;
    if (!state.imageUrl && !state.isUploading) return alert("Upload an image first!");

    appendUserMessage(text);
    if (els.input) {
        els.input.value = '';
        els.input.style.height = 'auto';
    }
    disableInput();
    
    const loadId = showLoading();

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
        
        const apiUrl = `${NANO_API}?prompt=${encodeURIComponent(text)}&url=${encodeURIComponent(state.imageUrl)}`;
        
        const res = await fetch(apiUrl, {
            method: 'GET',
            signal: controller.signal,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        clearTimeout(timeoutId);
        
        if (!res.ok) throw new Error(`API returned status ${res.status}`);
        
        const data = await res.json();
        removeLoading(loadId);

        if (data.imageUrl) {
            appendBotMessage("Here is your edit:", data.imageUrl);
            state.imageUrl = data.imageUrl;
            showContextBar(data.imageUrl, "Editing this version...");
        } else if (data.error) {
            throw new Error(data.error);
        } else {
            throw new Error("API returned invalid response");
        }
    } catch (err) {
        removeLoading(loadId);
        
        let errorMsg = err.message;
        if (err.name === 'AbortError') {
            errorMsg = "Request timeout - API took too long to respond";
        } else if (errorMsg.includes('fetch')) {
            errorMsg = "Network error - Check API connection";
        }
        
        appendBotMessage(`⚠️ ${errorMsg}\n\n📝 Tip: Make sure the API endpoint is accessible.`);
    } finally {
        enableInput();
        if (els.input) els.input.focus();
    }
}

// --- Helpers ---
async function fetchDevProfile() {
    try {
        const res = await fetch(`https://api.github.com/users/${GITHUB_USER}`);
        const data = await res.json();
        if(data.avatar_url && els.devAvatar) els.devAvatar.src = data.avatar_url;
        if(data.name && els.devName) els.devName.innerText = data.name;
        if(data.html_url && els.devLink) els.devLink.href = data.html_url;
    } catch (e) {
        console.debug("Could not fetch dev profile:", e);
    }
}

function showContextBar(imgSrc, text) {
    if (!els.contextBar) return;
    els.contextBar.classList.remove('hidden');
    setTimeout(() => els.contextBar.classList.add('slide-up'), 10);
    if (els.contextThumb) els.contextThumb.src = imgSrc;
    updateContextStatus(text);
}

function updateContextStatus(text) {
    if (els.contextStatus) els.contextStatus.innerText = text;
}

function hideContextBar() {
    if (!els.contextBar) return;
    els.contextBar.classList.remove('slide-up');
    setTimeout(() => els.contextBar.classList.add('hidden'), 300);
    state.imageUrl = null;
}

function cancelImage() {
    hideContextBar();
    disableInput();
    if (els.input) els.input.placeholder = "Upload image first...";
    appendBotMessage("Context cleared.");
}

function enableInput() {
    state.isProcessing = false;
    if (els.input) {
        els.input.disabled = false;
        els.input.placeholder = "Type your prompt...";
    }
    if (els.sendBtn) {
        els.sendBtn.disabled = false;
        els.sendBtn.classList.replace('bg-gray-700', 'bg-yellow-500');
        els.sendBtn.classList.replace('text-gray-500', 'text-black');
    }
}

function disableInput() {
    state.isProcessing = true;
    if (els.input) els.input.disabled = true;
    if (els.sendBtn) {
        els.sendBtn.disabled = true;
        els.sendBtn.classList.replace('bg-yellow-500', 'bg-gray-700');
        els.sendBtn.classList.replace('text-black', 'text-gray-500');
    }
}

function appendUserMessage(text, imgUrl) {
    if (!els.chat) return;
    const div = document.createElement('div');
    div.className = "flex gap-3 flex-row-reverse fade-in";
    let content = imgUrl ? `<img src="${imgUrl}" class="chat-img mb-2 border-yellow-500/30" alt="Uploaded image">` : "";
    if(text) content += `<span>${text}</span>`;
    div.innerHTML = `<div class="user-avatar shadow-sm"><i class="fa-solid fa-user"></i></div><div class="user-bubble text-left">${content}</div>`;
    els.chat.appendChild(div);
    scrollToBottom();
}

function appendBotMessage(text, imgUrl) {
    if (!els.chat) return;
    const div = document.createElement('div');
    div.className = "flex gap-3 fade-in";
    let content = `<span>${text}</span>`;
    if(imgUrl) {
        content += `<img src="${imgUrl}" class="chat-img mt-2 shadow-lg cursor-pointer hover:opacity-80 transition" alt="Edited image" title="Click to edit this image">`;
    }
    div.innerHTML = `<div class="bot-avatar shadow-sm">NB</div><div class="bot-bubble">${content}</div>`;
    els.chat.appendChild(div);
    
    // Add click handler to image for editing
    if(imgUrl) {
        const img = div.querySelector('img');
        if(img) {
            img.addEventListener('click', (e) => {
                // Set context and focus input
                state.imageUrl = imgUrl;
                showContextBar(imgUrl, "Click input to edit this image");
                if(els.input) {
                    els.input.focus();
                    els.input.placeholder = "Describe what you want to change...";
                }
            });
        }
    }
    
    scrollToBottom();
}

function showLoading() {
    if (!els.chat) return null;
    const id = 'load-' + Date.now();
    const div = document.createElement('div');
    div.id = id;
    div.className = "flex gap-3 fade-in";
    div.innerHTML = `<div class="bot-avatar">NB</div><div class="bot-bubble flex items-center"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;
    els.chat.appendChild(div);
    scrollToBottom();
    return id;
}

function removeLoading(id) {
    if (!id) return;
    const el = document.getElementById(id);
    if(el) el.remove();
}

function toggleSettings() { 
    if (els.settingsModal) els.settingsModal.classList.toggle('hidden'); 
}

function saveSettings() {
    alert("No API keys needed! Direct upload is enabled.");
    toggleSettings();
}

function resetChat() { 
    if(confirm("Clear chat?")) { 
        if (els.chat) els.chat.innerHTML = '';
        cancelImage(); 
    } 
}

function autoResize(el) { 
    if (!el) return;
    el.style.height = 'auto'; 
    el.style.height = Math.min(el.scrollHeight, 100) + 'px'; 
}

function scrollToBottom() { 
    if (els.chat) {
        els.chat.scrollTop = els.chat.scrollHeight; 
    }
}

if (els.input) {
    els.input.addEventListener('keypress', (e) => { 
        if(e.key === 'Enter' && !e.shiftKey) { 
            e.preventDefault(); 
            sendMessage(); 
        }
    });
}
