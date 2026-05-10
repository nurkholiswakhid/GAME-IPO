# 📚 PANDUAN DEPLOY APLIKASI DENGAN NGROK (Step by Step)

> **Catatan:** Panduan ini untuk development/testing. Production gunakan hosting seperti Railway, Vercel, Netlify, atau Cloud.

---

## 🎯 APA ITU NGROK?
Ngrok adalah tools yang membuat aplikasi lokal Anda bisa diakses dari internet dengan URL publik. Perfect untuk testing dan sharing.

---

## 📋 PREREQUISITES (Hal yang Perlu Disiapkan)

Pastikan sudah terinstall:
- ✅ Node.js (v16+)
- ✅ npm atau yarn
- ✅ Git (optional)

---

## 🚀 STEP 1: INSTALL NGROK

### Untuk Windows:

**Option A: Direct Download (Recommended)**
1. Buka https://ngrok.com/download
2. Download versi Windows (.zip)
3. Extract folder `ngrok.exe` ke lokasi yang mudah diakses
   - Contoh: `C:\ngrok\` atau `C:\Program Files\ngrok\`
4. Buka Command Prompt atau PowerShell
5. Cek instalasi:
   ```bash
   ngrok version
   ```
   Harusnya keluar versi ngrok jika berhasil

**Option B: Menggunakan Chocolatey**
```bash
choco install ngrok
```

**Option C: Menggunakan npm (Jika sudah ada Node.js)**
```bash
npm install -g ngrok
```

---

## 🔑 STEP 2: DAFTAR DI NGROK & AMBIL AUTH TOKEN

1. Buka https://ngrok.com/
2. Klik **"Sign up"** (buat akun gratis)
3. Verifikasi email Anda
4. Login ke dashboard
5. Copy **Auth Token** Anda (di bagian "Your Authtoken")
6. Jalankan command ini di Terminal/Command Prompt:
   ```bash
   ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
   ```
   Ganti `YOUR_AUTH_TOKEN_HERE` dengan token yang Anda copy

---

## 📂 STEP 3: SETUP PROJECT LOKAL

### 3.1 Install Dependencies Backend
```bash
cd c:\Users\Nurkholis\Downloads\SKRIPSIT\gemeweb\gema\backend
npm install
```

### 3.2 Setup Database & Environment
```bash
# Generate Prisma Client
npx prisma generate

# Buat/Update database
npx prisma migrate dev

# Seed data (optional, jika ada seed file)
npm run prisma:seed
```

### 3.3 Install Dependencies Frontend
```bash
cd c:\Users\Nurkholis\Downloads\SKRIPSIT\gemeweb\gema\frontend
npm install
```

---

## 🏃 STEP 4: JALANKAN APLIKASI LOKAL

Buka **3 Terminal Terpisah** untuk menjalankan:

### Terminal 1: Backend Server
```bash
cd c:\Users\Nurkholis\Downloads\SKRIPSIT\gemeweb\gema\backend
npm run dev
```
✅ Harus muncul: `Server is running on port 5000`

### Terminal 2: Frontend Development Server
```bash
cd c:\Users\Nurkholis\Downloads\SKRIPSIT\gemeweb\gema\frontend
npm run dev
```
✅ Harus muncul: `VITE v8.x.x ready in xxx ms`

### Terminal 3: Biarkan Kosong (Untuk ngrok)
Jangan tutup 2 terminal di atas!

---

## 🌐 STEP 5: EXPOSE BACKEND DENGAN NGROK

Di **Terminal 3 (baru)**, jalankan:

```bash
ngrok http 5000
```

**Apa yang akan terlihat:**
```
ngrok                                       (Ctrl+C to quit)

Session Status                online
Account                       your-email@domain.com
Version                       3.x.x
Region                        us
Latency                        --
Web Interface                  http://127.0.0.1:4040

Forwarding                     https://xxxx-xxx-xxx-xxx.ngrok-free.app -> http://localhost:5000
```

✅ **Copy URL ngrok Anda**: `https://xxxx-xxx-xxx-xxx.ngrok-free.app`

---

## 🔧 STEP 6: UPDATE FRONTEND UNTUK CONNECT KE NGROK URL

Buka file [frontend/src/main.jsx](frontend/src/main.jsx) atau file konfigurasi API:

**Cari tempat di mana Anda set API Base URL:**

### Cara 1: Jika sudah ada file konfigurasi API
Cari file seperti `src/config.js`, `src/api.js`, atau di `src/App.jsx`

Ubah dari:
```javascript
const API_URL = 'http://localhost:5000';
```

Menjadi:
```javascript
const API_URL = 'https://xxxx-xxx-xxx-xxx.ngrok-free.app';
```

### Cara 2: Quick Test - Langsung di Browser
Cek apakah backend accessible:
1. Buka di browser: `https://xxxx-xxx-xxx-xxx.ngrok-free.app/api/health`
2. Harusnya muncul: `{"status":"Server is running"}`

---

## 📱 STEP 7: AKSES APLIKASI

### Dari Komputer Lokal:
- Frontend: `http://localhost:5173` (atau port yang Vite kasih)
- Backend API: `https://xxxx-xxx-xxx-xxx.ngrok-free.app/api/...`

### Dari Device/Komputer Lain:
- Buka: `https://xxxx-xxx-xxx-xxx.ngrok-free.app`
- Akses melalui ngrok URL yang sudah di-forward

✅ **Sekarang aplikasi bisa diakses dari mana saja!**

---

## 🛑 STEP 8: MONITORING & DEBUGGING

### Dashboard Ngrok:
- Buka: `http://127.0.0.1:4040`
- Lihat semua request yang masuk
- Debug Network tab
- Lihat status koneksi

### Tips Debugging:
- **CORS Error?** → Backend sudah configure CORS untuk semua origin
- **Connection Refused?** → Pastikan backend berjalan di terminal 1
- **ngrok URL berubah?** → Normal, setiap stop-start URL baru
- **Timeout?** → Cek kecepatan internet & firewall

---

## 🔄 STEP 9: TROUBLESHOOTING

### ❌ "command not found: ngrok"
**Solusi:**
- Pastikan ngrok sudah di-install
- Jika install dari .zip, tambahkan ke PATH atau jalankan full path
```bash
C:\ngrok\ngrok.exe http 5000
```

### ❌ "Port 5000 already in use"
**Solusi:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (ganti PID dengan nomor yang ditampilkan)
taskkill /PID <PID> /F

# Atau ubah PORT di backend/.env
PORT=5001
```

### ❌ "Failed to connect to backend"
**Solusi:**
1. Cek semua 3 terminal masih berjalan
2. Cek URL ngrok benar di frontend
3. Cek firewall/antivirus mengizinkan ngrok
4. Restart semua terminal

### ❌ "Connection refused from phone/device lain"
**Solusi:**
- Pastikan device sudah punya internet
- Ngrok URL harus accessible from internet (bukan localhost)
- Cek laptop firewall tidak block ngrok

---

## 📊 STRUKTUR LENGKAP SAAT DEPLOY

```
Komputer Anda:
├── Terminal 1: Backend (port 5000)
│   └── http://localhost:5000
│
├── Terminal 2: Frontend (port 5173)
│   └── http://localhost:5173
│
└── Terminal 3: Ngrok (expose port 5000)
    └── https://xxxx-xxx-xxx-xxx.ngrok-free.app

Dari Device Lain:
└── https://xxxx-xxx-xxx-xxx.ngrok-free.app
    └── API Calls: https://xxxx-xxx-xxx-xxx.ngrok-free.app/api/...
```

---

## 💡 TIPS UNTUK DEVELOPMENT

### 1. Permanent URL (Paid)
Ngrok free URL berubah setiap restart. Jika ingin permanent:
- Upgrade ke Ngrok Pro/Enterprise
- Atau gunakan Railway, Vercel (lebih recommended)

### 2. .env File untuk Easy Switch
**Buat file `frontend/.env.local`:**
```
VITE_API_URL=https://xxxx-xxx-xxx-xxx.ngrok-free.app
```

**Update `frontend/src/main.jsx`:**
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

### 3. Sharing dengan Tim
- Share ngrok URL ke tim untuk testing
- URL berubah? Update di team slack/chat
- Untuk permanent → gunakan Railway/Vercel

### 4. Testing dari Berbagai Device
```bash
# Buka di browser berbeda device:
https://xxxx-xxx-xxx-xxx.ngrok-free.app

# Atau gunakan QR code scanner jika ditampilkan ngrok
```

---

## 🚢 NEXT STEPS: PRODUCTION DEPLOYMENT

Setelah test dengan ngrok, untuk production gunakan:

1. **Railway** (Recommended - Indonesia friendly)
   - Buka: https://railway.app
   - Deploy Backend + Frontend
   - Unlimited bandwidth
   - Free tier tersedia

2. **Vercel** (Untuk Frontend)
   - Buka: https://vercel.com
   - Deploy React Frontend

3. **Heroku** (Alternative - Bayar)
   - Lebih stabil tapi ada biaya

---

## ⏰ QUICK COMMAND REFERENCE

```bash
# 1. Install ngrok
choco install ngrok
# atau download dari https://ngrok.com/download

# 2. Auth token
ngrok config add-authtoken YOUR_TOKEN

# 3. Backend
cd backend && npm install && npm run dev

# 4. Frontend
cd frontend && npm install && npm run dev

# 5. Ngrok expose
ngrok http 5000

# 6. Update frontend API URL ke ngrok URL

# 7. Test
# - http://localhost:5173 (local)
# - https://xxxx-xxx-xxx.ngrok-free.app (dari device lain)
```

---

## ✅ CHECKLIST DEPLOYMENT

- [ ] Ngrok installed & auth token set
- [ ] Backend berjalan di port 5000
- [ ] Frontend berjalan di port 5173
- [ ] Ngrok expose port 5000 → dapat URL
- [ ] Frontend API URL updated ke ngrok URL
- [ ] Test dari localhost berjalan normal
- [ ] Test dari device lain berjalan normal
- [ ] Database migrations sudah dijalankan
- [ ] Tidak ada error di console

---

## 🎓 KESIMPULAN

Sekarang aplikasi Anda bisa:
✅ Diakses dari komputer lokal: `http://localhost:5173`
✅ Diakses dari internet: `https://ngrok-url.app`
✅ Di-share ke tim untuk testing
✅ Siap untuk production deploy

**Pertanyaan?** Cek dashboard ngrok atau baca docs resmi di https://ngrok.com/docs

Happy Coding! 🎉
