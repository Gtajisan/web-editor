// --- Configuration ---
const NANO_API = "https://tawsif.is-a.dev/gemini/nano-banana";
const PHOTOROOM_API = "https://sandbox-api.photoroom.com/v2/edit";
const GITHUB_USER = "Gtajisan";

// --- State ---
let state = {
    imageUrl: null,
    isUploading: false,
    isProcessing: false,
    backend: 'nano', // 'nano' or 'photoroom'
    searchSource: null, // 'unsplash' or 'pexels'
    unsplashKey: localStorage.getItem('unsplash-key') || '',
    pexelsKey: localStorage.getItem('pexels-key') || ''
};

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
    searchModal: document.getElementById('search-modal'),
    backendSelect: document.getElementById('backend-select'),
    backendLabel: document.getElementById('backend-label'),
    devAvatar: document.getElementById('dev-avatar'),
    devName: document.getElementById('dev-name'),
    devLink: document.getElementById('dev-link'),
    unsplashKeyInput: document.getElementById('unsplash-key'),
    pexelsKeyInput: document.getElementById('pexels-key'),
    searchQuery: document.getElementById('search-query'),
    searchResults: document.getElementById('search-results')
};

// --- Init ---
window.addEventListener('load', () => {
    fetchDevProfile();
    if (els.sendBtn) els.sendBtn.disabled = true;
    if (els.backendSelect) els.backendSelect.value = state.backend;
    if (els.unsplashKeyInput) els.unsplashKeyInput.value = state.unsplashKey;
    if (els.pexelsKeyInput) els.pexelsKeyInput.value = state.pexelsKey;
});

// --- Upload Logic ---
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
        showContextBar(localUrl, "Processing...");
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

// --- Image Upload ---
async function uploadImage(file) {
    const strategies = [
        { name: 'ImgBB', fn: uploadToImgBB },
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

async function uploadToImgBB(file) {
    const apiKey = 'aa2a423da6c305e01ae06044d37d9648';
    const formData = new FormData();
    formData.append('image', file);
    
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData
    });
    
    const data = await res.json();
    if (data.success && data.data?.url) return data.data.url;
    throw new Error(data.error?.message || 'ImgBB failed');
}

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

async function uploadAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
    });
}

// --- Send Message with Backend Routing ---
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
        let result;
        
        if (state.backend === 'photoroom') {
            result = await editWithPhotoroom(text);
        } else {
            result = await editWithNanoBanana(text);
        }
        
        removeLoading(loadId);
        appendBotMessage("✨ Here's your edited image:", result);
        state.imageUrl = result;
        showContextBar(result, "Keep editing? Click image or type new prompt");
        
    } catch (err) {
        removeLoading(loadId);
        
        let errorMsg = err.message;
        if (err.name === 'AbortError') {
            errorMsg = "⏱️ API timeout\n\n💡 Try: simpler prompt, wait & retry";
        }
        
        console.error('❌ Error:', err);
        appendBotMessage(`⚠️ ${errorMsg}`);
    } finally {
        enableInput();
        if (els.input) els.input.focus();
    }
}

// --- Nano Banana Backend ---
async function editWithNanoBanana(prompt) {
    const imageUrlForAPI = state.imageUrl;
    if (!imageUrlForAPI.startsWith('http')) {
        throw new Error("Image URL not accessible. Please re-upload.");
    }
    
    const apiUrl = `${NANO_API}?prompt=${encodeURIComponent(prompt)}&url=${encodeURIComponent(imageUrlForAPI)}`;
    
    console.log('🔄 Nano Banana: Sending request...');
    
    let lastError = null;
    for (let attempt = 1; attempt <= 2; attempt++) {
        try {
            if (attempt > 1) {
                console.log(`🔁 Retry ${attempt}/2...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 90000);
            
            const res = await fetch(apiUrl, {
                method: 'GET',
                signal: controller.signal,
                headers: { 'Accept': 'application/json' }
            });
            
            clearTimeout(timeoutId);
            
            const data = await res.json();
            console.log('📦 Response:', data);

            if (data.imageUrl && data.imageUrl.includes('http')) {
                console.log('✅ Nano Banana success');
                return data.imageUrl;
            } else if (data.error) {
                throw new Error(`API Error: ${data.error}`);
            } else {
                throw new Error("No image URL returned");
            }
        } catch (err) {
            lastError = err;
            if (attempt === 2 || err.name !== 'AbortError') throw err;
        }
    }
    
    throw lastError;
}

// --- Photoroom Backend ---
async function editWithPhotoroom(prompt) {
    const imageUrlForAPI = state.imageUrl;
    if (!imageUrlForAPI.startsWith('http')) {
        throw new Error("Image URL not accessible. Please re-upload.");
    }
    
    console.log('🔄 Photoroom: Sending request...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    try {
        const res = await fetch(PHOTOROOM_API, {
            method: 'POST',
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'sandbox_key_unlimited'
            },
            body: JSON.stringify({
                image_url: imageUrlForAPI,
                instructions: prompt
            })
        });
        
        clearTimeout(timeoutId);
        
        const data = await res.json();
        console.log('📦 Photoroom Response:', data);
        
        if (data.image_url) {
            console.log('✅ Photoroom success');
            return data.image_url;
        } else if (data.error) {
            throw new Error(`Photoroom: ${data.error.message || data.error}`);
        } else {
            throw new Error("Invalid Photoroom response");
        }
    } catch (err) {
        clearTimeout(timeoutId);
        throw err;
    }
}

// --- Settings & Backend ---
function setBackend(backend) {
    state.backend = backend;
    console.log(`🔧 Backend switched to: ${backend}`);
    if (els.backendLabel) {
        els.backendLabel.textContent = backend === 'photoroom' ? 'Photoroom AI' : 'Nano Banana';
    }
}

function toggleSettings() {
    if (els.settingsModal) els.settingsModal.classList.toggle('hidden');
}

function saveSettings() {
    state.unsplashKey = els.unsplashKeyInput?.value || '';
    state.pexelsKey = els.pexelsKeyInput?.value || '';
    localStorage.setItem('unsplash-key', state.unsplashKey);
    localStorage.setItem('pexels-key', state.pexelsKey);
    appendBotMessage("✅ Settings saved!");
    toggleSettings();
}

// --- Stock Photo Search ---
function searchUnsplash() {
    state.searchSource = 'unsplash';
    openSearchModal();
}

function searchPexels() {
    state.searchSource = 'pexels';
    openSearchModal();
}

function openSearchModal() {
    if (els.searchModal) {
        els.searchModal.classList.remove('hidden');
        if (els.searchQuery) els.searchQuery.focus();
    }
}

function closeSearchModal() {
    if (els.searchModal) els.searchModal.classList.add('hidden');
}

async function executeSearch() {
    const query = els.searchQuery?.value.trim();
    if (!query) return;
    
    console.log(`🔍 Searching ${state.searchSource} for: ${query}`);
    
    try {
        let results = [];
        
        if (state.searchSource === 'unsplash') {
            results = await searchUnsplashPhotos(query);
        } else if (state.searchSource === 'pexels') {
            results = await searchPexelsPhotos(query);
        }
        
        displaySearchResults(results);
    } catch (err) {
        appendBotMessage(`❌ Search failed: ${err.message}`);
        closeSearchModal();
    }
}

async function searchUnsplashPhotos(query) {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=9&client_id=GZvUKMVXGxQBOPZoLMKKtfPQHU-B7wFVnhPr_wBq5NI`;
    
    const res = await fetch(url);
    const data = await res.json();
    
    return data.results?.map(photo => ({
        url: photo.urls.regular,
        thumb: photo.urls.small,
        source: 'Unsplash'
    })) || [];
}

async function searchPexelsPhotos(query) {
    const key = state.pexelsKey || 'PpZrUKqHzN1vSqDKH8Z9PZbV5qQkxQZQq5fVhXvYqq'; // Fallback public key
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=9`;
    
    const res = await fetch(url, {
        headers: { 'Authorization': key }
    });
    const data = await res.json();
    
    return data.photos?.map(photo => ({
        url: photo.src.large,
        thumb: photo.src.medium,
        source: 'Pexels'
    })) || [];
}

function displaySearchResults(results) {
    if (!els.searchResults) return;
    els.searchResults.innerHTML = results.map((photo, idx) => `
        <button onclick="selectSearchResult('${photo.url}')" class="relative group overflow-hidden rounded-lg border border-gray-600 hover:border-yellow-500 transition">
            <img src="${photo.thumb}" class="w-full h-24 object-cover group-hover:scale-110 transition">
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">
                <i class="fa-solid fa-check text-yellow-500 text-xl opacity-0 group-hover:opacity-100 transition"></i>
            </div>
        </button>
    `).join('');
}

function selectSearchResult(imageUrl) {
    state.imageUrl = imageUrl;
    closeSearchModal();
    showContextBar(imageUrl, "Ready. Type your edit prompt.");
    updateContextStatus("Ready. Type your edit prompt.");
    enableInput();
    appendBotMessage("✅ Image selected! What should I change?");
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

// Close search modal on escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !els.searchModal?.classList.contains('hidden')) {
        closeSearchModal();
    }
});
