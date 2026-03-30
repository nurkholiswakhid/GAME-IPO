import React, { useContext, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';

const LEVEL_META = {
  1:  { icon: '🖥️', name: 'Lab Komputer',    color: 'from-sky-500 to-indigo-600',     glow: 'rgba(99,102,241,0.6)',  mechanic: 'KLASIFIKASI' },
  2:  { icon: '⚙️', name: 'Ruang Server',    color: 'from-violet-500 to-purple-700',  glow: 'rgba(139,92,246,0.6)', mechanic: 'URUTAN' },
  3:  { icon: '💼', name: 'Kantor IT',        color: 'from-amber-400 to-orange-600',   glow: 'rgba(251,146,60,0.6)', mechanic: 'ANALISIS' },
  4:  { icon: '🏠', name: 'Rumah Pengguna',   color: 'from-rose-500 to-red-700',       glow: 'rgba(239,68,68,0.6)',  mechanic: 'BENAR/SALAH' },
  5:  { icon: '🏭', name: 'Data Center',      color: 'from-emerald-400 to-teal-600',   glow: 'rgba(52,211,153,0.6)', mechanic: 'MENJODOHKAN' },
  6:  { icon: '🗄️', name: 'Ruang Storage',   color: 'from-cyan-400 to-blue-600',      glow: 'rgba(34,211,238,0.6)', mechanic: 'KLASIFIKASI' },
  7:  { icon: '🎓', name: 'Kelas SMK',        color: 'from-fuchsia-400 to-pink-600',   glow: 'rgba(232,121,249,0.6)',mechanic: 'URUTAN' },
  8:  { icon: '🔬', name: 'Lab Riset CPU',    color: 'from-blue-400 to-indigo-600',    glow: 'rgba(96,165,250,0.6)', mechanic: 'ANALISIS' },
  9:  { icon: '📚', name: 'Perpustakaan',     color: 'from-slate-400 to-slate-600',    glow: 'rgba(148,163,184,0.6)',mechanic: 'BENAR/SALAH' },
  10: { icon: '🔥', name: 'FINAL BOSS',       color: 'from-orange-500 to-red-700',     glow: 'rgba(239,68,68,0.8)',  mechanic: 'MENJODOHKAN' },
};

// XP progression — setiap level memberi +10 XP dari total 100
const MAX_XP = 100;

export default function DashboardLevel() {
  const { student, loading, logoutStudent } = useContext(GameContext);
  const navigate = useNavigate();
  const [hoveredLevel, setHoveredLevel] = useState(null);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-center text-white">
        <div className="text-5xl mb-4 animate-bounce">🎮</div>
        <p className="font-game text-indigo-400 text-sm tracking-widest animate-pulse">MEMUAT DATA HERO...</p>
      </div>
    </div>
  );
  if (!student) return <Navigate to="/register" replace />;

  const getLevelStatus = (n) => {
    const cur = student.level_results?.find(r => r.level_number === n);
    if (cur?.is_complete) return 'COMPLETED';
    if (n === 1) return 'UNLOCKED';
    const prev = student.level_results?.find(r => r.level_number === n - 1);
    if (prev?.is_complete) return 'UNLOCKED';
    return 'LOCKED';
  };
  const getStars = (n) => student.level_results?.find(r => r.level_number === n)?.bintang || 0;

  const completedCount = [...Array(10)].filter((_, i) => getLevelStatus(i + 1) === 'COMPLETED').length;
  const xp = completedCount * 10;
  const heroLevel = Math.max(1, Math.ceil(completedCount / 2));

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* BG Stars */}
      <div className="stars-bg" />
      <div className="scanlines" />

      {/* Ambient Color Blobs */}
      <div className="fixed top-10 left-10 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-6">

        {/* ── HERO CARD / PLAYER HUD ── */}
        <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="glass rounded-3xl p-5 md:p-6 mb-8 border border-indigo-500/20 glow-indigo">
          <div className="flex flex-col sm:flex-row items-center gap-5">

            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-black shadow-xl glow-indigo">
                {student.name.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-amber-500 text-black text-xs font-black px-2 py-0.5 rounded-lg font-game shadow">
                LV{heroLevel}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <div>
                  <h1 className="text-2xl font-black text-glow-white">{student.name}</h1>
                  <p className="text-slate-400 text-xs font-mono">ABSEN #{student.absen} · SESSION {student.session_id.slice(0,8).toUpperCase()}</p>
                </div>
                <div className="flex gap-3">
                  <div className="glass px-4 py-2 rounded-xl text-center border border-blue-500/30">
                    <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest">POIN</p>
                    <p className="text-xl font-black text-blue-300 font-game">{student.total_poin}</p>
                  </div>
                  <div className="glass px-4 py-2 rounded-xl text-center border border-amber-500/30">
                    <p className="text-[10px] text-amber-400 font-black uppercase tracking-widest">BINTANG</p>
                    <p className="text-xl font-black text-amber-300 text-glow-amber font-game">★ {student.total_bintang}</p>
                  </div>
                  <div className="glass px-4 py-2 rounded-xl text-center border border-emerald-500/30">
                    <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">STAGE</p>
                    <p className="text-xl font-black text-emerald-300 font-game">{completedCount}/10</p>
                  </div>
                </div>
              </div>

              {/* XP Bar */}
              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-black uppercase tracking-widest">
                  <span>EXPERIENCE POINTS</span><span className="text-indigo-400">{xp} / {MAX_XP} XP</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-white/10">
                  <div className="xp-bar h-full" style={{ width: `${xp}%` }} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── WORLD MAP TITLE ── */}
        <div className="text-center mb-8">
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-1">SELECT STAGE</p>
          <h2 className="text-3xl md:text-4xl font-black font-game text-glow-white">PETA DUNIA</h2>
          <p className="text-slate-400 text-sm mt-2">Selesaikan level untuk membuka stage berikutnya!</p>
        </div>

        {/* ── LEVEL GRID ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => {
            const level = i + 1;
            const status = getLevelStatus(level);
            const stars = getStars(level);
            const meta = LEVEL_META[level];
            const isLocked = status === 'LOCKED';
            const isDone = status === 'COMPLETED';
            const isBoss = level === 10;

            return (
              <motion.div key={level}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.04, type: 'spring', stiffness: 300, damping: 22 }}
                whileHover={!isLocked ? { y: -8, scale: 1.04 } : {}}
                whileTap={!isLocked ? { scale: 0.95 } : {}}
                onHoverStart={() => !isLocked && setHoveredLevel(level)}
                onHoverEnd={() => setHoveredLevel(null)}
                onClick={() => !isLocked && navigate(`/game/${level}`)}
                className={`relative flex flex-col items-center justify-between p-4 rounded-3xl border-2 cursor-pointer min-h-[170px] transition-all duration-300 overflow-hidden
                  ${isLocked  ? 'bg-slate-900/60 border-slate-700/50 cursor-not-allowed opacity-50 grayscale'
                  : isDone    ? 'bg-emerald-950/60 border-emerald-500/50 glow-emerald'
                  : isBoss    ? 'bg-red-950/70 border-orange-500 boss-glow'
                  : 'glass border-indigo-500/40 hover:border-indigo-400'}`}
                style={!isLocked ? { boxShadow: `0 0 20px ${meta.glow}40` } : {}}
              >
                {/* Particle effect for active/completed */}
                {!isLocked && hoveredLevel === level && (
                  <>
                    {[...Array(6)].map((_, p) => (
                      <div key={p} className="particle"
                        style={{
                          background: meta.glow,
                          left: `${10 + p * 15}%`,
                          bottom: '0',
                          animationDuration: `${1 + p * 0.3}s`,
                          animationDelay: `${p * 0.15}s`,
                        }} />
                    ))}
                  </>
                )}

                {/* Top: Level number + mechanic tag */}
                <div className="w-full">
                  <div className="flex items-start justify-between mb-1">
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded font-game ${isDone ? 'bg-emerald-500/30 text-emerald-300' : isBoss ? 'bg-orange-500/30 text-orange-300' : 'bg-indigo-500/30 text-indigo-300'}`}>
                      {isLocked ? 'LOCKED' : isDone ? 'CLEAR ✓' : `LV ${level}`}
                    </span>
                    {isBoss && !isLocked && (
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-red-500/40 text-red-300 animate-pulse">BOSS</span>
                    )}
                  </div>
                  <p className={`text-[8px] font-black uppercase tracking-wider ${isLocked ? 'text-slate-600' : 'text-white/40'}`}>
                    {meta.mechanic}
                  </p>
                </div>

                {/* Center Icon */}
                <div className="relative my-1">
                  {!isLocked && isDone && <div className="pulse-ring text-emerald-400" />}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg relative z-10
                    ${isLocked ? 'bg-slate-800' : `bg-gradient-to-br ${meta.color}`}`}
                    style={!isLocked ? { boxShadow: `0 4px 20px ${meta.glow}` } : {}}>
                    {isLocked ? '🔒' : meta.icon}
                  </div>
                </div>

                {/* Bottom: Name + Stars */}
                <div className="w-full text-center">
                  <p className={`text-[10px] font-bold mb-1.5 leading-tight ${isLocked ? 'text-slate-600' : 'text-white/80'}`}>
                    {meta.name}
                  </p>
                  <div className="flex justify-center gap-0.5">
                    {[1,2,3].map(s => (
                      <span key={s} className={`text-base leading-none ${s <= stars ? 'text-amber-400 text-glow-amber' : 'text-slate-700'}`}>★</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── FOOTER ACTIONS ── */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
          <button onClick={() => { logoutStudent(); navigate('/'); }}
            className="text-slate-500 hover:text-red-400 transition text-sm font-bold px-4 py-2 rounded-xl hover:bg-red-500/10">
            ⏻ Keluar Sesi
          </button>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/leaderboard')}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black rounded-2xl shadow-xl hover:shadow-amber-500/30 text-sm font-game glow-amber">
            🏆 LEADERBOARD KELAS
          </motion.button>
        </div>
      </div>
    </div>
  );
}
