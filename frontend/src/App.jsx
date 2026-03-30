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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Starfield BG */}
      <div className="stars-bg" />
      <div className="scanlines" />

      {/* Animated orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-600/15 blur-3xl animate-pulse pointer-events-none" style={{animationDelay:'1s'}} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-900/10 blur-3xl pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative z-10 text-center px-6 max-w-3xl mx-auto"
      >
        {/* Game Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 150, damping: 15, delay: 0.2 }}
          className="mb-8 flex justify-center"
        >
          <div className="relative">
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 flex items-center justify-center text-6xl shadow-2xl glow-indigo">
              🖥️
            </div>
            {/* Orbiting ring */}
            <div className="absolute inset-0 rounded-3xl border-2 border-indigo-400/40 animate-spin" style={{animationDuration:'8s'}} />
            <div className="absolute -inset-3 rounded-3xl border border-indigo-500/20 animate-spin" style={{animationDuration:'12s', animationDirection:'reverse'}} />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <p className="text-indigo-400/80 text-xs font-black tracking-[0.5em] uppercase mb-3 font-game">
            ◈ Media Pembelajaran Interaktif ◈
          </p>
          <h1 className="font-game font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-200 to-purple-300 leading-none mb-2"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', textShadow: '0 0 60px rgba(99,102,241,0.5)' }}>
            VON NEUMANN
          </h1>
          <h2 className="font-game font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 text-glow-amber mb-6"
            style={{ fontSize: 'clamp(1.2rem, 4vw, 2rem)' }}>
            ── QUEST ──
          </h2>
          <p className="text-slate-400 text-base md:text-lg font-medium leading-relaxed max-w-xl mx-auto mb-10">
            Selesaikan 10 misi epik tentang arsitektur komputer &amp; siklus IPO.<br/>
            <span className="text-indigo-300">Buktikan dirimu sebagai ahli teknologi!</span>
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.06, boxShadow: '0 0 40px rgba(99,102,241,0.7)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(student ? '/dashboard' : '/register')}
            className="relative px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-2xl text-lg font-game tracking-wide shadow-xl overflow-hidden glow-indigo"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
            {loading ? '...' : student ? '▶ LANJUTKAN MISI' : '▶ MULAI PETUALANGAN'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login-guru')}
            className="px-8 py-4 glass border border-white/20 text-slate-300 font-bold rounded-2xl hover:border-indigo-400/60 hover:text-white transition-all text-sm"
          >
            🎓 Portal Guru
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="mt-16 pt-6 border-t border-white/10 text-xs text-slate-500 font-medium">
          <p className="font-game tracking-wider text-indigo-400/60 mb-1">NUR KHOLIS WAKHID · 22050974075 · UNESA 2026</p>
          <p>S1 Pendidikan Teknologi Informasi — SMK Negeri 1 Lamongan</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

// 404 Not Found Page (Sistem Cyberpunk)
function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center font-mono bg-[#020617] text-white">
      {/* Background terminal noise */}
      <div className="scanlines" />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, white 2px, white 4px)' }} />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/90" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="relative z-10 text-center p-8 lg:p-12 border border-rose-500/30 hover:border-rose-500/60 rounded-3xl bg-black/60 backdrop-blur-xl shadow-[0_0_50px_rgba(244,63,94,0.15)] transition-all max-w-xl mx-4"
      >
        <div className="text-6xl mb-6 text-rose-500 animate-pulse drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]">⚠️</div>
        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-600 tracking-[0.2em] mb-2 drop-shadow-lg">
          404_ERROR
        </h1>
        <h2 className="text-base md:text-xl font-bold text-rose-300/80 tracking-widest uppercase mb-8">
          DIRECTORY_NOT_FOUND
        </h2>
        <p className="text-white/60 mb-10 max-w-md mx-auto leading-relaxed text-sm md:text-base">
          Route yang Anda cari tidak ada dalam memori server. Kemungkinan path telah terhapus, korup, atau tautan tidak valid.
        </p>
        <button 
          onClick={() => navigate('/')} 
          className="group relative px-8 py-4 bg-rose-950/40 border border-rose-500/50 text-rose-300 hover:bg-rose-500/20 hover:border-rose-400 hover:text-white font-bold rounded-xl tracking-widest uppercase transition-all overflow-hidden shadow-lg"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> INITIALIZE_REBOOT
          </span>
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
