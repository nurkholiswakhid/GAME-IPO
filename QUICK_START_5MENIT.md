# ⚡ NGROK DEPLOY - CARA CEPAT (5 MENIT)

## 🎯 HASIL AKHIR
Aplikasi bisa diakses dari **internet** tanpa hosting mahal! 
```
✅ Lokal: http://localhost:5173
✅ Internet: https://xxxx-xxx-xxx.ngrok-free.app
```

---

## 📌 PRASYARAT (WAJIB)

Pastikan sudah install:
1. **Node.js** → https://nodejs.org (pilih LTS)
2. **Ngrok** → https://ngrok.com/download

---

## 🚀 LANGKAH-LANGKAH (MUDAH!)

### STEP 1: Buka 3 Terminal Terpisah
Klik Windows + R → `cmd` → Enter (3x buat 3 terminal)

### STEP 2: Terminal 1 - Jalankan Backend
Copy-paste ini:
```bash
cd c:\Users\Nurkholis\Downloads\SKRIPSIT\gemeweb\gema\backend
npm install
npx prisma generate
npm run dev
```

**Tunggu sampai keluar:** `Server is running on port 5002` ✅

### STEP 3: Terminal 2 - Jalankan Frontend  
Copy-paste ini:
```bash
cd c:\Users\Nurkholis\Downloads\SKRIPSIT\gemeweb\gema\frontend
npm install
npm run dev
```

**Tunggu sampai keluar:** `http://localhost:5173` ✅

### STEP 4: Terminal 3 - Jalankan Ngrok
Copy-paste ini:
```bash
ngrok http 5002
```

**Lihat output yang muncul, cari bagian ini:**
```
Forwarding    https://xxxx-xxx-xxx-xxx.ngrok-free.app -> http://localhost:5002
```

**COPY URL tersebut (ganti xxxx dengan yang Anda dapat)**

### STEP 5: Update Frontend .env
1. Buka file: `frontend\.env`
2. Ubah baris:
   ```
   VITE_API_URL=http://localhost:5002
   ```
   Menjadi:
   ```
   VITE_API_URL=https://xxxx-xxx-xxx-xxx.ngrok-free.app
   ```
   (Ganti xxxx dengan URL dari Terminal 3)

### STEP 6: Reload Frontend
Di **Terminal 2**:
- Tekan `Ctrl + C`
- Ketik: `npm run dev`
- Tekan Enter

### STEP 7: TEST! ✅

**Di laptop yang sama:**
- Buka: `http://localhost:5173`

**Di phone/laptop lain (perlu internet):**
- Buka: `https://xxxx-xxx-xxx-xxx.ngrok-free.app`

---

## 🎯 VERIFIKASI BERHASIL

✅ Jika ini terpenuhi = **BERHASIL!**

- [ ] Terminal 1 menunjukkan: `Server is running on port 5002`
- [ ] Terminal 2 menunjukkan: `http://localhost:5173`
- [ ] Terminal 3 menunjukkan ngrok URL (https://...)
- [ ] Buka `http://localhost:5173` di browser → Loading OK
- [ ] Buka ngrok URL di browser → Loading OK
- [ ] Bisa login ke aplikasi
- [ ] Buka ngrok dashboard: `http://127.0.0.1:4040` → Request terlihat

---

## ❌ MASALAH UMUM & SOLUSI

### ❌ "ngrok: command not found"
**Solusi:** 
- Download ngrok dari https://ngrok.com/download
- Extract dan letakkan di `C:\ngrok\`
- Atau install via npm: `npm install -g ngrok`

### ❌ "Port 5002 already in use"
**Solusi:**
```bash
# Kill process yang pakai port 5002
netstat -ano | findstr :5002
taskkill /PID [NOMOR] /F
```

### ❌ Bisa akses localhost tapi ngrok URL error
**Solusi:**
1. Cek terminal 1 (backend) masih berjalan
2. Cek terminal 3 (ngrok) masih running
3. Cek frontend .env sudah di-update
4. Reload Terminal 2: `Ctrl+C` + `npm run dev`

### ❌ Akses dari phone/device lain tidak bisa
**Solusi:**
- Pastikan ngrok URL benar (ada `https://`)
- Pastikan device punya internet
- Cek firewall laptop tidak block ngrok
- Restart semua terminal dan coba lagi

---

## 📱 TESTING DARI DEVICE LAIN

### Method 1: Via Ngrok URL (Recommended)
1. Terminal 3 harus running ngrok
2. Copy ngrok URL
3. Buka di phone: `https://xxxx-xxx-xxx-xxx.ngrok-free.app`
4. Harus loading dan bisa interaksi

### Method 2: Via IP Lokal (Harus WiFi Sama)
1. Buka command prompt
2. Ketik: `ipconfig`
3. Cari: `IPv4 Address` (contoh: 192.168.1.100)
4. Di phone, buka: `http://192.168.1.100:5173`
5. Harus loading jika device terhubung WiFi yang sama

---

## 📊 STRUKTUR TERMINAL YANG BENAR

```
TERMINAL 1                TERMINAL 2                TERMINAL 3
├─ cd backend            ├─ cd frontend            ├─ ngrok http 5002
├─ npm install           ├─ npm install            │
├─ npm run dev           ├─ npm run dev            └─ Forwarding to...
│                        │                           https://xxxx.app
├─ Server running        ├─ http://localhost:5173  
│  port 5002             │                        
└─ ✅ Running            └─ ✅ Running             └─ ✅ Running
```

---

## ⚡ COMMAND SHORTCUTS

**Simpan ini di notepad untuk referensi cepat:**

```bash
# Backend
cd c:\Users\Nurkholis\Downloads\SKRIPSIT\gemeweb\gema\backend && npm run dev

# Frontend  
cd c:\Users\Nurkholis\Downloads\SKRIPSIT\gemeweb\gema\frontend && npm run dev

# Ngrok
ngrok http 5002

# Test health
curl https://xxxx-xxx-xxx-xxx.ngrok-free.app/api/health
```

---

## 🔍 DEBUGGING TIPS

1. **Buka Ngrok Dashboard**
   - Browser: `http://127.0.0.1:4040`
   - Lihat semua request yang masuk
   - Cek status & response

2. **Browser Console (F12)**
   - Lihat error message
   - Cek Network tab untuk failed requests

3. **Terminal Output**
   - Baca error message di Terminal 1, 2, 3
   - Cari text merah = ada error

---

## 📋 CHECKLIST SEBELUM TESTING

- [ ] Ngrok sudah install & auth token set
- [ ] 3 Terminal berjalan (Backend, Frontend, Ngrok)
- [ ] Tidak ada error di ketiga terminal
- [ ] frontend/.env sudah update dengan ngrok URL
- [ ] Frontend sudah di-reload (Ctrl+C + npm run dev)
- [ ] Bisa akses http://localhost:5173
- [ ] Bisa akses https://xxxx-xxx-xxx.ngrok-free.app

---

## 🎓 SETIAP KALI RESTART

Jika laptop/terminal di-restart, lakukan ini:

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev

# Terminal 3
ngrok http 5002
# ⚠️ Ngrok URL AKAN BERUBAH!

# Setelah dapat URL baru:
# Update frontend/.env dengan URL baru
# Reload Terminal 2 (Ctrl+C + npm run dev)
```

---

## 🌐 AKSES POINT

| Akses Dari | URL |
|-----------|-----|
| Laptop Lokal | `http://localhost:5173` |
| Phone/Device (WiFi Sama) | `http://192.168.1.XXX:5173` |
| Mana Saja (Internet) | `https://xxxx-xxx-xxx.ngrok-free.app` |
| Monitor Ngrok | `http://127.0.0.1:4040` |

---

## ✨ SELESAI!

Sekarang aplikasi Anda bisa:
✅ Diakses dari lokal
✅ Diakses dari internet
✅ Dibagikan ke team untuk testing
✅ Siap untuk production deployment

---

## 📚 FILE REFERENCE

Jika ada pertanyaan, baca file ini:

1. **PANDUAN_NGROK_DEPLOY.md** - Panduan lengkap & detail
2. **UPDATE_API_URL_NGROK.md** - Cara update API URL
3. **ENV_SETUP_GUIDE.md** - Environment variables setup  
4. **NGROK_COMMANDS_REFERENCE.md** - Daftar commands & troubleshooting
5. **QUICK_START_NGROK.bat** - Script automation (double-click)

---

**Good luck! Semoga berhasil! 🚀**

Pertanyaan? Baca file yang tercantum di atas atau cek:
- https://ngrok.com/docs
- https://vitejs.dev/guide/env-and-mode.html
