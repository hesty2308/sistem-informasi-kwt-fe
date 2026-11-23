# KWT Kartini - Frontend SPA

Aplikasi Single Page Application (SPA) berbasis Vue 3 (`<script setup>`, JavaScript murni) dengan Vite dan Tailwind CSS untuk website Sistem Informasi Kegiatan **Paguyuban KWT Kartini, Kabupaten OKU Timur**.

---

## 1. Kebutuhan Sistem
- **Node.js**: Versi 20+ (didukung hingga Node 24+)
- **NPM**: Versi 10+
- **Backend**: Layanan `kwt-laravel` aktif di `http://kwt-laravel.test`

---

## 2. Konfigurasi Lingkungan (.env)
Pastikan berkas `.env` sudah terisi:
```env
VITE_API_BASE_URL=/api/v1
VITE_ADMIN_LOGIN_PATH=masuk-pengelola
VITE_SITE_URL=http://localhost:5173
```

---

## 3. Langkah Menjalankan di Laragon
1. Pastikan backend di Laragon (Apache & MySQL) sudah berjalan.
2. Buka terminal di folder `kwt-fe`:
   ```bash
   # Menjalankan server pengembangan
   npm run dev
   ```
3. Buka peramban dan akses:
   ```
   http://localhost:5173
   ```
4. Halaman beranda akan secara otomatis menguji koneksi ke endpoint `/api/v1/ping` melalui reverse proxy Vite. Status akan menampilkan **"Terhubung ke server"**.

---

## 4. Perintah Tambahan
```bash
# Build untuk produksi
npm run build

# Menjalankan preview hasil build produksi
npm run preview

# Memeriksa standar kode dan format
npm run lint
```
