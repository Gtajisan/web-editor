// --- Configuration ---
const NANO_API = "https://tawsif.is-a.dev/gemini/nano-banana";
const GITHUB_USER = "Gtajisan";
const API_TIMEOUT = 60000; // 60 second timeout
const CORS_PROXY = "https://corsproxy.io/?";

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

        const localUrl = URL.createObjectURL(file);
        appendUserMessage("Uploading image...", localUrl);
        showContextBar(localUrl, "Processing image...");
        state.isUploading = true;
        if (els.sendBtn) els.sendBtn.disabled = true;

        try {
            const hostedUrl = await uploadImage(file);
            state.imageUrl = hostedUrl;
            state.isUploading = false;
            updateContextStatus("Ready. Type your edit prompt.");
            enableInput();
            appendBotMessage("✅ Image ready! What should I change?");
        } catch (error) {
            state.isUploading = false;
            hideContextBar();
            appendBotMessage(`❌ Upload Error: ${error.message}\n\nTry uploading a different image.`);
        }
    });
}

// --- Upload Image to Free Service ---
async function uploadImage(file) {
    const strategies = [
        { name: 'Catbox', fn: uploadToCatbox },
        { name: 'Data URL', fn: uploadAsDataURL }
    ];

    for (let strategy of strategies) {
        try {
            console.log(`📤 Trying ${strategy.name}...`);
            const url = await strategy.fn(file);
            if (url && url.includes('http')) {
                console.log(`✅ Uploaded via ${strategy.name}`);
                return url.trim();
            }
        } catch (e) {
            console.log(`⚠️ ${strategy.name} failed:`, e.message);
        }
    }

    throw new Error("All upload methods failed");
}

// Method 1: Catbox
async function uploadToCatbox(file) {
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('fileToUpload', file);
    
    const res = await fetch('https://catbox.moe/user/api.php', { 
        method: 'POST', 
        body: formData
    });
    
    const url = await res.text();
    if (!url.includes('http')) throw new Error('Invalid response');
    return url;
}

// Method 2: Data URL (works locally, wrap for API)
async function uploadAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
    });
}

// --- Send Edit Request to API ---
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
        
        // Prepare image URL for API
        let imageUrlForAPI = state.imageUrl;
        if (imageUrlForAPI.startsWith('data:')) {
            imageUrlForAPI = CORS_PROXY + encodeURIComponent(imageUrlForAPI);
        }
        
        const apiUrl = `${NANO_API}?prompt=${encodeURIComponent(text)}&url=${encodeURIComponent(imageUrlForAPI)}`;
        
        console.log('🔄 Sending to API...', { prompt: text, imageUrl: imageUrlForAPI.substring(0, 50) + '...' });
        
        const res = await fetch(apiUrl, {
            method: 'GET',
            signal: controller.signal,
            headers: { 'Accept': 'application/json' }
        });
        
        clearTimeout(timeoutId);
        
        if (!res.ok) throw new Error(`API error ${res.status}`);
        
        const data = await res.json();
        removeLoading(loadId);

        if (data.imageUrl && data.imageUrl.includes('http')) {
            console.log('✅ Got result from API');
            appendBotMessage("✨ Here's your edited image:", data.imageUrl);
            state.imageUrl = data.imageUrl;
            showContextBar(data.imageUrl, "Keep editing? Click image or type new prompt");
        } else if (data.error) {
            throw new Error(data.error);
        } else {
            throw new Error("No image returned from API");
        }
    } catch (err) {
        removeLoading(loadId);
        
        let errorMsg = err.message;
        if (err.name === 'AbortError') {
            errorMsg = "⏱️ API took too long (timeout)";
        }
        
        console.error('❌ Error:', err);
        appendBotMessage(`${errorMsg}\n\nMake sure: 1) Image uploaded 2) API is reachable 3) Try a different prompt`);
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
    } catch (e) {}
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
    appendBotMessage("✋ Cancelled. Upload a new image to start.");
}

function enableInput() {
    state.isProcessing = false;
    if (els.input) {
        els.input.disabled = false;
        els.input.placeholder = "What should I change?";
    }
    if (els.sendBtn) {
        els.sendBtn.disabled = false;
        els.sendBtn.classList.add('bg-yellow-500', 'text-black');
        els.sendBtn.classList.remove('bg-gray-700', 'text-gray-500');
    }
}

function disableInput() {
    state.isProcessing = true;
    if (els.input) els.input.disabled = true;
    if (els.sendBtn) {
        els.sendBtn.disabled = true;
        els.sendBtn.classList.add('bg-gray-700', 'text-gray-500');
        els.sendBtn.classList.remove('bg-yellow-500', 'text-black');
    }
}

function appendUserMessage(text, imgUrl) {
    if (!els.chat) return;
    const div = document.createElement('div');
    div.className = "flex gap-3 flex-row-reverse fade-in";
    let content = imgUrl ? `<img src="${imgUrl}" class="chat-img mb-2 border-yellow-500/30 rounded-lg" alt="Your image">` : "";
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
        content += `<img src="${imgUrl}" class="chat-img mt-2 shadow-lg rounded-lg cursor-pointer hover:opacity-90 transition" alt="Result" title="Click to edit">`;
    }
    div.innerHTML = `<div class="bot-avatar shadow-sm">NB</div><div class="bot-bubble">${content}</div>`;
    els.chat.appendChild(div);
    
    if(imgUrl) {
        const img = div.querySelector('img');
        if(img) {
            img.addEventListener('click', () => {
                state.imageUrl = imgUrl;
                showContextBar(imgUrl, "Ready for new prompt");
                if(els.input) els.input.focus();
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
    alert("✅ No API keys needed - Direct upload enabled!");
    toggleSettings();
}

function resetChat() { 
    if(confirm("Clear all chat and reset?")) { 
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
        setTimeout(() => {
            els.chat.scrollTop = els.chat.scrollHeight;
        }, 0);
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
