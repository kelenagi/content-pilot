export type Locale = "en" | "id";

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Nav
    "nav.home": "Home",
    "nav.chat": "AI Chat",
    "nav.content": "Content Creation",
    "nav.settings": "Settings",

    // Hero
    "hero.title": "Create once. Publish everywhere.",
    "hero.subtitle":
      "Your personal AI content creation assistant. Strategy-driven, bilingual content for blogs, social media, and more.",
    "hero.cta": "Start Creating",
    "hero.cta2": "Configure API",

    // Features
    "features.title": "What Can ContentPilot Do?",
    "features.subtitle":
      "AI-powered content creation tools designed for creators and marketers",
    "features.chat.title": "AI Content Chat",
    "features.chat.desc":
      "Chat with AI to brainstorm ideas, write blog posts, social media captions, tweets, and more. Supports streaming responses.",
    "features.column.title": "Column-Based Creation",
    "features.column.desc":
      "Create content columns with positioning, then generate topics and drafts systematically for consistent output.",
    "features.bilingual.title": "Bilingual Output",
    "features.bilingual.desc":
      "Generate content in both English and Bahasa Indonesia with a single click. Perfect for reaching wider audiences.",
    "features.api.title": "Custom API & Model",
    "features.api.desc":
      "Connect to any OpenAI-compatible API. Use your own base URL, API key, and model selection.",
    "features.templates.title": "Content Templates",
    "features.templates.desc":
      "Pre-built templates for blog posts, tweets, Instagram captions, LinkedIn posts, and more.",
    "features.local.title": "Local Deployment",
    "features.local.desc":
      "Runs entirely on your local machine. No data leaves your environment unless you choose to connect an external API.",

    // Chat
    "chat.title": "AI Content Assistant",
    "chat.placeholder": "Describe the content you want to create...",
    "chat.send": "Send",
    "chat.thinking": "Thinking...",
    "chat.welcome": "Welcome! I'm your AI content creation assistant.",
    "chat.welcome.desc":
      "Tell me what kind of content you'd like to create. I can help with blog posts, social media captions, tweets, marketing copy, and more.",
    "chat.error": "Error: Could not connect to the AI API. Please check your settings.",
    "chat.configure": "Please configure your API settings first.",
    "chat.system.prompt":
      "You are a professional content creation assistant. You help users create high-quality content for blogs, social media (Twitter/X, Instagram, LinkedIn, Facebook), newsletters, and marketing materials. You can write in both English and Bahasa Indonesia. Always provide well-structured, engaging content. When asked, provide multiple variations or options.",

    // Content
    "content.title": "Content Creation",
    "content.subtitle":
      "Create content columns, generate topics, and produce drafts systematically.",
    "content.create": "Create Column",
    "content.name": "Column Name",
    "content.name.placeholder": "e.g., AI Tools Weekly, Growth Notes...",
    "content.goal": "Goal / Direction",
    "content.goal.placeholder": "Describe the content direction, target audience, and publishing channel...",
    "content.platform": "Platform",
    "content.language": "Language",
    "content.generate.topics": "Generate Topics",
    "content.generate.draft": "Generate Draft",
    "content.topics": "Topics",
    "content.draft": "Draft",
    "content.columns": "Your Columns",
    "content.no.columns": "No columns yet. Create one to get started!",
    "content.delete": "Delete",
    "content.templates": "Templates",
    "content.use.template": "Use Template",

    // Settings
    "settings.title": "API Settings",
    "settings.subtitle": "Configure your AI API connection. Supports any OpenAI-compatible API.",
    "settings.baseUrl": "API Base URL",
    "settings.baseUrl.placeholder": "https://api.openai.com/v1",
    "settings.apiKey": "API Key",
    "settings.apiKey.placeholder": "sk-...",
    "settings.model": "Model",
    "settings.model.placeholder": "gpt-4o-mini",
    "settings.save": "Save Settings",
    "settings.saved": "Settings saved!",
    "settings.test": "Test Connection",
    "settings.testing": "Testing...",
    "settings.test.success": "Connection successful!",
    "settings.test.error": "Connection failed. Please check your settings.",

    // Common
    "common.language": "Language",
    "common.theme": "Theme",
    "common.light": "Light",
    "common.dark": "Dark",
    "common.english": "English",
    "common.indonesian": "Bahasa Indonesia",
    "common.both": "Both",
    "common.copy": "Copy",
    "common.copied": "Copied!",
    "common.loading": "Loading...",

    // Platforms
    "platform.blog": "Blog Post",
    "platform.twitter": "Twitter/X",
    "platform.instagram": "Instagram",
    "platform.linkedin": "LinkedIn",
    "platform.facebook": "Facebook",
    "platform.newsletter": "Newsletter",
    "platform.tiktok": "TikTok",

    // Templates
    "template.blog.title": "SEO Blog Post",
    "template.blog.desc": "Long-form SEO-optimized blog article with headings, meta description, and keywords.",
    "template.tweet.title": "Viral Tweet Thread",
    "template.tweet.desc": "Engaging tweet thread with hooks, insights, and call-to-action.",
    "template.instagram.title": "Instagram Caption",
    "template.instagram.desc": "Eye-catching Instagram caption with hashtags and call-to-action.",
    "template.linkedin.title": "LinkedIn Post",
    "template.linkedin.desc": "Professional LinkedIn post for thought leadership and engagement.",
    "template.newsletter.title": "Newsletter Edition",
    "template.newsletter.desc": "Complete newsletter with intro, main content, and sign-off.",
    "template.tiktok.title": "TikTok Script",
    "template.tiktok.desc": "Short-form video script with hook, content, and CTA.",
  },
  id: {
    // Nav
    "nav.home": "Beranda",
    "nav.chat": "Chat AI",
    "nav.content": "Buat Konten",
    "nav.settings": "Pengaturan",

    // Hero
    "hero.title": "Buat sekali. Publikasikan di mana saja.",
    "hero.subtitle":
      "Asisten pembuatan konten AI pribadi Anda. Konten berbasis strategi, dwibahasa untuk blog, media sosial, dan lainnya.",
    "hero.cta": "Mulai Membuat",
    "hero.cta2": "Konfigurasi API",

    // Features
    "features.title": "Apa yang Bisa ContentPilot Lakukan?",
    "features.subtitle":
      "Alat pembuatan konten berbasis AI yang dirancang untuk kreator dan pemasar",
    "features.chat.title": "Chat Konten AI",
    "features.chat.desc":
      "Chat dengan AI untuk brainstorming ide, menulis postingan blog, caption media sosial, tweet, dan lainnya. Mendukung respons streaming.",
    "features.column.title": "Pembuatan Berbasis Kolom",
    "features.column.desc":
      "Buat kolom konten dengan positioning, lalu hasilkan topik dan draf secara sistematis untuk output yang konsisten.",
    "features.bilingual.title": "Output Dwibahasa",
    "features.bilingual.desc":
      "Hasilkan konten dalam Bahasa Inggris dan Bahasa Indonesia dengan satu klik. Sempurna untuk menjangkau audiens yang lebih luas.",
    "features.api.title": "API & Model Kustom",
    "features.api.desc":
      "Hubungkan ke API apa pun yang kompatibel dengan OpenAI. Gunakan base URL, API key, dan pilihan model Anda sendiri.",
    "features.templates.title": "Template Konten",
    "features.templates.desc":
      "Template siap pakai untuk postingan blog, tweet, caption Instagram, postingan LinkedIn, dan lainnya.",
    "features.local.title": "Deploy Lokal",
    "features.local.desc":
      "Berjalan sepenuhnya di mesin lokal Anda. Tidak ada data yang keluar kecuali Anda menghubungkan API eksternal.",

    // Chat
    "chat.title": "Asisten Konten AI",
    "chat.placeholder": "Deskripsikan konten yang ingin Anda buat...",
    "chat.send": "Kirim",
    "chat.thinking": "Berpikir...",
    "chat.welcome": "Selamat datang! Saya asisten pembuatan konten AI Anda.",
    "chat.welcome.desc":
      "Ceritakan jenis konten apa yang ingin Anda buat. Saya bisa membantu dengan postingan blog, caption media sosial, tweet, copy marketing, dan lainnya.",
    "chat.error": "Error: Tidak bisa terhubung ke API AI. Silakan periksa pengaturan Anda.",
    "chat.configure": "Silakan konfigurasi pengaturan API Anda terlebih dahulu.",
    "chat.system.prompt":
      "Kamu adalah asisten pembuatan konten profesional. Kamu membantu pengguna membuat konten berkualitas tinggi untuk blog, media sosial (Twitter/X, Instagram, LinkedIn, Facebook), newsletter, dan materi marketing. Kamu bisa menulis dalam Bahasa Inggris dan Bahasa Indonesia. Selalu berikan konten yang terstruktur baik dan menarik. Jika diminta, berikan beberapa variasi atau opsi.",

    // Content
    "content.title": "Pembuatan Konten",
    "content.subtitle":
      "Buat kolom konten, hasilkan topik, dan produksi draf secara sistematis.",
    "content.create": "Buat Kolom",
    "content.name": "Nama Kolom",
    "content.name.placeholder": "cth., Tips AI Mingguan, Catatan Pertumbuhan...",
    "content.goal": "Tujuan / Arah",
    "content.goal.placeholder": "Deskripsikan arah konten, target audiens, dan kanal publikasi...",
    "content.platform": "Platform",
    "content.language": "Bahasa",
    "content.generate.topics": "Hasilkan Topik",
    "content.generate.draft": "Hasilkan Draf",
    "content.topics": "Topik",
    "content.draft": "Draf",
    "content.columns": "Kolom Anda",
    "content.no.columns": "Belum ada kolom. Buat satu untuk memulai!",
    "content.delete": "Hapus",
    "content.templates": "Template",
    "content.use.template": "Gunakan Template",

    // Settings
    "settings.title": "Pengaturan API",
    "settings.subtitle": "Konfigurasi koneksi API AI Anda. Mendukung API apa pun yang kompatibel dengan OpenAI.",
    "settings.baseUrl": "URL Dasar API",
    "settings.baseUrl.placeholder": "https://api.openai.com/v1",
    "settings.apiKey": "Kunci API",
    "settings.apiKey.placeholder": "sk-...",
    "settings.model": "Model",
    "settings.model.placeholder": "gpt-4o-mini",
    "settings.save": "Simpan Pengaturan",
    "settings.saved": "Pengaturan disimpan!",
    "settings.test": "Tes Koneksi",
    "settings.testing": "Menguji...",
    "settings.test.success": "Koneksi berhasil!",
    "settings.test.error": "Koneksi gagal. Silakan periksa pengaturan Anda.",

    // Common
    "common.language": "Bahasa",
    "common.theme": "Tema",
    "common.light": "Terang",
    "common.dark": "Gelap",
    "common.english": "English",
    "common.indonesian": "Bahasa Indonesia",
    "common.both": "Keduanya",
    "common.copy": "Salin",
    "common.copied": "Tersalin!",
    "common.loading": "Memuat...",

    // Platforms
    "platform.blog": "Postingan Blog",
    "platform.twitter": "Twitter/X",
    "platform.instagram": "Instagram",
    "platform.linkedin": "LinkedIn",
    "platform.facebook": "Facebook",
    "platform.newsletter": "Newsletter",
    "platform.tiktok": "TikTok",

    // Templates
    "template.blog.title": "Postingan Blog SEO",
    "template.blog.desc": "Artikel blog panjang yang dioptimasi SEO dengan heading, meta description, dan kata kunci.",
    "template.tweet.title": "Thread Tweet Viral",
    "template.tweet.desc": "Thread tweet yang menarik dengan hook, insight, dan call-to-action.",
    "template.instagram.title": "Caption Instagram",
    "template.instagram.desc": "Caption Instagram yang eye-catching dengan hashtag dan call-to-action.",
    "template.linkedin.title": "Postingan LinkedIn",
    "template.linkedin.desc": "Postingan LinkedIn profesional untuk thought leadership dan engagement.",
    "template.newsletter.title": "Edisi Newsletter",
    "template.newsletter.desc": "Newsletter lengkap dengan intro, konten utama, dan penutup.",
    "template.tiktok.title": "Skrip TikTok",
    "template.tiktok.desc": "Skrip video pendek dengan hook, konten, dan CTA.",
  },
};

export function t(key: string, locale: Locale): string {
  return translations[locale]?.[key] ?? translations.en[key] ?? key;
}
