// --- Configuration ---
const NANO_API = "https://tawsif.is-a.dev/gemini/nano-banana";
const GITHUB_USER = "Gtajisan";

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

// --- Smart Upload Strategy (No ImgBB Required) ---
async function handleUploadStrategy(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            resolve(dataUrl);
        };
        
        reader.onerror = () => {
            reject(new Error("Failed to read file"));
        };
        
        reader.readAsDataURL(file);
    });
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
        const apiUrl = `${NANO_API}?prompt=${encodeURIComponent(text)}&url=${encodeURIComponent(state.imageUrl)}`;
        const res = await fetch(apiUrl);
        
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        
        const data = await res.json();
        removeLoading(loadId);

        if (data.imageUrl) {
            appendBotMessage("Here is your edit:", data.imageUrl);
            state.imageUrl = data.imageUrl; // Chain edit
            showContextBar(data.imageUrl, "Editing this version...");
        } else if (data.error) {
            throw new Error(data.error);
        } else {
            throw new Error("API returned no image.");
        }
    } catch (err) {
        removeLoading(loadId);
        appendBotMessage("❌ Error: " + (err.message || "Unknown error occurred"));
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
    if(imgUrl) content += `<img src="${imgUrl}" class="chat-img mt-2 shadow-lg" alt="Edited image" onclick="window.open('${imgUrl}')">`;
    div.innerHTML = `<div class="bot-avatar shadow-sm">NB</div><div class="bot-bubble">${content}</div>`;
    els.chat.appendChild(div);
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
