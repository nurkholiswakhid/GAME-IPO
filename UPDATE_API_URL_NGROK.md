# 🔗 CARA UPDATE API URL UNTUK NGROK DEPLOY

## 📍 File yang Perlu Di-Update

Frontend sudah menggunakan environment variables dengan benar. File yang perlu Anda update:

**File: `frontend/.env`**

Lokasi: `c:\Users\Nurkholis\Downloads\SKRIPSIT\gemeweb\gema\frontend\.env`

---

## 📝 STEP 1: Update .env File

### Sebelum Deploy dengan Ngrok (LOCAL):
```env
VITE_API_URL=http://localhost:5000
```

### Sesudah Deploy dengan Ngrok:
```env
VITE_API_URL=https://xxxx-xxx-xxx-xxx.ngrok-free.app
```

**Ganti URL ngrok Anda yang didapat dari Terminal 3 saat menjalankan `ngrok http 5000`**

---

## 🔄 STEP 2: Reload Frontend

Setelah update `.env`, frontend harus di-restart:

1. **Stop Frontend** (Di Terminal 2 yang menjalankan frontend)
   - Tekan `Ctrl + C`

2. **Jalankan Ulang Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Buka Browser**
   - Jika local: `http://localhost:5173`
   - Jika dari device lain: `https://xxxx-xxx-xxx-xxx.ngrok-free.app`

---

## 🧪 STEP 3: Verifikasi Koneksi

### Test 1: Check Backend Health
Buka di browser:
```
https://xxxx-xxx-xxx-xxx.ngrok-free.app/api/health
```

Seharusnya muncul:
```json
{"status":"Server is running"}
```

### Test 2: Login Page
Buka di browser:
```
https://xxxx-xxx-xxx-xxx.ngrok-free.app
```

Seharusnya muncul halaman login

### Test 3: Browser Console
1. Buka aplikasi
2. Tekan `F12` → Console
3. Cek apakah ada error merah
4. Jika ada error CORS, restart backend

---

## 📋 PENGGUNAAN ENVIRONMENT VARIABLES DI FRONTEND

Aplikasi Anda sudah menggunakan environment variables dengan benar:

### Di File `src/context/GameContext.jsx`:
```javascript
axios.get(`${import.meta.env.VITE_API_URL}/api/students/${sessionId}`)
```

### Di File `src/pages/DashboardGuru.jsx`:
```javascript
axios.get(`${import.meta.env.VITE_API_URL}/api/admin/students`, {
  headers: { Authorization: `Bearer ${token}` }
})
```

**Ini sudah benar! Environment variable akan otomatis terbaca dari `.env`**

---

## 🔐 SECURITY TIPS

### ❌ JANGAN:
```javascript
// ❌ Jangan hardcode URL di kode
const API_URL = 'https://xxxx-xxxx.ngrok-free.app';
```

### ✅ GUNAKAN:
```javascript
// ✅ Gunakan environment variable
const API_URL = import.meta.env.VITE_API_URL;
```

---

## 🚀 QUICK UPDATE CHECKLIST

### Saat Mau Deploy dengan Ngrok:

1. **Terminal 1: Jalankan Backend**
   ```bash
   cd backend
   npm run dev
   ```
   ✅ Tunggu sampai: `Server is running on port 5000`

2. **Terminal 2: Jalankan Frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   ✅ Tunggu sampai: `VITE v8.x.x ready`

3. **Terminal 3: Jalankan Ngrok**
   ```bash
   ngrok http 5000
   ```
   ✅ Copy URL yang keluar (contoh: `https://xxxx-xxxx.ngrok-free.app`)

4. **Update `.env`**
   - Buka `frontend/.env`
   - Ubah `VITE_API_URL=http://localhost:5000` 
   - Menjadi `VITE_API_URL=https://xxxx-xxxx.ngrok-free.app`

5. **Reload Frontend**
   - Tekan `Ctrl + C` di Terminal 2
   - Jalankan `npm run dev` lagi

6. **Test**
   - Local: `http://localhost:5173`
   - Public: `https://xxxx-xxxx.ngrok-free.app`

---

## ⚡ ALTERNATIVE: Gunakan .env.production

Jika Anda ingin file terpisah untuk production:

### Buat file baru: `frontend/.env.production`
```env
VITE_API_URL=https://xxxx-xxx-xxx.ngrok-free.app
```

### Saat build untuk production:
```bash
npm run build
```

Vite akan otomatis menggunakan `.env.production`

---

## 🔧 STRUKTUR ENV FILES

```
frontend/
├── .env                    # Development (localhost:5000)
├── .env.production         # Production (ngrok atau hosted URL)
├── .env.local              # Local overrides (jangan push ke git)
└── src/
    └── main.jsx            # Menggunakan import.meta.env.VITE_API_URL
```

---

## 📖 REFERENSI

- Vite Env Documentation: https://vitejs.dev/guide/env-and-mode.html
- Ngrok Documentation: https://ngrok.com/docs
- Axios Documentation: https://axios-http.com/

---

## ✅ SELESAI!

Aplikasi Anda sekarang bisa:
- ✅ Berjalan di localhost (development)
- ✅ Berjalan via ngrok (testing & sharing)
- ✅ Siap untuk production deployment

**Pertanyaan?** Baca PANDUAN_NGROK_DEPLOY.md untuk info lebih lengkap.
