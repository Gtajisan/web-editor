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
    isProcessing: false,
    apiKey: localStorage.getItem('nano_api_key') || ''
};

// --- Init ---
window.onload = () => {
    els.apiKeyInput.value = state.apiKey;
    fetchDevProfile();
};

// --- Logic ---
function triggerUpload() {
    if(state.isProcessing || state.isUploading) return;
    els.fileInput.value = ''; 
    els.fileInput.click();
}

els.fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // UI Update
    const localUrl = URL.createObjectURL(file);
    appendUserMessage("Uploading image...", localUrl);
    showContextBar(localUrl, "Uploading to server...");
    state.isUploading = true;
    els.sendBtn.disabled = true;

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
        
        // If it failed, suggest adding a key
        if(!state.apiKey) {
            setTimeout(() => {
                alert("Upload failed. Please add a free ImgBB API Key in Settings.");
                toggleSettings();
            }, 1000);
        }
    }
});

// --- Smart Upload Strategy ---
async function handleUploadStrategy(file) {
    // 1. If User has an API Key, use ImgBB (Most Reliable)
    if (state.apiKey) {
        return await uploadToImgBB(file, state.apiKey);
    } 
    // 2. If NO Key, try Catbox (Free, No Key needed) via Proxy
    else {
        try {
            return await uploadToCatbox(file);
        } catch (e) {
            throw new Error("Public upload failed. Please add an ImgBB Key in Settings.");
        }
    }
}

// Strategy A: ImgBB
async function uploadToImgBB(file, key) {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body: formData });
    const data = await res.json();
    if (data.success) return data.data.url;
    throw new Error(data.error?.message || "ImgBB Error");
}

// Strategy B: Catbox (Proxy)
async function uploadToCatbox(file) {
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('fileToUpload', file);
    
    // Using a CORS proxy to bypass browser restrictions on Catbox
    const proxy = "https://corsproxy.io/?"; 
    const target = "https://catbox.moe/user/api.php";
    
    const res = await fetch(proxy + encodeURIComponent(target), { method: 'POST', body: formData });
    const url = await res.text();
    
    if (url.includes("http")) return url.trim();
    throw new Error("Catbox Failed");
}

// --- Edit Logic ---
async function sendMessage() {
    const text = els.input.value.trim();
    if (!text || state.isProcessing) return;
    if (!state.imageUrl && !state.isUploading) return alert("Upload an image first!");

    appendUserMessage(text);
    els.input.value = '';
    els.input.style.height = 'auto'; // Reset height
    disableInput();
    
    const loadId = showLoading();

    try {
        const apiUrl = `${NANO_API}?prompt=${encodeURIComponent(text)}&url=${encodeURIComponent(state.imageUrl)}`;
        const res = await fetch(apiUrl);
        const data = await res.json();

        removeLoading(loadId);

        if (data.imageUrl) {
            appendBotMessage("Here is your edit:", data.imageUrl);
            state.imageUrl = data.imageUrl; // Chain edit
            showContextBar(data.imageUrl, "Editing this version...");
        } else {
            throw new Error("API returned no image.");
        }
    } catch (err) {
        removeLoading(loadId);
        appendBotMessage("❌ Error: " + err.message);
    } finally {
        enableInput();
        els.input.focus();
    }
}

// --- Helpers ---
async function fetchDevProfile() {
    try {
        const res = await fetch(`https://api.github.com/users/${GITHUB_USER}`);
        const data = await res.json();
        if(data.avatar_url) els.devAvatar.src = data.avatar_url;
        if(data.name) els.devName.innerText = data.name;
        if(data.html_url) els.devLink.href = data.html_url;
    } catch (e) {}
}

function showContextBar(imgSrc, text) {
    els.contextBar.classList.remove('hidden');
    setTimeout(() => els.contextBar.classList.add('slide-up'), 10);
    els.contextThumb.src = imgSrc;
    els.contextStatus.innerText = text;
}

function hideContextBar() {
    els.contextBar.classList.remove('slide-up');
    setTimeout(() => els.contextBar.classList.add('hidden'), 300);
    state.imageUrl = null;
}

function cancelImage() {
    hideContextBar();
    disableInput();
    els.input.placeholder = "Upload image first...";
    appendBotMessage("Context cleared.");
}

function enableInput() {
    state.isProcessing = false;
    els.input.disabled = false;
    els.input.placeholder = "Type your prompt...";
    els.sendBtn.disabled = false;
    els.sendBtn.classList.replace('bg-gray-700', 'bg-yellow-500');
    els.sendBtn.classList.replace('text-gray-500', 'text-black');
}

function disableInput() {
    state.isProcessing = true;
    els.input.disabled = true;
    els.sendBtn.disabled = true;
    els.sendBtn.classList.replace('bg-yellow-500', 'bg-gray-700');
    els.sendBtn.classList.replace('text-black', 'text-gray-500');
}

function appendUserMessage(text, imgUrl) {
    const div = document.createElement('div');
    div.className = "flex gap-3 flex-row-reverse fade-in";
    let content = imgUrl ? `<img src="${imgUrl}" class="chat-img mb-2 border-yellow-500/30">` : "";
    if(text) content += `<span>${text}</span>`;
    div.innerHTML = `<div class="user-avatar shadow-sm"><i class="fa-solid fa-user"></i></div><div class="user-bubble text-left">${content}</div>`;
    els.chat.appendChild(div);
    scrollToBottom();
}

function appendBotMessage(text, imgUrl) {
    const div = document.createElement('div');
    div.className = "flex gap-3 fade-in";
    let content = `<span>${text}</span>`;
    if(imgUrl) content += `<img src="${imgUrl}" class="chat-img mt-2 shadow-lg" onclick="window.open('${imgUrl}')">`;
    div.innerHTML = `<div class="bot-avatar shadow-sm">NB</div><div class="bot-bubble">${content}</div>`;
    els.chat.appendChild(div);
    scrollToBottom();
}

function showLoading() {
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
    const el = document.getElementById(id);
    if(el) el.remove();
}

function toggleSettings() { els.settingsModal.classList.toggle('hidden'); }
function saveSettings() {
    const key = els.apiKeyInput.value.trim();
    if(key) { state.apiKey = key; localStorage.setItem('nano_api_key', key); alert("Key Saved!"); toggleSettings(); }
}
function resetChat() { if(confirm("Clear chat?")) { els.chat.innerHTML = ''; cancelImage(); } }
function autoResize(el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; }
function scrollToBottom() { els.chat.scrollTop = els.chat.scrollHeight; }
els.input.addEventListener('keypress', (e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }});
