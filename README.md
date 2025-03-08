# Aplikasi Bendahara Inodes

Aplikasi manajemen keuangan untuk bendahara desa yang memudahkan pencatatan dan pengelolaan pemasukan serta pengeluaran dana desa.

## Fitur Utama

- 📊 Dashboard dengan ringkasan keuangan
- 💰 Manajemen pemasukan dana
- 💸 Manajemen pengeluaran dengan upload nota
- 📑 Laporan keuangan detail
- 🔒 Sistem autentikasi pengguna
- 📱 Responsive design (Desktop & Mobile)

## Teknologi yang Digunakan

- **Frontend:**
  - Next.js 13 (App Router)
  - Material-UI (MUI)
  - React Hooks
  - Context API

- **Backend:**
  - Node.js
  - Express.js
  - MySQL
  - JWT Authentication

## Instalasi

1. Clone repository
```bash
git clone https://github.com/ameliaendino/bendahara-inodes.git
cd bendahara-inodes
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```bash
cp .env.example .env.local
# Edit .env.local sesuai konfigurasi
```

4. Jalankan aplikasi
```bash
npm run dev
```

## Struktur Folder

```
bendahara-inodes/
├── src/
│   ├── app/             # Next.js App Router
│   ├── components/      # React Components
│   ├── config/         # Konfigurasi aplikasi
│   ├── services/       # API Services
│   └── styles/         # Global styles
├── public/             # Static files
└── package.json
```

## Fitur Keamanan

- ✅ JWT Authentication
- 🔐 Protected Routes
- 🛡️ Input Validation
- 📝 Activity Logging

## Kontribusi

Jika Anda ingin berkontribusi pada project ini, silakan:

1. Fork repository
2. Buat branch fitur baru (`git checkout -b fitur-baru`)
3. Commit perubahan (`git commit -m 'Menambah fitur baru'`)
4. Push ke branch (`git push origin fitur-baru`)
5. Buat Pull Request

## Lisensi

[MIT License](LICENSE)

## Kontak

Amelia Endino - [@ameliaendino](https://github.com/ameliaendino)

Project Link: [https://github.com/ameliaendino/bendahara-inodes](https://github.com/ameliaendino/bendahara-inodes)
