# 🚀 DEPLOYMENT RAILWAY GUIDE

## Prasyarat
- [ ] GitHub account
- [ ] Railway account (https://railway.app)
- [ ] Project sudah di-push ke GitHub

## Step 1: Push Project ke GitHub

```bash
git init
git add .
git commit -m "Initial commit for Railway deployment"
git remote add origin https://github.com/YOUR_USERNAME/gemeweb.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend ke Railway

1. **Buka https://railway.app/dashboard**
2. Klik **"New Project"**
3. Pilih **"Deploy from GitHub repo"**
4. Authorize GitHub dan pilih repository `gemeweb`
5. Pilih **folder `backend`** sebagai root directory
6. Railway akan auto-detect Node.js

### Environment Variables (Backend)
Setelah project tercreate, tambahkan ini di Railway:
```
PORT=3001
NODE_ENV=production
DATABASE_URL=file:./prisma/dev.db
```

### Connect Domain (opsional)
Railway akan kasih URL seperti: `https://gemeweb-backend.up.railway.app`

---

## Step 3: Deploy Frontend ke Railway

1. **Buat project baru** atau **dalam project yang sama**
2. Klik **"Add Service"**
3. Pilih **"Deploy from GitHub repo"**
4. Pilih repository yang sama
5. Pilih **folder `frontend`** sebagai root directory

### Build Command (Frontend)
- **Build Command**: `npm run build`
- **Start Command**: `npm run preview`

### Environment Variables (Frontend)
```
VITE_API_URL=https://gemeweb-backend.up.railway.app
```

---

## Step 4: Update API URL di Frontend

Edit [frontend/src/main.jsx](frontend/src/main.jsx):

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

---

## Alternative: Deploy SEMUANYA di 1 Project Railway

Jika ingin lebih sederhana, buat **root-level railway.json**:

```json
{
  "services": [
    {
      "name": "backend",
      "source": "./backend",
      "buildCommand": "npm install && npx prisma generate",
      "startCommand": "npm start"
    },
    {
      "name": "frontend", 
      "source": "./frontend",
      "buildCommand": "npm install && npm run build",
      "startCommand": "npm run preview"
    }
  ]
}
```

---

## Troubleshooting

### ❌ Build gagal
- Pastikan `package.json` di folder backend dan frontend valid
- Cek logs di Railway dashboard

### ❌ Database tidak persist
SQLite di Railway tidak persistent karena ephemeral storage. **Solusi:**
- Upgrade ke **PostgreSQL** di Railway (free tier tersedia)
- Update `schema.prisma`: `provider = "postgresql"`

### ❌ Frontend tidak connect ke Backend
- Pastikan `VITE_API_URL` benar
- Check CORS di backend (`cors: { origin: '*' }`)

---

## Estimasi Waktu
- ⏱️ Setup: **5-10 menit**
- ⏱️ Deploy: **2-3 menit per project**
- ⏱️ Total: **15 menit**

---

## Hasil Akhir
- Frontend: `https://[project-name]-frontend.up.railway.app`
- Backend: `https://[project-name]-backend.up.railway.app`
- Database: SQLite (atau PostgreSQL jika upgrade)

---

**Siap deploy? Follow langkah di atas! 🎉**
