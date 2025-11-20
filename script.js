// --- Configuration ---
const NANO_API = "https://tawsif.is-a.dev/gemini/nano-banana";
const GITHUB_USER = "Gtajisan";
// Fallback key for demo purposes. 
const DEFAULT_KEY = "031d6ef5e206206a51d427c9919a396d"; 

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
    // Developer Profile Elements
    devAvatar: document.getElementById('dev-avatar'),
    devName: document.getElementById('dev-name'),
    devBio: document.getElementById('dev-bio'),
    devLink: document.getElementById('dev-link')
};

// --- State ---
let state = {
    imageUrl: null,
    isUploading: false,
    isProcessing: false,
    apiKey: localStorage.getItem('nano_api_key') || ''
};

// --- Initialization ---
window.onload = () => {
    els.apiKeyInput.value = state.apiKey;
    fetchDevProfile(); // Load your GitHub info
};

// --- Developer Profile Fetcher ---
async function fetchDevProfile() {
    try {
        const res = await fetch(`https://api.github.com/users/${GITHUB_USER}`);
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();

        // Update UI with fetched data
        els.devAvatar.src = data.avatar_url;
        els.devName.innerText = data.name || data.login;
        els.devBio.innerText = data.bio || "Full Stack Developer";
        els.devLink.href = data.html_url;
    } catch (error) {
        console.log("Could not fetch GitHub info, using defaults.");
    }
}

// --- Upload Logic ---
function triggerUpload() {
    if(state.isProcessing || state.isUploading) return;
    els.fileInput.value = ''; 
    els.fileInput.click();
}

els.fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. Show Local Preview
    const localUrl = URL.createObjectURL(file);
    appendUserMessage("Uploading image...", localUrl);
    
    // 2. Show Context Bar (Loading State)
    showContextBar(localUrl, "Uploading to server...");
    
    state.isUploading = true;
    els.sendBtn.disabled = true;

    // 3. Upload to ImgBB
    try {
        const hostedUrl = await uploadToImgBB(file);
        
        // 4. Success
        state.imageUrl = hostedUrl;
        state.isUploading = false;
        
        updateContextStatus("Ready to edit. Type a prompt!");
        enableInput();
        appendBotMessage("✅ Image uploaded! Now tell me what to change.");

    } catch (error) {
        state.isUploading = false;
        hideContextBar();
        appendBotMessage(`❌ Upload Failed: ${error.message}`);
    }
});

async function uploadToImgBB(file) {
    const key = state.apiKey || DEFAULT_KEY;
    const formData = new FormData();
    formData.append("image", file);

    try {
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
            method: "POST",
            body: formData
        });
        const data = await res.json();
        
        if (data.success) return data.data.url;
        else throw new Error(data.error.message || "Upload error");
    } catch (err) {
        throw new Error("Network error or Invalid API Key.");
    }
}

// --- Editing Logic ---
async function sendMessage() {
    const text = els.input.value.trim();
    if (!text || state.isProcessing) return;
    
    // Safety check
    if (!state.imageUrl && !state.isUploading) {
        return alert("Please upload an image first!");
    }

    // UI Updates
    appendUserMessage(text);
    els.input.value = '';
    els.input.style.height = 'auto';
    disableInput();
    
    const loadId = showLoading();

    try {
        // Call Nano Banana API
        const apiUrl = `${NANO_API}?prompt=${encodeURIComponent(text)}&url=${encodeURIComponent(state.imageUrl)}`;
        
        const res = await fetch(apiUrl);
        const data = await res.json();

        removeLoading(loadId);

        if (data.imageUrl) {
            // Success
            appendBotMessage("Here is your edit:", data.imageUrl);
            
            // Update State for Chain Editing
            state.imageUrl = data.imageUrl;
            showContextBar(data.imageUrl, "Editing this new version...");
        } else {
            throw new Error("API did not return an image.");
        }

    } catch (err) {
        removeLoading(loadId);
        appendBotMessage("❌ Error: " + err.message);
    } finally {
        enableInput();
        els.input.focus();
    }
}

// --- UI Helper Functions ---

function showContextBar(imgSrc, statusText) {
    els.contextBar.classList.remove('hidden');
    setTimeout(() => els.contextBar.classList.add('slide-up'), 10);
    els.contextThumb.src = imgSrc;
    updateContextStatus(statusText);
}

function updateContextStatus(text) {
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
    appendBotMessage("Context cleared. Upload a new image.");
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

function appendUserMessage(text, imgUrl = null) {
    const div = document.createElement('div');
    div.className = "flex gap-3 flex-row-reverse fade-in";
    
    let content = "";
    if (imgUrl) content += `<img src="${imgUrl}" class="chat-img mb-2 border-yellow-500/30">`;
    if (text) content += `<span>${text}</span>`;

    div.innerHTML = `
        <div class="user-avatar shadow-sm"><i class="fa-solid fa-user"></i></div>
        <div class="user-bubble text-left">${content}</div>
    `;
    els.chat.appendChild(div);
    scrollToBottom();
}

function appendBotMessage(text, imgUrl = null) {
    const div = document.createElement('div');
    div.className = "flex gap-3 fade-in";
    
    let content = `<span>${text}</span>`;
    if (imgUrl) content += `<img src="${imgUrl}" class="chat-img mt-2 shadow-lg" onclick="window.open('${imgUrl}')">`;

    div.innerHTML = `
        <div class="bot-avatar shadow-sm">NB</div>
        <div class="bot-bubble">${content}</div>
    `;
    els.chat.appendChild(div);
    scrollToBottom();
}

function showLoading() {
    const id = 'load-' + Date.now();
    const div = document.createElement('div');
    div.id = id;
    div.className = "flex gap-3 fade-in";
    div.innerHTML = `
        <div class="bot-avatar">NB</div>
        <div class="bot-bubble flex items-center">
            <div class="typing-indicator">
                <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
            </div>
        </div>
    `;
    els.chat.appendChild(div);
    scrollToBottom();
    return id;
}

function removeLoading(id) {
    const el = document.getElementById(id);
    if(el) el.remove();
}

function toggleSettings() {
    els.settingsModal.classList.toggle('hidden');
}

function saveSettings() {
    const key = els.apiKeyInput.value.trim();
    if(key) {
        state.apiKey = key;
        localStorage.setItem('nano_api_key', key);
        alert("API Key Saved!");
        toggleSettings();
    }
}

function resetChat() {
    if(confirm("Clear all messages?")) {
        els.chat.innerHTML = '';
        cancelImage();
    }
}

function autoResize(el) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
}

function scrollToBottom() {
    els.chat.scrollTop = els.chat.scrollHeight;
}

// Send on Enter key
els.input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});
