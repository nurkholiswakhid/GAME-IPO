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

  return (
    <div className="min-h-screen flex items-center justify-center city-bg">

      {/* Floating cloud orbs */}
      <div className="fixed top-1/5 left-1/4 w-80 h-80 rounded-full bg-white/20 blur-3xl animate-pulse pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-sky-200/20 blur-3xl animate-pulse pointer-events-none" style={{animationDelay:'1.2s'}} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="relative z-10 text-center px-6 max-w-3xl mx-auto"
      >
        {/* Game Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.2 }}
          className="mb-8 flex justify-center"
        >
          <div className="relative">
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-sky-400 via-blue-400 to-cyan-400 flex flex-col items-center justify-center shadow-xl text-white" style={{boxShadow:'0 8px 32px rgba(135,206,235,0.6)'}}>
              <span className="text-5xl font-black leading-none tracking-tighter drop-shadow-sm">VN</span>
              <span className="text-[10px] font-bold tracking-[0.2em] leading-none mt-1 opacity-90 border-t border-white/40 pt-1 mt-1">CITY</span>
            </div>
            <div className="absolute inset-0 rounded-3xl border-4 border-sky-300/50 animate-spin" style={{animationDuration:'10s'}} />
            <div className="absolute -inset-3 rounded-3xl border-2 border-amber-300/30 animate-spin" style={{animationDuration:'14s', animationDirection:'reverse'}} />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <p className="text-sky-500 text-xs font-black tracking-[0.4em] uppercase mb-3 font-game">
            ◈ Media Pembelajaran Interaktif ◈
          </p>
          <h1
            className="font-game font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 leading-none mb-2"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}
          >
            VON NEUMANN
          </h1>
          <h2
            className="font-game font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-400 mb-6"
            style={{ fontSize: 'clamp(1.2rem, 4vw, 2rem)' }}
          >
            ── CITY QUEST ──
          </h2>
          <p className="text-stone-600 text-base md:text-lg font-medium leading-relaxed max-w-xl mx-auto mb-10">
            Jelajahi kota modern dan selesaikan 10 misi tentang arsitektur komputer &amp; siklus IPO.<br/>
            <span className="text-sky-600 font-bold">Kuasai ilmu dan jadilah penjaga kota digital!</span>
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.06, boxShadow: '0 8px 32px rgba(135,206,235,0.7)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(student ? '/dashboard' : '/register')}
            className="relative px-10 py-4 bg-gradient-to-r from-sky-400 to-blue-500 text-white font-black rounded-2xl text-lg font-game tracking-wide shadow-xl overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
            {loading ? '...' : student ? '▶ LANJUTKAN MISI' : '▶ MULAI PETUALANGAN'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login-guru')}
            className="px-8 py-4 glass text-stone-700 font-bold rounded-2xl hover:bg-white/90 transition-all text-sm shadow-sm border border-white/70"
          >
            Portal Guru
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="mt-16 pt-6 border-t border-stone-200/60 text-xs text-stone-500 font-medium">
          <p className="font-game tracking-wider text-sky-500/80 mb-1">NUR KHOLIS WAKHID · 22050974075 · UNESA 2026</p>
          <p>S1 Pendidikan Teknologi Informasi — SMK Negeri 1 Lamongan</p>
        </motion.div>
      </motion.div>
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

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </GameProvider>
  );
}
