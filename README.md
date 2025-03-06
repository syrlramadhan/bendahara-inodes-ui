# Aplikasi Bendahara Desa

Aplikasi manajemen keuangan untuk bendahara desa yang memudahkan pencatatan dan pelaporan keuangan desa.

## Fitur

- 🔐 **Autentikasi**
  - Login/logout sistem
  - Proteksi rute
  - Manajemen sesi dengan cookies
- 📊 **Dashboard** - Ringkasan dan visualisasi data keuangan
- 💰 **Manajemen Kas**
  - Pencatatan pemasukan
  - Pencatatan pengeluaran
  - Monitoring saldo kas desa
- 📑 **Laporan Keuangan** - Generate laporan keuangan desa
- 🌓 **Dark Mode** - Tampilan gelap untuk kenyamanan pengguna
- 📱 **Responsive** - Dapat diakses dari berbagai ukuran layar

## Teknologi

- Next.js 13
- Material-UI (MUI)
- Context API untuk state management
- Cookies & Local Storage untuk autentikasi dan preferensi

## Instalasi

1. Clone repository
```bash
git clone https://github.com/ameliaendino/bendahara-inodes.git
```

2. Install dependencies
```bash
npm install
# atau
yarn install
```

3. Jalankan aplikasi
```bash
npm run dev
# atau
yarn dev
```

4. Buka [http://localhost:5500](http://localhost:5500) di browser

## Penggunaan

1. Login sebagai bendahara
   - Gunakan username dan password apapun (mode development)
   - Data login akan disimpan di cookies
2. Akses menu melalui sidebar:
   - Dashboard untuk melihat ringkasan
   - Pemasukan untuk mencatat pendapatan
   - Pengeluaran untuk mencatat belanja
   - Kas Desa untuk monitoring saldo
   - Laporan untuk generate laporan keuangan
3. Gunakan toggle dark mode di menu settings untuk mengubah tema
4. Logout melalui tombol di sidebar untuk mengakhiri sesi

## Kontribusi

Silakan berkontribusi dengan membuat pull request. Untuk perubahan besar, harap buka issue terlebih dahulu untuk mendiskusikan perubahan yang diinginkan.

## Lisensi

[MIT License](LICENSE)
