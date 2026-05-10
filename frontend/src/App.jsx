import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

// Konteks Provider
import { GameProvider, GameContext } from './context/GameContext';

// Import Halaman
import RegisterSiswa from './pages/RegisterSiswa';
import DashboardLevel from './pages/DashboardLevel';
import GameLevel from './pages/GameLevel';
import Leaderboard from './pages/Leaderboard';
import LoginGuru from './pages/LoginGuru';
import DashboardGuru from './pages/DashboardGuru';
import LeaderboardGuru from './pages/LeaderboardGuru';

// Helper ScrollToTop (Memperbaiki posisi scroll saat navigasi pindah halaman)
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// --- Halaman 1: Splash / Welcome Screen ---
function WelcomeScreen() {
  const navigate = useNavigate();
  const { student, loading } = React.useContext(GameContext);

  const materials = [
    { level: 1, icon: '🏗️', title: 'Fondasi Arsitektur', desc: 'Konsep dasar sistem komputer', progress: 100 },
    { level: 2, icon: '⚙️', title: 'Prosesor & CPU', desc: 'Pemrosesan data dan instruksi', progress: 85 },
    { level: 3, icon: '💾', title: 'Memori & Storage', desc: 'Penyimpanan dan manajemen data', progress: 60 },
    { level: 4, icon: '🔌', title: 'I/O Subsystem', desc: 'Sistem input/output komputer', progress: 40 },
    { level: 5, icon: '📡', title: 'Jaringan Komputer', desc: 'Komunikasi antar sistem', progress: 20 }
  ];

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/kodomo_city_bg.png)',
          zIndex: 0
        }}
      />
      
      {/* Dark Overlay for better text readability */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/40 via-orange-900/20 to-cyan-900/30" style={{ zIndex: 1 }} />
      
      {/* Animated accent orbs */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-blue-300/15 to-orange-300/8 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-gradient-to-tl from-orange-300/12 to-blue-300/5 blur-3xl animate-pulse" style={{animationDelay:'1.5s'}} />
        <div className="absolute top-1/3 right-0 w-72 h-72 rounded-full bg-gradient-to-l from-yellow-400/8 to-transparent blur-3xl animate-pulse" style={{animationDelay:'0.7s'}} />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Section - Split Screen */}
        <div className="flex-1 flex items-stretch justify-center px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-7xl mx-auto items-center lg:items-stretch"
          >
            {/* LEFT SIDE - Info Section */}
            <div className="flex flex-col items-center lg:items-start justify-center flex-1 text-center lg:text-left w-full">
            {/* Game Logo with enhanced animation */}
            <motion.div
              initial={{ scale: 0, rotate: -20, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 150, damping: 15, delay: 0.2 }}
              className="mb-8 flex justify-center w-full"
            >
              <div className="relative flex items-center justify-center w-64 h-48">
                {/* White oval background */}
                <div className="absolute inset-0 rounded-full bg-white shadow-2xl" style={{boxShadow: '0 10px 40px rgba(0,0,0,0.2)'}} />
                
                <img 
                  src="/archilogic-logo.png" 
                  alt="ArchiLogic Logo" 
                  className="w-40 h-auto drop-shadow-2xl relative z-10"
                  style={{filter: 'drop-shadow(0 10px 25px rgba(30,144,255,0.4))'}}
                />
                <div className="absolute inset-0 rounded-full border-4 border-blue-400/40 animate-spin" style={{animationDuration:'12s'}} />
                <div className="absolute -inset-4 rounded-full border-2 border-orange-400/30 animate-spin" style={{animationDuration:'18s', animationDirection:'reverse'}} />
                <div className="absolute -inset-2 rounded-full border border-yellow-400/25 animate-pulse" style={{animationDuration:'2.5s'}} />
              </div>
            </motion.div>

            {/* Tagline with decorative lines */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6 w-full"
            >
              {/* Top decorative line */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-1 w-16 bg-gradient-to-r from-transparent to-orange-300 rounded-full"></div>
                <p className="text-orange-200 text-xs font-black tracking-[0.35em] uppercase font-game drop-shadow-lg">
                  ◆ Platform Edukasi ◆
                </p>
                <div className="h-1 w-16 bg-gradient-to-l from-transparent to-orange-300 rounded-full"></div>
              </div>
              <p className="text-orange-100 text-sm font-bold tracking-wider drop-shadow-lg mb-6 text-center">Arsitektur Komputer & Logika Sistem</p>
              <div className="space-y-3">
                <h1
                  className="font-game font-black text-white leading-tight drop-shadow-2xl text-center"
                  style={{ fontSize: 'clamp(2.8rem, 9vw, 5.5rem)', textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                >
                  ArchiLogic
                </h1>
                <h2
                  className="font-game font-bold text-orange-100 drop-shadow-lg text-center"
                  style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', textShadow: '0 3px 8px rgba(0,0,0,0.4)' }}
                >
                  ── Master The Logic ──
                </h2>
              </div>
            </motion.div>

            {/* Description with enhanced styling */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-6 w-full"
            >
              <p className="text-white text-base md:text-lg font-medium leading-relaxed drop-shadow-md mb-5 text-center" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                Kuasai logika arsitektur komputer melalui <span className="font-bold text-orange-200 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 px-2 py-1 rounded-lg">10 level tantangan interaktif</span> tentang IPO &amp; sistem komputer.
              </p>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-400 to-orange-400 rounded-full mb-5 shadow-lg mx-auto"></div>
              <p className="text-orange-100 text-base font-bold drop-shadow-lg text-center">🏆 Pahami teknologi, raih poin, dan buktikan keahlianmu!</p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full mb-6"
            >
              <motion.button
                whileHover={{ scale: 1.08, boxShadow: '0 20px 50px rgba(59,130,246,0.6)' }}
                whileTap={{ scale: 0.92 }}
                onClick={() => navigate(student ? '/dashboard' : '/register')}
                className="relative group px-12 py-4 bg-gradient-to-r from-blue-500 via-orange-500 to-yellow-500 text-white font-black rounded-2xl text-lg font-game tracking-wider shadow-xl overflow-hidden border border-white/30 w-full sm:w-auto"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative flex items-center gap-2 justify-center">
                  {loading ? '⏳ Loading...' : student ? '▶️ LANJUTKAN MISI' : '🚀 MULAI PETUALANGAN'}
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.06, boxShadow: '0 12px 30px rgba(234,88,12,0.3)' }}
                whileTap={{ scale: 0.92 }}
                onClick={() => navigate('/login-guru')}
                className="px-10 py-4 bg-white/80 backdrop-blur-md text-orange-600 font-bold rounded-2xl border-2 border-orange-200 hover:border-orange-400 hover:bg-white transition-all text-sm shadow-md font-game tracking-wide w-full sm:w-auto"
              >
                👨‍🏫 Portal Guru
              </motion.button>
            </motion.div>

            {/* Quick Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="flex flex-wrap justify-center gap-3 text-sm font-medium w-full"
            >
              <div className="bg-blue-500/80 backdrop-blur-md px-3 py-2 rounded-full border-2 border-blue-300/60 shadow-lg">
                <span className="text-white font-bold drop-shadow text-xs">📱 Responsif</span>
              </div>
              <div className="bg-orange-500/80 backdrop-blur-md px-3 py-2 rounded-full border-2 border-orange-300/60 shadow-lg">
                <span className="text-white font-bold drop-shadow text-xs">⚡ Cepat</span>
              </div>
              <div className="bg-yellow-500/80 backdrop-blur-md px-3 py-2 rounded-full border-2 border-yellow-300/60 shadow-lg">
                <span className="text-white font-bold drop-shadow text-xs">🎯 Edukatif</span>
              </div>
            </motion.div>
            </div>

            {/* RIGHT SIDE - Course Materials Preview */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex-1 w-full lg:w-auto flex flex-col"
            >
              {/* Section header with decorative elements */}
              <div className="mb-6 w-full">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="text-3xl drop-shadow-lg">📚</span>
                  <h3 className="text-2xl font-black text-white drop-shadow-lg">Materi Pembelajaran</h3>
                </div>
                <p className="text-orange-100 text-xs md:text-sm font-bold text-center tracking-wide">5 Modul Utama Arsitektur Komputer</p>
              </div>
              
              <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                {materials.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + i * 0.1 }}
                    whileHover={{ x: 5, boxShadow: '0 15px 40px rgba(234,88,12,0.3)' }}
                    className="group relative bg-white/90 backdrop-blur-lg rounded-xl overflow-hidden border-2 border-orange-200/70 shadow-lg hover:shadow-xl transition-all duration-300 p-4"
                  >
                    {/* Icon background gradient */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-yellow-400/10 rounded-full blur-2xl group-hover:from-orange-400/25 group-hover:to-yellow-400/15 transition-all" />
                    
                    <div className="relative z-10">
                      {/* Header with icon */}
                      <div className="mb-3">
                        <div className="text-3xl drop-shadow-lg">{m.icon}</div>
                      </div>
                      
                      {/* Title */}
                      <h4 className="text-sm font-black text-orange-700 leading-tight mb-2 group-hover:text-orange-600 transition-colors">{m.title}</h4>
                      
                      {/* Description */}
                      <p className="text-xs text-orange-600 font-medium leading-relaxed">{m.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer */}

      </div>
    </div>
  );
}

// 404 Not Found Page (Kodomo City Style)
function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-sans city-bg">

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 text-center p-8 lg:p-12 glass rounded-3xl shadow-xl max-w-xl mx-4"
      >
        <div className="text-7xl mb-6 text-sky-300 font-bold">?</div>
        <h1 className="text-5xl md:text-6xl font-black text-sky-500 tracking-tight mb-2">
          404
        </h1>
        <h2 className="text-base md:text-xl font-bold text-stone-600 mb-6">
          Area Ini Belum Ada di Peta Kota!
        </h2>
        <p className="text-stone-500 mb-10 max-w-md mx-auto leading-relaxed text-sm md:text-base">
          Sepertinya lokasi yang kamu tuju belum dibangun di kota digital ini. Yuk kembali ke pusat kota!
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-gradient-to-r from-sky-400 to-blue-500 text-white font-bold rounded-2xl tracking-wide transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
        >
          ← Kembali ke Kota
        </button>
      </motion.div>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<WelcomeScreen />} />
          
          {/* Area Registrasi & Dashboard Siswa */}
          <Route path="/register" element={<RegisterSiswa />} />
          <Route path="/dashboard" element={<DashboardLevel />} />
          
          {/* Alur Game Utama */}
          <Route path="/game/:level" element={<GameLevel />} />
          {/* Papan Peringkat Live */}
          <Route path="/leaderboard" element={<Leaderboard />} />
          
          {/* Area Guru */}
          <Route path="/login-guru" element={<LoginGuru />} />
          <Route path="/admin" element={<DashboardGuru />} />
          <Route path="/admin/leaderboard" element={<LeaderboardGuru />} />

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </GameProvider>
  );
}
