"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type Language = "en" | "bn" | "ja" | "vi" | "hi"

export const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
]

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    home: "Home",
    docs: "Documentation",
    playground: "Playground",
    models: "Models",
    pricing: "Pricing",
    about: "About",
    contact: "Contact",
    apiDocs: "API Docs",
    startBuilding: "Start Building",

    // Hero
    heroTitle: "The fastest and most powerful platform for building AI products",
    heroSubtitle:
      "Build transformative AI experiences powered by industry-leading models and tools. No API keys required, no configuration needed.",
    getStarted: "Get Started",
    viewDocs: "View Documentation",
    viewDocumentation: "View Documentation",

    // Features
    featuresTitle: "Iterate quickly while building your product",
    featuresSubtitle: "Everything you need to build AI-powered applications, with zero configuration.",
    unifiedProvider: "Unified Provider API",
    unifiedProviderDesc: "Switch between AI providers by changing a single line of code. No complex configurations needed.",
    simpleRest: "Simple REST API",
    simpleRestDesc: "Easy-to-use REST endpoints that work with any programming language or framework.",
    noApiKeys: "No API Keys Required",
    noApiKeysDesc: "Get started immediately without managing API keys or authentication tokens.",
    openSource: "Open Source",
    openSourceDesc: "Fully open-source platform. Inspect the code, contribute, and deploy your own instance.",

    // Models
    modelsTitle: "Flagship Models",
    modelsSubtitle: "Powerful general purpose models for a variety of real-world tasks.",
    recommended: "Recommended",
    fast: "Fast",
    popular: "Popular",
    images: "Images",
    new: "New",

    // Chat
    chat: "Chat",
    imageGeneration: "Image Generation",
    sendMessage: "Send a message",
    typeMessage: "Type your message...",
    generating: "Generating...",
    newChat: "New Chat",
    chatHistory: "Chat History",
    clearHistory: "Clear History",
    welcomeTitle: "Welcome to Anbu AI",
    welcomeDesc: "Start a conversation with our AI assistant. Ask questions, get help with code, or explore ideas.",

    // Image
    prompt: "Prompt",
    style: "Style",
    size: "Size",
    generate: "Generate",
    download: "Download",
    share: "Share",
    regenerate: "Regenerate",
    gallery: "Gallery",
    imagePromptPlaceholder: "Describe the image you want to generate...",

    // Actions
    copy: "Copy",
    copied: "Copied!",
    edit: "Edit",
    delete: "Delete",
    selectAll: "Select All",

    // Footer
    openSourceAI: "Open-source AI platform",
    followUs: "Follow Us",
    quickLinks: "Quick Links",
    resources: "Resources",
    legal: "Legal",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    madeWith: "Made with",
    by: "by",
    allRightsReserved: "All rights reserved.",

    // Telegram popup
    joinTelegram: "Join Our Telegram",
    joinTelegramDesc: "Get updates, support, and connect with the community!",
    joinNow: "Join Now",
    maybeLater: "Maybe Later",

    // Toast messages
    messageCopied: "Message copied to clipboard",
    imageDownloaded: "Image downloaded successfully",
    sessionReset: "Session has been reset",
    errorOccurred: "An error occurred",
  },
  bn: {
    home: "হোম",
    docs: "ডকুমেন্টেশন",
    playground: "প্লেগ্রাউন্ড",
    models: "মডেল",
    pricing: "মূল্য",
    about: "সম্পর্কে",
    contact: "যোগাযোগ",
    apiDocs: "API ডক্স",
    startBuilding: "শুরু করুন",
    heroTitle: "AI পণ্য তৈরির জন্য দ্রুততম এবং সবচেয়ে শক্তিশালী প্ল্যাটফর্ম",
    heroSubtitle:
      "ইন্ডাস্ট্রি-লিডিং মডেল এবং টুলস দ্বারা চালিত রূপান্তরকারী AI অভিজ্ঞতা তৈরি করুন। কোন API কী প্রয়োজন নেই, কোন কনফিগারেশন প্রয়োজন নেই।",
    getStarted: "শুরু করুন",
    viewDocs: "ডকুমেন্টেশন দেখুন",
    viewDocumentation: "ডকুমেন্টেশন দেখুন",
    featuresTitle: "আপনার পণ্য তৈরি করার সময় দ্রুত পুনরাবৃত্তি করুন",
    featuresSubtitle: "শূন্য কনফিগারেশনের সাথে AI-চালিত অ্যাপ্লিকেশন তৈরি করার জন্য আপনার যা প্রয়োজন সবকিছু।",
    unifiedProvider: "একীভূত প্রদানকারী API",
    unifiedProviderDesc: "একক লাইন কোড পরিবর্তন করে AI প্রদানকারীদের মধ্যে স্যুইচ করুন। কোন জটিল কনফিগারেশন প্রয়োজন নেই।",
    simpleRest: "সহজ REST API",
    simpleRestDesc: "যেকোনো প্রোগ্রামিং ভাষা বা ফ্রেমওয়ার্কের সাথে কাজ করে এমন সহজ REST এন্ডপয়েন্ট।",
    noApiKeys: "কোন API কী প্রয়োজন নেই",
    noApiKeysDesc: "API কী বা প্রমাণীকরণ টোকেন পরিচালনা না করে অবিলম্বে শুরু করুন।",
    openSource: "ওপেন সোর্স",
    openSourceDesc: "সম্পূর্ণ ওপেন-সোর্স প্ল্যাটফর্ম। কোড পরিদর্শন করুন, অবদান রাখুন এবং আপনার নিজস্ব উদাহরণ স্থাপন করুন।",
    modelsTitle: "ফ্ল্যাগশিপ মডেল",
    modelsSubtitle: "বিভিন্ন বাস্তব-বিশ্বের কাজের জন্য শক্তিশালী সাধারণ উদ্দেশ্যমূলক মডেল।",
    recommended: "প্রস্তাবিত",
    fast: "দ্রুত",
    popular: "জনপ্রিয়",
    images: "ছবি",
    new: "নতুন",
    chat: "চ্যাট",
    imageGeneration: "ইমেজ জেনারেশন",
    sendMessage: "একটি বার্তা পাঠান",
    typeMessage: "আপনার বার্তা লিখুন...",
    generating: "তৈরি হচ্ছে...",
    newChat: "নতুন চ্যাট",
    chatHistory: "চ্যাট ইতিহাস",
    clearHistory: "ইতিহাস মুছুন",
    welcomeTitle: "Anbu AI তে স্বাগতম",
    welcomeDesc: "আমাদের AI সহায়কের সাথে একটি কথোপকথন শুরু করুন। প্রশ্ন জিজ্ঞাসা করুন, কোডের সাহায্য পান বা ধারণা অন্বেষণ করুন।",
    prompt: "প্রম্পট",
    style: "স্টাইল",
    size: "সাইজ",
    generate: "তৈরি করুন",
    download: "ডাউনলোড",
    share: "শেয়ার",
    regenerate: "পুনরায় তৈরি",
    gallery: "গ্যালারি",
    imagePromptPlaceholder: "আপনি যে ছবি তৈরি করতে চান তা বর্ণনা করুন...",
    copy: "কপি",
    copied: "কপি হয়েছে!",
    edit: "সম্পাদনা",
    delete: "মুছুন",
    selectAll: "সব নির্বাচন",
    openSourceAI: "ওপেন-সোর্স AI প্ল্যাটফর্ম",
    followUs: "আমাদের অনুসরণ করুন",
    quickLinks: "দ্রুত লিঙ্ক",
    resources: "রিসোর্স",
    legal: "আইনি",
    privacy: "গোপনীয়তা নীতি",
    terms: "সেবার শর্তাবলী",
    madeWith: "দিয়ে তৈরি",
    by: "দ্বারা",
    allRightsReserved: "সর্বস্বত্ব সংরক্ষিত।",
    joinTelegram: "আমাদের টেলিগ্রামে যোগ দিন",
    joinTelegramDesc: "আপডেট, সাপোর্ট এবং কমিউনিটির সাথে যুক্ত হন!",
    joinNow: "এখনই যোগ দিন",
    maybeLater: "পরে হবে",
    messageCopied: "মেসেজ কপি হয়েছে",
    imageDownloaded: "ইমেজ ডাউনলোড হয়েছে",
    sessionReset: "সেশন রিসেট হয়েছে",
    errorOccurred: "একটি ত্রুটি ঘটেছে",
  },
  ja: {
    home: "ホーム",
    docs: "ドキュメント",
    playground: "プレイグラウンド",
    models: "モデル",
    pricing: "料金",
    about: "概要",
    contact: "お問い合わせ",
    apiDocs: "APIドキュメント",
    startBuilding: "始める",
    heroTitle: "オープンAIプラットフォーム",
    heroSubtitle: "テキスト生成と画像作成のための強力なAIモデルにアクセス。ログイン不要、完全無料でオープンソース。",
    getStarted: "始める",
    viewDocs: "ドキュメントを見る",
    chat: "チャット",
    imageGeneration: "画像生成",
    sendMessage: "メッセージを送信",
    typeMessage: "メッセージを入力...",
    generating: "生成中...",
    newChat: "新しいチャット",
    chatHistory: "チャット履歴",
    clearHistory: "履歴をクリア",
    prompt: "プロンプト",
    style: "スタイル",
    size: "サイズ",
    generate: "生成",
    download: "ダウンロード",
    share: "共有",
    regenerate: "再生成",
    copy: "コピー",
    copied: "コピーしました！",
    edit: "編集",
    delete: "削除",
    selectAll: "すべて選択",
    openSourceAI: "オープンソースAIプラットフォーム",
    followUs: "フォローする",
    quickLinks: "クイックリンク",
    resources: "リソース",
    legal: "法的情報",
    privacy: "プライバシーポリシー",
    terms: "利用規約",
    joinTelegram: "テレグラムに参加",
    joinTelegramDesc: "最新情報、サポート、コミュニティに参加しよう！",
    joinNow: "今すぐ参加",
    maybeLater: "後で",
    messageCopied: "メッセージをコピーしました",
    imageDownloaded: "画像をダウンロードしました",
    sessionReset: "セッションがリセットされました",
    errorOccurred: "エラーが発生しました",
  },
  vi: {
    home: "Trang chủ",
    docs: "Tài liệu",
    playground: "Sân chơi",
    models: "Mô hình",
    pricing: "Giá cả",
    about: "Giới thiệu",
    contact: "Liên hệ",
    apiDocs: "Tài liệu API",
    startBuilding: "Bắt đầu",
    heroTitle: "Nền tảng AI mở",
    heroSubtitle:
      "Truy cập các mô hình AI mạnh mẽ để tạo văn bản và hình ảnh. Không cần đăng nhập, hoàn toàn miễn phí và mã nguồn mở.",
    getStarted: "Bắt đầu",
    viewDocs: "Xem tài liệu",
    chat: "Trò chuyện",
    imageGeneration: "Tạo hình ảnh",
    sendMessage: "Gửi tin nhắn",
    typeMessage: "Nhập tin nhắn...",
    generating: "Đang tạo...",
    newChat: "Cuộc trò chuyện mới",
    chatHistory: "Lịch sử trò chuyện",
    clearHistory: "Xóa lịch sử",
    prompt: "Lời nhắc",
    style: "Phong cách",
    size: "Kích thước",
    generate: "Tạo",
    download: "Tải xuống",
    share: "Chia sẻ",
    regenerate: "Tạo lại",
    copy: "Sao chép",
    copied: "Đã sao chép!",
    edit: "Chỉnh sửa",
    delete: "Xóa",
    selectAll: "Chọn tất cả",
    openSourceAI: "Nền tảng AI mã nguồn mở",
    followUs: "Theo dõi chúng tôi",
    quickLinks: "Liên kết nhanh",
    resources: "Tài nguyên",
    legal: "Pháp lý",
    privacy: "Chính sách bảo mật",
    terms: "Điều khoản dịch vụ",
    joinTelegram: "Tham gia Telegram",
    joinTelegramDesc: "Nhận cập nhật, hỗ trợ và kết nối với cộng đồng!",
    joinNow: "Tham gia ngay",
    maybeLater: "Để sau",
    messageCopied: "Đã sao chép tin nhắn",
    imageDownloaded: "Đã tải hình ảnh",
    sessionReset: "Phiên đã được đặt lại",
    errorOccurred: "Đã xảy ra lỗi",
  },
  hi: {
    home: "होम",
    docs: "दस्तावेज़",
    playground: "प्लेग्राउंड",
    models: "मॉडल",
    pricing: "मूल्य",
    about: "हमारे बारे में",
    contact: "संपर्क",
    apiDocs: "API दस्तावेज़",
    startBuilding: "शुरू करें",
    heroTitle: "ओपन AI प्लेटफ़ॉर्म",
    heroSubtitle:
      "टेक्स्ट जनरेशन और इमेज क्रिएशन के लिए शक्तिशाली AI मॉडल एक्सेस करें। लॉगिन की जरूरत नहीं, पूरी तरह से मुफ्त और ओपन-सोर्स।",
    getStarted: "शुरू करें",
    viewDocs: "दस्तावेज़ देखें",
    chat: "चैट",
    imageGeneration: "इमेज जनरेशन",
    sendMessage: "संदेश भेजें",
    typeMessage: "अपना संदेश लिखें...",
    generating: "बना रहे हैं...",
    newChat: "नई चैट",
    chatHistory: "चैट इतिहास",
    clearHistory: "इतिहास साफ़ करें",
    prompt: "प्रॉम्प्ट",
    style: "स्टाइल",
    size: "साइज़",
    generate: "बनाएं",
    download: "डाउनलोड",
    share: "शेयर",
    regenerate: "फिर से बनाएं",
    copy: "कॉपी",
    copied: "कॉपी हो गया!",
    edit: "संपादित करें",
    delete: "हटाएं",
    selectAll: "सभी चुनें",
    openSourceAI: "ओपन-सोर्स AI प्लेटफ़ॉर्म",
    followUs: "हमें फॉलो करें",
    quickLinks: "त्वरित लिंक",
    resources: "संसाधन",
    legal: "कानूनी",
    privacy: "गोपनीयता नीति",
    terms: "सेवा की शर्तें",
    joinTelegram: "हमारे टेलीग्राम से जुड़ें",
    joinTelegramDesc: "अपडेट, सपोर्ट और कम्युनिटी से जुड़ें!",
    joinNow: "अभी जुड़ें",
    maybeLater: "बाद में",
    messageCopied: "मैसेज कॉपी हो गया",
    imageDownloaded: "इमेज डाउनलोड हो गई",
    sessionReset: "सेशन रिसेट हो गया",
    errorOccurred: "एक त्रुटि हुई",
  },
}

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const saved = localStorage.getItem("anbu-language") as Language
    if (saved && translations[saved]) {
      setLanguage(saved)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("anbu-language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key
  }

  return <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
