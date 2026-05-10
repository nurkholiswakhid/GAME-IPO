# ⚙️ ENVIRONMENT VARIABLES SETUP

## 📍 Backend Configuration

### File: `backend/.env`

```env
# Database Configuration
DATABASE_URL="file:./dev.db"

# Server Port
PORT=5002

# JWT Secret (untuk authentication)
JWT_SECRET="rahasia_gamifikasi_ipo"
```

---

## 🌐 Frontend Configuration

### File: `frontend/.env`

```env
# Development (Default)
VITE_API_URL=http://localhost:5002
```

### File: `frontend/.env.ngrok`

```env
# Untuk testing dengan ngrok
VITE_API_URL=https://xxxx-xxx-xxx-xxx.ngrok-free.app
```

---

## 🚀 CARA MENGGUNAKAN

### 1. DEVELOPMENT (Lokal)
```bash
# Terminal 1: Backend
cd backend
npm run dev
# Output: Server is running on port 5002

# Terminal 2: Frontend
cd frontend
npm run dev
# Output: http://localhost:5173

# Akses: http://localhost:5173
```

### 2. TESTING DENGAN NGROK

#### Terminal 1: Backend
```bash
cd backend
npm run dev
```

#### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

#### Terminal 3: Ngrok
```bash
ngrok http 5002
```

Output:
```
Forwarding    https://xxxx-xxx-xxx-xxx.ngrok-free.app -> http://localhost:5002
```

#### Terminal 4 (atau buka .env): Update Frontend URL

**Edit `frontend/.env`:**
```env
VITE_API_URL=https://xxxx-xxx-xxx-xxx.ngrok-free.app
```

#### Refresh Frontend (Terminal 2)
```
Ctrl + C
npm run dev
```

#### Test
- Local: `http://localhost:5173`
- Internet: `https://xxxx-xxx-xxx-xxx.ngrok-free.app`

---

## 🔍 VERIFIKASI SETUP

### Check Backend Health
```bash
# Local
curl http://localhost:5002/api/health

# Via Ngrok
curl https://xxxx-xxx-xxx-xxx.ngrok-free.app/api/health
```

Expected response:
```json
{"status":"Server is running"}
```

---

## 📋 PORT REFERENCE

| Service | Local Port | Ngrok URL |
|---------|-----------|-----------|
| Backend | 5002 | https://xxxx-xxx.ngrok-free.app |
| Frontend | 5173 | https://xxxx-xxx.ngrok-free.app (via ngrok backend) |
| Ngrok UI | 4040 | http://127.0.0.1:4040 |

---

## ⚠️ IMPORTANT NOTES

1. **Port Mismatch**: Pastikan port konsisten
   - Backend: 5002
   - Frontend API URL harus ke port 5002
   - Ngrok expose port 5002

2. **Ngrok URL Berubah**: Setiap kali restart, URL ngrok berubah
   - Update `frontend/.env` dengan URL baru

3. **CORS**: Backend sudah enable CORS untuk semua origin
   - Sudah support header `ngrok-skip-browser-warning`

4. **JWT Secret**: Sudah di-set, don't change untuk consistency

---

## 🛠️ TROUBLESHOOTING

### Port 5002 sudah terpakai?

**Find process:**
```bash
netstat -ano | findstr :5002
```

**Kill process:**
```bash
taskkill /PID <PID> /F
```

**Atau ubah PORT di `.env`:**
```env
PORT=5003
# Dan update frontend/.env:
VITE_API_URL=http://localhost:5003
```

---

## ✅ CHECKLIST

Sebelum deploy:
- [ ] Backend .env sudah ada
- [ ] Frontend .env sudah ada
- [ ] Port 5002 tidak terpakai
- [ ] Node modules installed (`npm install`)
- [ ] Database sudah di-setup (`npx prisma migrate dev`)

Saat ngrok:
- [ ] Backend berjalan
- [ ] Frontend berjalan
- [ ] Ngrok expose port 5002
- [ ] Frontend .env updated dengan ngrok URL
- [ ] Test dari browser berjalan
- [ ] Check ngrok dashboard di http://127.0.0.1:4040

---

**Status: ✅ Ready to Deploy!**
