import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const TYPE_META = {
  CLASSIFICATION:  { icon: '🧩', mechanic: 'Klasifikasi',   color: '#8b5cf6' },
  MATCHING:        { icon: '🔗', mechanic: 'Menjodohkan',    color: '#3b82f6' },
  SEQUENCE:        { icon: '📋', mechanic: 'Urutan',         color: '#f59e0b' },
  SEQUENCING:      { icon: '📋', mechanic: 'Urutan',         color: '#f59e0b' },
  MULTIPLE_CHOICE: { icon: '🎯', mechanic: 'Pilihan Ganda',  color: '#10b981' },
  TRUE_FALSE:      { icon: '✅', mechanic: 'Benar / Salah',  color: '#06b6d4' },
};
const DEFAULT_TYPE_META = { icon: '📝', mechanic: 'Soal', color: '#94a3b8' };

const LEVEL_ICONS = ['⌨️','🚦','🧠','🖥️','🏭','🗄️','🏫','🔬','🌐','👑','🔧','💡','🛡️','🚀','🎮'];

export default function DashboardLevel() {
  const { student, loading, logoutStudent } = useContext(GameContext);
  const navigate = useNavigate();

  const [levels, setLevels]               = useState([]);
  const [levelsLoading, setLevelsLoading] = useState(true);
  const [levelsError, setLevelsError]     = useState(false);
  const [hoveredLevel, setHoveredLevel]   = useState(null);

  useEffect(() => {
    setLevelsLoading(true);
    setLevelsError(false);
    axios.get(`${import.meta.env.VITE_API_URL}/api/questions/levels-summary`, { timeout: 8000 })
      .then(res => setLevels(Array.isArray(res.data) ? res.data : []))
      .catch(() => { setLevelsError(true); setLevels([]); })
      .finally(() => setLevelsLoading(false));
  }, []);

  const getLevelStatus = (levelNumber) => {
    const cur = student?.level_results?.find(r => r.level_number === levelNumber);
    if (cur?.is_complete) return 'COMPLETED';
    const firstLevel = levels[0]?.level_number;
    if (levelNumber === firstLevel) return 'UNLOCKED';
    const idx = levels.findIndex(l => l.level_number === levelNumber);
    if (idx <= 0) return 'LOCKED';
    const prevLevel = levels[idx - 1]?.level_number;
    const prev = student?.level_results?.find(r => r.level_number === prevLevel);
    if (prev?.is_complete) return 'UNLOCKED';
    return 'LOCKED';
  };

  const getStars = (levelNumber) =>
    student?.level_results?.find(r => r.level_number === levelNumber)?.bintang || 0;

  const totalLevels    = levels.length;
  const completedCount = levels.filter(l => getLevelStatus(l.level_number) === 'COMPLETED').length;
  const xp             = totalLevels > 0 ? Math.round((completedCount / totalLevels) * 100) : 0;
  const heroLevel      = Math.max(1, Math.ceil(completedCount / 2));
  const totalStars     = student?.total_bintang || 0;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center city-bg bg-network font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center glass rounded-3xl px-12 py-10 shadow-2xl"
      >
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-amber-200 animate-ping opacity-40" />
          <div className="w-20 h-20 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
        </div>
        <h2 className="text-2xl font-black text-stone-800 tracking-tight">MEMUAT PETA</h2>
        <p className="font-bold text-stone-500 text-sm tracking-widest animate-pulse mt-2 uppercase">Menyiapkan Petualangan...</p>
      </motion.div>
    </div>
  );
  if (!student) return <Navigate to="/register" replace />;

  return (
    <div className="min-h-screen text-stone-800 relative city-bg bg-network font-sans">
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-10">

        {/* ══════════════ HERO CARD ══════════════ */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <div className="relative overflow-hidden rounded-3xl shadow-xl border border-white/80"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.85) 100%)', backdropFilter: 'blur(20px)' }}>

            {/* Decorative background blobs */}
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-20 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #fbbf24 0%, transparent 70%)' }} />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full opacity-15 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #60a5fa 0%, transparent 70%)' }} />

            <div className="relative z-10 p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

                {/* Avatar */}
                <div className="relative shrink-0">
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-24 h-24 rounded-[1.5rem] flex items-center justify-center text-5xl font-black shadow-lg border-4 border-white"
                    style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}
                  >
                    {student.name.charAt(0).toUpperCase()}
                  </motion.div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-md border-2 border-white whitespace-nowrap">
                    LVL {heroLevel}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 w-full text-center sm:text-left">
                  <h1 className="text-2xl md:text-3xl font-serif font-black text-stone-800 tracking-tight mb-0.5">
                    {student.name}
                  </h1>
                  <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-5">
                    Absen #{student.absen} · Sesi {student.session_id.slice(0, 8)}
                  </p>

                  {/* Stats Row */}
                  <div className="flex justify-center sm:justify-start gap-3 mb-5 flex-wrap">
                    {[
                      { label: 'POIN', value: student.total_poin, color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
                      { label: 'BINTANG', value: `★ ${totalStars}`, color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
                      { label: 'SELESAI', value: `${completedCount}/${totalLevels}`, color: '#10b981', bg: '#f0fdf4', border: '#a7f3d0' },
                    ].map(stat => (
                      <div key={stat.label}
                        className="px-4 py-2.5 rounded-2xl text-center border min-w-[72px] shadow-sm"
                        style={{ background: stat.bg, borderColor: stat.border }}>
                        <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: stat.color }}>{stat.label}</p>
                        <p className="text-xl font-black leading-none" style={{ color: stat.color }}>{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* XP Bar */}
                  <div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1.5">
                      <span className="text-stone-400">Pengalaman (XP)</span>
                      <span className="text-amber-600">{xp} / 100 XP</span>
                    </div>
                    <div className="h-3.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200 shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${xp}%` }}
                        transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1], delay: 0.3 }}
                        className="h-full rounded-full relative overflow-hidden"
                        style={{ background: 'linear-gradient(90deg, #fbbf24, #f97316)' }}
                      >
                        <div className="absolute inset-0"
                          style={{ backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,.25) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.25) 50%, rgba(255,255,255,.25) 75%, transparent 75%)', backgroundSize: '14px 14px', animation: 'shimmer 1.5s linear infinite' }} />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ══════════════ MAP TITLE ══════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-center mb-10"
        >
          <span className="inline-block bg-white/80 backdrop-blur-sm text-amber-700 font-black text-[10px] px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-sm border border-amber-200 mb-3">
            🗺️ Peta Pembelajaran
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-black text-stone-800 tracking-tight leading-tight">
            Kota Digital
          </h2>
          <p className="text-stone-500 text-sm mt-2 max-w-md mx-auto font-medium">
            Selesaikan setiap bab untuk membuka level berikutnya!
          </p>
        </motion.div>

        {/* ══════════════ LOADING STATE ══════════════ */}
        {levelsLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 border-4 border-amber-100 rounded-full" />
              <div className="w-14 h-14 border-4 border-transparent border-t-amber-500 border-r-amber-300 rounded-full animate-spin" />
            </div>
            <p className="text-stone-500 font-bold text-sm uppercase tracking-widest animate-pulse">Memuat level...</p>
          </div>
        )}

        {/* ══════════════ ERROR STATE ══════════════ */}
        {!levelsLoading && levelsError && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-16 glass rounded-3xl px-8">
            <div className="text-5xl mb-4">⚠️</div>
            <p className="text-stone-600 font-bold text-lg mb-2">Gagal memuat data level</p>
            <p className="text-stone-400 text-sm mb-6">Pastikan server backend berjalan dan coba refresh halaman.</p>
            <button onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-white font-bold rounded-xl transition-colors shadow-md">
              Coba Lagi
            </button>
          </motion.div>
        )}

        {/* ══════════════ EMPTY STATE ══════════════ */}
        {!levelsLoading && !levelsError && levels.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-16 glass rounded-3xl px-8">
            <div className="text-6xl mb-4">🏗️</div>
            <p className="text-stone-600 font-bold text-xl mb-2">Belum Ada Level</p>
            <p className="text-stone-400 text-sm max-w-sm mx-auto">Guru sedang mempersiapkan soal. Silakan tunggu.</p>
          </motion.div>
        )}

        {/* ══════════════ LEVEL MAP ══════════════ */}
        {!levelsLoading && levels.length > 0 && (
          <div className="relative">
            {/* Vertical path line */}
            <div className="absolute left-8 md:left-1/2 top-8 bottom-8 w-0.5 md:-ml-px pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, #fbbf24 0%, #e5e7eb 100%)', opacity: 0.5 }} />

            <div className="space-y-8 md:space-y-10">
              {levels.map((lvlData, i) => {
                const { level_number, question_count, type, topic } = lvlData;
                const typeMeta = TYPE_META[type] || DEFAULT_TYPE_META;
                const status   = getLevelStatus(level_number);
                const stars    = getStars(level_number);
                const isLocked = status === 'LOCKED';
                const isDone   = status === 'COMPLETED';
                const isBoss   = i === levels.length - 1 && levels.length > 1;
                const isNext   = !isDone && !isLocked; // aktif / giliran main
                const isRight  = i % 2 !== 0;
                const icon     = isBoss ? '👑' : LEVEL_ICONS[(level_number - 1) % LEVEL_ICONS.length];

                return (
                  <div key={level_number}
                    className={`relative flex items-center ${isRight ? 'md:justify-end' : 'md:justify-start'}`}>

                    {/* ── Path Node ── */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.07, type: 'spring', stiffness: 200, damping: 15 }}
                      className="absolute left-8 md:left-1/2 -translate-x-1/2 z-20"
                    >
                      <div className={`relative w-14 h-14 rounded-full border-4 flex items-center justify-center text-xl shadow-lg
                        ${isDone  ? 'bg-emerald-400 border-emerald-500 text-white'
                        : isLocked ? 'bg-stone-100 border-stone-200 text-stone-300'
                        : isBoss  ? 'bg-gradient-to-br from-amber-400 to-orange-400 border-amber-500 text-white'
                        : 'bg-white border-amber-400 text-amber-600'}`}
                      >
                        {isDone ? '✓' : isLocked ? '🔒' : icon}
                        {/* Pulse ring for active level */}
                        {isNext && !isBoss && (
                          <span className="absolute inset-0 rounded-full border-4 border-amber-300 animate-ping opacity-60" />
                        )}
                        {isBoss && !isLocked && (
                          <span className="absolute inset-0 rounded-full border-4 border-orange-300 animate-ping opacity-60" />
                        )}
                      </div>
                    </motion.div>

                    {/* ── Level Card ── */}
                    <div className={`w-full pl-24 md:pl-0 md:w-[calc(50%-2.5rem)] ${isRight ? 'md:ml-[calc(50%+2.5rem)]' : ''}`}>
                      <motion.div
                        initial={{ opacity: 0, x: isRight ? 30 : -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 + 0.1, type: 'spring', stiffness: 120, damping: 18 }}
                        onHoverStart={() => !isLocked && setHoveredLevel(level_number)}
                        onHoverEnd={() => setHoveredLevel(null)}
                        whileHover={!isLocked ? { y: -5, scale: 1.02 } : {}}
                        whileTap={!isLocked ? { scale: 0.97 } : {}}
                        onClick={() => !isLocked && navigate(`/game/${level_number}`)}
                        className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 cursor-pointer shadow-md
                          ${isLocked  ? 'bg-white/50 border-stone-100 opacity-55 grayscale-[60%] cursor-not-allowed shadow-none'
                          : isDone   ? 'bg-white border-emerald-200 hover:border-emerald-400 hover:shadow-lg'
                          : isBoss   ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 hover:border-orange-400 hover:shadow-xl'
                          : 'bg-white border-stone-200 hover:border-amber-300 hover:shadow-xl'}`}
                        style={!isLocked ? { boxShadow: hoveredLevel === level_number ? `0 12px 40px -8px ${typeMeta.color}40` : undefined } : {}}
                      >
                        {/* Top accent strip */}
                        {!isLocked && (
                          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
                            style={{ background: isDone ? '#10b981' : isBoss ? 'linear-gradient(90deg,#fbbf24,#f97316)' : typeMeta.color }} />
                        )}

                        <div className="p-4 md:p-5 flex items-center gap-4">
                          {/* Icon box */}
                          <div className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center text-2xl shadow-sm border"
                            style={{
                              background: isLocked ? '#f1f5f9' : `${typeMeta.color}15`,
                              borderColor: isLocked ? '#e2e8f0' : `${typeMeta.color}30`,
                              color: isLocked ? '#94a3b8' : typeMeta.color
                            }}>
                            {icon}
                          </div>

                          {/* Text */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-md"
                                style={{
                                  background: isLocked ? '#f1f5f9' : isDone ? '#d1fae5' : isBoss ? '#fef3c7' : `${typeMeta.color}15`,
                                  color: isLocked ? '#94a3b8' : isDone ? '#059669' : isBoss ? '#d97706' : typeMeta.color,
                                }}>
                                BAB {level_number}
                              </span>
                              {isBoss && !isLocked && (
                                <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-red-100 text-red-600 animate-pulse">UJIAN AKHIR</span>
                              )}
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-400">
                                {question_count} soal
                              </span>
                            </div>

                            <h3 className={`font-serif font-black text-base md:text-lg leading-tight truncate ${isLocked ? 'text-stone-400' : 'text-stone-800'}`}>
                              {topic && topic !== 'GENERAL' ? topic : isBoss ? 'Ujian Akhir' : `Level ${level_number}`}
                            </h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5"
                              style={{ color: isLocked ? '#cbd5e1' : typeMeta.color }}>
                              {typeMeta.mechanic}
                            </p>
                          </div>

                          {/* Stars + CTA */}
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <div className="flex gap-0.5">
                              {[1, 2, 3].map(s => (
                                <span key={s} className={`text-lg ${s <= stars ? 'text-amber-400' : 'text-stone-200'}`}>★</span>
                              ))}
                            </div>
                            {!isLocked && !isDone && (
                              <motion.span
                                animate={{ scale: [1, 1.08, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="text-[10px] font-black px-2.5 py-1 rounded-lg text-white shadow-sm"
                                style={{ background: isBoss ? 'linear-gradient(135deg,#f59e0b,#ef4444)' : typeMeta.color }}>
                                MAIN ▶
                              </motion.span>
                            )}
                            {isDone && (
                              <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                ULANGI ↺
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Finish badge */}
            {completedCount === totalLevels && totalLevels > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', delay: 0.5 }}
                className="mt-10 text-center"
              >
                <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 text-white font-black text-lg shadow-xl">
                  🏆 Semua Level Selesai!
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* ══════════════ FOOTER ACTIONS ══════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 glass rounded-3xl p-5 shadow-sm"
        >
          <button
            onClick={() => { logoutStudent(); navigate('/'); }}
            className="text-red-500 hover:text-red-700 bg-red-50 border border-red-100 transition-all text-sm font-bold px-6 py-3 rounded-2xl hover:bg-red-100 w-full sm:w-auto"
          >
            ← Keluar Sesi
          </button>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/leaderboard')}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-black rounded-2xl shadow-md hover:shadow-lg text-sm tracking-wide transition-all w-full sm:w-auto"
          >
            🏆 Papan Peringkat
          </motion.button>
        </motion.div>

      </div>
    </div>
  );
}
