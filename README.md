# Nano Banana AI Editor 

![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20GitHub%20Pages-orange)
![License](https://img.shields.io/badge/License-MIT-blue)
![Developer](https://img.shields.io/badge/Developer-Gtajisan-green)

A smart, messenger-style AI image editor that allows you to edit photos using natural language prompts. Built purely with HTML, CSS, and JavaScript, designed for seamless deployment on **GitHub Pages**.

## ✨ Features

- **💬 Chat-Bot Interface:** Familiar messenger UI (User vs AI).
- **🖼️ Image Editing:** Upload an image and reply with a text prompt (e.g., *"add sunglasses"*, *"change background to space"*).
- **🔗 Chain Editing:** Automatically set the context to the *new* image, allowing you to refine edits continuously.
- **☁️ Serverless Uploads:** Integrated with **ImgBB** to host images for the AI API (No backend required).
- **👤 Smart Developer Profile:** Automatically fetches the developer's (@Gtajisan) photo and bio from the GitHub API.
- **📱 Mobile Responsive:** Fully optimized for mobile devices with safe-area handling.

## 🚀 Live Demo

*(Once you deploy, put your link here, e.g., https://Gtajisan.github.io/nano-banana)*

## 🛠️ Installation & Deployment

This project is static and requires **no server**. You can host it for free on GitHub Pages.

### Step 1: Create Repository
1. Go to [GitHub](https://github.com) and create a new repository (e.g., `nano-banana-web`).

### Step 2: Upload Files
Upload the following 3 files to the `main` branch:
- `index.html`
- `style.css`
- `script.js`

### Step 3: Enable GitHub Pages
1. Go to your repository **Settings**.
2. Click on **Pages** (in the left sidebar).
3. Under **Build and deployment** > **Branch**, select `main` (or `master`) and click **Save**.
4. Wait about 1 minute. GitHub will provide your live website URL.

## ⚙️ Configuration (API Keys)

The application uses a fallback key for image uploads, but for better performance and privacy, users can add their own **ImgBB API Key**.

1. Go to [api.imgbb.com](https://api.imgbb.com/) and get a free API Key.
2. Open your deployed website.
3. Click the **Settings (⚙️)** icon in the top right.
4. Paste your key and click **Save**.
   * *The key is stored securely in your browser's LocalStorage.*

## 📖 How to Use

1. **Upload:** Click the Image Icon <i class="fa-solid fa-image"></i> to select a photo.
2. **Wait:** A "Context Bar" will appear above the input showing *"Editing Active"*.
3. **Prompt:** Type your edit instruction (e.g., *"Make him smile"*).
4. **Result:** The AI will generate the edited image.
5. **Refine:** You can immediately type another prompt to edit the *result* further.

## 👨‍💻 Author

**Gtajisan**

- **GitHub:** [@Gtajisan](https://github.com/Gtajisan)
- **Email:** [ffjisan804@gmail.com](mailto:ffjisan804@gmail.com)

## 🤝 Credits

- **AI API:** Nano Banana API (Tawsif)
- **Icons:** FontAwesome
- **Styling:** Tailwind CSS

## 📜 License

This project is open source and available under the [MIT License](LICENSE)..
