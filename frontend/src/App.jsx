import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Konteks Provider
import { GameProvider, GameContext } from './context/GameContext';

// Import Halaman
import RegisterSiswa from './pages/RegisterSiswa';
import DashboardLevel from './pages/DashboardLevel';
import GameLevel from './pages/GameLevel';
import Leaderboard from './pages/Leaderboard';
import LoginGuru from './pages/LoginGuru';
import DashboardGuru from './pages/DashboardGuru';

// Helper ScrollToTop
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// ─── Feature card data ───────────────────────────────────────────────────────
const FEATURES = [
  { icon: '🧩', label: 'Klasifikasi',   color: '#8b5cf6', bg: '#f5f3ff' },
  { icon: '🔗', label: 'Menjodohkan',   color: '#3b82f6', bg: '#eff6ff' },
  { icon: '📋', label: 'Urutan',        color: '#f59e0b', bg: '#fffbeb' },
  { icon: '🎯', label: 'Pilihan Ganda', color: '#10b981', bg: '#f0fdf4' },
  { icon: '✅', label: 'Benar / Salah', color: '#06b6d4', bg: '#ecfeff' },
];

// ─── Floating particle component ─────────────────────────────────────────────
function Particle({ x, y, size, color, delay }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: color, opacity: 0.35 }}
      animate={{ y: [0, -20, 0], opacity: [0.35, 0.6, 0.35], scale: [1, 1.2, 1] }}
      transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  );
}

// ─── Logo component ───────────────────────────────────────────────────────────
function AnimatedLogo({ size = 120 }) {
  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      {/* Outer slow ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        className="absolute rounded-[30%] border-2 border-dashed border-sky-300/50"
        style={{ inset: -size * 0.12 }}
      />
      {/* Middle ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute rounded-[30%] border border-amber-300/35"
        style={{ inset: -size * 0.22 }}
      />
      {/* Logo box */}
      <div
        className="absolute inset-0 rounded-[30%] flex flex-col items-center justify-center text-white select-none"
        style={{
          background: 'linear-gradient(135deg, #38bdf8 0%, #3b82f6 55%, #06b6d4 100%)',
          boxShadow: '0 16px 56px rgba(56,189,248,0.55), 0 0 0 1px rgba(255,255,255,0.25) inset',
        }}
      >
        <span className="font-black leading-none tracking-tighter" style={{ fontSize: size * 0.38 }}>VN</span>
        <span
          className="font-black tracking-[0.22em] opacity-85 border-t border-white/25 pt-0.5 mt-0.5"
          style={{ fontSize: size * 0.1 }}
        >CITY</span>
      </div>
      {/* Pulse glow */}
      <div
        className="absolute inset-0 rounded-[30%] animate-ping opacity-[0.08]"
        style={{ background: 'linear-gradient(135deg, #38bdf8, #3b82f6)', animationDuration: '3.5s' }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  WELCOME SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function WelcomeScreen() {
  const navigate = useNavigate();
  const { student, loading } = React.useContext(GameContext);

  // Floating particles config
  const particles = [
    { x: 8,  y: 15, size: 10, color: '#38bdf8', delay: 0 },
    { x: 18, y: 65, size: 7,  color: '#fbbf24', delay: 1 },
    { x: 88, y: 25, size: 8,  color: '#a78bfa', delay: 0.5 },
    { x: 80, y: 70, size: 12, color: '#34d399', delay: 1.8 },
    { x: 50, y: 88, size: 6,  color: '#f472b6', delay: 0.8 },
    { x: 35, y: 10, size: 9,  color: '#60a5fa', delay: 2 },
  ];

  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
  const fadeUp  = {
    hidden:  { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="min-h-screen city-bg relative overflow-x-hidden font-sans">

      {/* ── Ambient background blobs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.2) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-32 -right-32 w-[450px] h-[450px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%)' }} />
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => <Particle key={i} {...p} />)}
      </div>

      {/* ── TOP NAVBAR ── */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-20 flex items-center justify-between px-6 sm:px-10 pt-5 pb-3"
      >
        {/* Nav Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black"
            style={{ background: 'linear-gradient(135deg, #38bdf8, #3b82f6)', boxShadow: '0 4px 12px rgba(56,189,248,0.4)' }}>
            VN
          </div>
          <span className="font-black text-stone-700 text-sm tracking-wide hidden sm:block">Von Neumann City</span>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/login-guru')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-stone-600 border border-stone-200/80 transition-all"
            style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)' }}
          >
            🏫 <span>Portal Guru</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => navigate(student ? '/dashboard' : '/register')}
            className="px-4 py-2 rounded-xl text-xs font-black text-white"
            style={{ background: 'linear-gradient(135deg, #38bdf8, #3b82f6)', boxShadow: '0 4px 14px rgba(56,189,248,0.4)' }}
          >
            {loading ? '...' : student ? 'Dashboard' : 'Mulai →'}
          </motion.button>
        </div>
      </motion.nav>

      {/* ── MAIN HERO ── */}
      <div className="relative z-10 min-h-[calc(100vh-72px)] flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 py-10 lg:py-0">

          {/* 2-column layout on lg+, single column on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* ── LEFT COLUMN: Content ── */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1"
            >
              {/* Category badge */}
              <motion.div variants={fadeUp} className="mb-5">
                <span
                  className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.35em] px-4 py-2 rounded-full border"
                  style={{ color: '#0ea5e9', borderColor: 'rgba(14,165,233,0.3)', background: 'rgba(14,165,233,0.07)' }}
                >
                  ◈ Media Pembelajaran Interaktif ◈
                </span>
              </motion.div>

              {/* Main title */}
              <motion.div variants={fadeUp}>
                <h1
                  className="font-game font-black leading-[0.95] mb-3 tracking-tight"
                  style={{
                    fontSize: 'clamp(3rem, 7vw, 5.5rem)',
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 45%, #06b6d4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  VON<br />NEUMANN
                </h1>
                <h2
                  className="font-game font-black mb-5 leading-tight"
                  style={{
                    fontSize: 'clamp(1.2rem, 3.5vw, 2rem)',
                    background: 'linear-gradient(90deg, #f59e0b, #f97316)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  ── CITY QUEST ──
                </h2>
              </motion.div>

              {/* Desc */}
              <motion.p
                variants={fadeUp}
                className="text-stone-500 text-base sm:text-lg font-medium leading-relaxed max-w-md mb-1"
              >
                Jelajahi kota modern dan selesaikan misi tentang
                <strong className="text-stone-700"> arsitektur komputer</strong> &amp;
                <strong className="text-stone-700"> siklus IPO</strong>.
              </motion.p>
              <motion.p variants={fadeUp} className="font-bold text-sm mb-8" style={{ color: '#0ea5e9' }}>
                Kuasai ilmu dan jadilah penjaga kota digital! 🌆
              </motion.p>

              {/* CTA Buttons */}
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-10">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(student ? '/dashboard' : '/register')}
                  className="relative overflow-hidden px-8 py-4 font-black rounded-2xl text-base sm:text-lg font-game text-white w-full sm:w-auto"
                  style={{
                    background: 'linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%)',
                    boxShadow: '0 10px 36px rgba(56,189,248,0.45), 0 2px 8px rgba(0,0,0,0.08)',
                  }}
                >
                  <span className="relative z-10">
                    {loading ? '⏳ Loading...' : student ? '▶ LANJUTKAN MISI' : '▶ MULAI PETUALANGAN'}
                  </span>
                  {/* Shimmer */}
                  <motion.span
                    animate={{ x: ['-120%', '220%'] }}
                    transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none"
                  />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/leaderboard')}
                  className="px-6 py-4 font-bold rounded-2xl text-sm border-2 transition-all w-full sm:w-auto"
                  style={{
                    background: 'rgba(255,255,255,0.7)',
                    borderColor: 'rgba(203,213,225,0.85)',
                    color: '#475569',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                  }}
                >
                  🏆 Papan Peringkat
                </motion.button>
              </motion.div>

              {/* Stats row */}
              <motion.div variants={fadeUp} className="flex gap-6 sm:gap-8">
                {[
                  { value: '5',  label: 'Tipe Soal', color: '#0ea5e9' },
                  { value: '∞',  label: 'Level',     color: '#f59e0b' },
                  { value: '3★', label: 'Bintang',   color: '#10b981' },
                ].map((s, i) => (
                  <div key={i}>
                    <p className="text-2xl font-black leading-none mb-0.5" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* ── RIGHT COLUMN: Visual Showcase ── */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="flex flex-col items-center gap-6 order-1 lg:order-2"
            >
              {/* Big logo */}
              <AnimatedLogo size={140} />

              {/* Feature cards grid */}
              <div className="w-full max-w-sm grid grid-cols-1 gap-2.5 mt-2">
                {FEATURES.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ x: 4, scale: 1.01 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.72)',
                      borderColor: 'rgba(203,213,225,0.7)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    }}
                  >
                    {/* Icon badge */}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 shadow-sm"
                      style={{ background: f.bg, border: `1px solid ${f.color}25` }}
                    >
                      {f.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-stone-700">{f.label}</p>
                      <p className="text-[10px] text-stone-400 uppercase tracking-wider">Tipe Soal</p>
                    </div>
                    {/* Color dot */}
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: f.color }} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="relative z-10 text-center py-5 px-6 border-t"
        style={{ borderColor: 'rgba(203,213,225,0.4)', background: 'rgba(255,255,255,0.35)', backdropFilter: 'blur(8px)' }}
      >
        <p className="font-game tracking-wider text-[11px] font-bold mb-0.5" style={{ color: '#7dd3fc' }}>
          NUR KHOLIS WAKHID · 22050974075 · UNESA 2026
        </p>
        <p className="text-[11px] text-stone-400">
          S1 Pendidikan Teknologi Informasi — SMK Negeri 1 Lamongan
        </p>
      </motion.footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  404 NOT FOUND
// ═══════════════════════════════════════════════════════════════════════════════
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
        <h1 className="text-5xl md:text-6xl font-black text-sky-500 tracking-tight mb-2">404</h1>
        <h2 className="text-base md:text-xl font-bold text-stone-600 mb-6">Area Ini Belum Ada di Peta Kota!</h2>
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

// ═══════════════════════════════════════════════════════════════════════════════
//  APP ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  return (
    <GameProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/"           element={<WelcomeScreen />} />
          <Route path="/register"   element={<RegisterSiswa />} />
          <Route path="/dashboard"  element={<DashboardLevel />} />
          <Route path="/game/:level" element={<GameLevel />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/login-guru" element={<LoginGuru />} />
          <Route path="/admin"      element={<DashboardGuru />} />
          <Route path="*"           element={<NotFound />} />
        </Routes>
      </Router>
    </GameProvider>
  );
}
