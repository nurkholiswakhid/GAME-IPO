# 🎬 NGROK DEPLOY - COMMAND REFERENCE & DIAGRAMS

## 📊 ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR COMPUTER                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐      ┌──────────────┐                   │
│  │  Terminal 1  │      │  Terminal 2  │    Terminal 3     │
│  │  Backend     │      │  Frontend    │    (Ngrok)        │
│  │  Port 5002   │      │  Port 5173   │    Port 4040      │
│  └──────────────┘      └──────────────┘    (Monitor)      │
│        ▲                      ▲                             │
│        │                      │                             │
│        └──────────┬───────────┘                             │
│                   │                                         │
│           HTTP: localhost                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                          │
                 ┌─────────▼─────────┐
                 │  NGROK TUNNEL     │
                 │  (Expose 5002)    │
                 └─────────┬─────────┘
                          │
                 HTTPS Public URL
    https://xxxx-xxx-xxx-xxx.ngrok-free.app
                          │
         ┌────────────────┴────────────────┐
         ▼                                  ▼
    ┌────────────┐                   ┌─────────────┐
    │   Phone    │                   │  Laptop     │
    │  (WiFi)    │                   │ (Internet)  │
    └────────────┘                   └─────────────┘

    AKSES:
    - Lokal: http://localhost:5173
    - Internet: https://xxxx-xxx-xxx-xxx.ngrok-free.app
```

---

## 📋 COMMAND QUICK REFERENCE

### 1️⃣ INSTALL & SETUP NGROK

```bash
# Download from https://ngrok.com/download
# Or install via package manager

# Windows (Chocolatey)
choco install ngrok

# Or npm
npm install -g ngrok

# Setup auth token (dari ngrok dashboard)
ngrok config add-authtoken YOUR_TOKEN_HERE

# Verify installation
ngrok version
```

---

### 2️⃣ PROJECT SETUP

```bash
# Backend setup
cd backend
npm install
npx prisma generate
npx prisma migrate dev

# Frontend setup
cd frontend
npm install
```

---

### 3️⃣ START SERVICES (3 TERMINALS)

#### Terminal 1 - Backend
```bash
cd backend
npm run dev

# Output:
# Server is running on port 5002
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev

# Output:
# ➜  Local:   http://localhost:5173/
# ➜  press h to show help
```

#### Terminal 3 - Ngrok
```bash
ngrok http 5002

# Output:
# Forwarding    https://xxxx-xxx-xxx-xxx.ngrok-free.app -> http://localhost:5002
# Forwarding    http://xxxx-xxx-xxx-xxx.ngrok-free.app  -> http://localhost:5002
```

---

### 4️⃣ UPDATE FRONTEND ENV & RELOAD

```bash
# Edit frontend/.env
# OLD: VITE_API_URL=http://localhost:5002
# NEW: VITE_API_URL=https://xxxx-xxx-xxx-xxx.ngrok-free.app

# Reload frontend (Ctrl+C then restart)
cd frontend
npm run dev
```

---

### 5️⃣ TEST & VERIFY

```bash
# Terminal 4 - Test health check
curl https://xxxx-xxx-xxx-xxx.ngrok-free.app/api/health

# Or open in browser:
# https://xxxx-xxx-xxx-xxx.ngrok-free.app/api/health
```

---

## 🔗 URLS & PORTS

| Component | Local URL | Public URL |
|-----------|-----------|-----------|
| Frontend | http://localhost:5173 | https://ngrok-url.app |
| Backend API | http://localhost:5002 | https://ngrok-url.app (via tunnel) |
| Backend Health | http://localhost:5002/api/health | https://ngrok-url.app/api/health |
| Ngrok Dashboard | http://127.0.0.1:4040 | N/A (local only) |

---

## 🚨 ERROR HANDLING

### ❌ Error: "Port 5002 already in use"
```bash
# Find what's using port 5002
netstat -ano | findstr :5002

# Kill it
taskkill /PID [PID_NUMBER] /F

# Or change PORT in backend/.env
PORT=5003
```

### ❌ Error: "command not found: ngrok"
```bash
# Make sure ngrok is in PATH
# If installed from .zip:
C:\ngrok\ngrok.exe http 5002

# Or add to PATH via System Environment Variables
```

### ❌ Error: "ECONNREFUSED - Backend not responding"
```bash
# Make sure Terminal 1 is running backend
# Check if it shows: "Server is running on port 5002"

# If not, check logs and restart
cd backend
npm run dev
```

### ❌ Error: "CORS Error from frontend"
```bash
# This shouldn't happen, CORS already enabled in backend
# But if it does, restart backend:
# Ctrl+C in Terminal 1, then npm run dev
```

---

## 📱 TESTING CHECKLIST

### Local Testing (Same Computer)
- [ ] Backend running: `curl http://localhost:5002/api/health`
- [ ] Frontend running: `http://localhost:5173` in browser
- [ ] Can login successfully
- [ ] Can load dashboard/questions
- [ ] No console errors (F12 → Console)

### Local Testing (Different Device, Same WiFi)
- [ ] Get your computer IP: `ipconfig` (look for IPv4 Address)
- [ ] Open: `http://[YOUR_IP]:5173` on other device
- [ ] Should work if on same WiFi

### Internet Testing (Using Ngrok)
- [ ] Ngrok running: Check Terminal 3
- [ ] Get ngrok URL: `https://xxxx-xxx-xxx.ngrok-free.app`
- [ ] Frontend .env updated with ngrok URL
- [ ] Frontend restarted after .env change
- [ ] Open ngrok URL in browser
- [ ] Test login & basic features
- [ ] Check Ngrok Dashboard: `http://127.0.0.1:4040`

---

## 💡 TIPS & TRICKS

### 1. Keep Ngrok URL Permanent (for team)
- Upgrade to Ngrok Pro/Enterprise
- Or use permanent hosting instead (Railway, Vercel)

### 2. Monitor Real-time Requests
```bash
# Open Ngrok Dashboard in browser
http://127.0.0.1:4040

# Shows all requests/responses
# Useful for debugging API issues
```

### 3. Share Ngrok URL with Team
```bash
# Just share the URL:
https://xxxx-xxx-xxx-xxx.ngrok-free.app

# Team can test from any device with internet
# No need to be on same WiFi
```

### 4. Disable Browser Warning (Already Done)
Backend already has header:
```javascript
allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning']
```

### 5. Use Multiple Ngrok Terminals for Different Ports
```bash
# Terminal 3a - Expose backend
ngrok http 5002 --subdomain=myapp-backend

# Terminal 3b - Expose frontend (if needed)
ngrok http 5173 --subdomain=myapp-frontend
```

---

## 📚 USEFUL COMMANDS

```bash
# View Ngrok configuration
ngrok config

# List active tunnels
ngrok inspect

# Start with specific subdomain (paid)
ngrok http 5002 --subdomain=myapp

# Start with auth token in command
ngrok http 5002 --authtoken=YOUR_TOKEN

# View traffic (real-time)
ngrok http 5002 -log-format=json

# Increase request timeout
ngrok http 5002 --bind-tls=true

# Check Ngrok version
ngrok version

# Update Ngrok
ngrok update
```

---

## 🔐 SECURITY NOTES

⚠️ **Important for Production:**

- Ngrok URLs are public - anyone with URL can access
- Use for testing/staging ONLY
- For production: Use proper hosting (Railway, AWS, GCP, Azure)
- Don't expose sensitive data via Ngrok public URLs
- Set rate limiting if needed (Ngrok Pro feature)

✅ **For Development:**
- Ngrok is perfect for team testing
- Great for mobile app testing
- Easy to share with stakeholders
- No need for public IP on your router

---

## 📞 TROUBLESHOOTING FLOW

```
Error occurred?
       ↓
Check which terminal has error
       ↓
┌──────────┬──────────────┬──────────┐
│          │              │          │
▼          ▼              ▼          ▼
Backend  Frontend      Ngrok      Internet
│          │              │          │
Check:   Check:         Check:     Check:
- Port   - npm run   - ngrok     - .env
- npm    - hot       - auth      - URL
- env    - console   - port      - CORS
- db        err      - running
│          │              │          │
└──────────┴──────────────┴──────────┘
       ↓
    Restart
       ↓
    Retry
       ↓
   Success! ✅
```

---

## ✅ FINAL CHECKLIST

Before considering deployment ready:

- [ ] All 3 terminals running without errors
- [ ] ngrok URL working in browser
- [ ] Login works
- [ ] Can load data from database
- [ ] Socket.io real-time updates working (if used)
- [ ] No CORS errors
- [ ] No 404 errors
- [ ] Mobile access via internet works
- [ ] Ngrok dashboard shows green status
- [ ] Can access from different network (mobile hotspot)

---

## 🎓 NEXT STEPS

After successful Ngrok testing:

1. **Share with Team**
   - Send ngrok URL to QA team
   - Test on multiple devices
   - Gather feedback

2. **Fix Issues Found**
   - Debug based on feedback
   - Iterate quickly

3. **Prepare for Production**
   - Switch to Railway/Vercel
   - Set up proper CI/CD
   - Configure domain & SSL
   - Set up monitoring

---

**Happy Testing! 🚀**
