# StrukKu 🧾

**Aplikasi manajemen pengeluaran mahasiswa dari struk belanja**

Website: [strukku.vercel.app](https://strukku.vercel.app)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📁 Struktur Project

```
src/
├── components/
│   ├── Navbar.jsx        # Bottom navigation
│   ├── Card.jsx          # Stat cards
│   ├── Chart.jsx         # Recharts wrappers
│   ├── ProgressBar.jsx   # Budget progress
│   └── FeatureCard.jsx   # Feature cards
│
├── pages/
│   ├── Landing.jsx       # /  - Landing page
│   ├── Dashboard.jsx     # /dashboard
│   ├── Scan.jsx          # /scan - OCR + Voice
│   ├── History.jsx       # /history - List + Calendar
│   ├── Budget.jsx        # /budget - Budget management
│   ├── Hemat.jsx         # /hemat - Tips + Challenges
│   └── Social.jsx        # /social - Split Bill + Leaderboard
│
├── utils/
│   ├── storage.js        # LocalStorage CRUD
│   ├── ocr.js            # Tesseract.js OCR wrapper
│   └── prediction.js     # Prediksi + Tips engine
│
├── hooks/
│   ├── useBudget.js      # Budget state management
│   └── useExpenses.js    # Expenses state management
│
├── App.jsx               # React Router
├── main.jsx              # Entry point
└── index.css             # Global styles
```

---

## ⚙️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | React 18 + Vite 5 |
| Styling | Tailwind CSS 3 |
| Routing | React Router DOM 6 |
| OCR | Tesseract.js 5 |
| Charts | Recharts 2 |
| Export | SheetJS (xlsx) |
| PWA | Vite Plugin PWA + Workbox |
| Storage | LocalStorage (Supabase-ready) |

---

## 🔥 Fitur

- **📸 Scan Struk** — OCR Tesseract.js, extract harga & tanggal otomatis
- **🎙️ Input Suara** — Web Speech API (Bahasa Indonesia)
- **📊 Dashboard** — Total bulan, chart 7 hari, prediksi akhir bulan
- **💰 Budget** — Set budget, progress bar, warning over budget
- **🔮 Prediksi** — Estimasi pengeluaran berdasarkan rata-rata harian
- **💡 Tips Hemat** — Rule-based tips dari pola pengeluaran
- **🏆 Tantangan** — Challenge dengan progress bar dan badge
- **📅 Kalender** — Visualisasi pengeluaran harian (hijau/merah)
- **🤝 Split Bill** — Hitung + share via WhatsApp
- **🥇 Leaderboard** — Ranking hemat anonim
- **🍳 Resep** — Rekomendasi masak hemat
- **📤 Export Excel** — Export ke .xlsx via SheetJS
- **🔔 Notifikasi** — Notification API reminder harian
- **📱 PWA** — Installable, offline support, manifest

---

## 🚀 Deploy ke Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Atau connect repo GitHub ke Vercel dashboard untuk auto-deploy.

---

## 📝 License

MIT — Made with ❤️ for Indonesian students
