import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';
import { motion } from 'framer-motion';
import axios from 'axios';

// Metadata statis: nama level, warna, dan mechanic (fallback emoji jika DB kosong)
const LEVEL_META = {
  1:  { icon: '🎯', name: 'Pusat Input',        color: 'from-blue-100 to-cyan-100 text-blue-700',       mechanic: 'KLASIFIKASI' },
  2:  { icon: '🚦', name: 'Jalur Distribusi',   color: 'from-emerald-100 to-green-100 text-green-700',  mechanic: 'URUTAN' },
  3:  { icon: '🧠', name: 'Pusat Proses (CPU)', color: 'from-pink-100 to-rose-100 text-pink-700',       mechanic: 'ANALISIS' },
  4:  { icon: '🖥️', name: 'Terminal Output',    color: 'from-orange-100 to-amber-100 text-orange-700',  mechanic: 'BENAR/SALAH' },
  5:  { icon: '🏭', name: 'Pabrik Perangkat',   color: 'from-amber-100 to-yellow-100 text-amber-700',   mechanic: 'MENJODOHKAN' },
  6:  { icon: '📄', name: 'Gudang Storage',     color: 'from-cyan-100 to-sky-100 text-sky-700',         mechanic: 'KLASIFIKASI' },
  7:  { icon: '🏫', name: 'Akademi Sistem',     color: 'from-fuchsia-100 to-purple-100 text-purple-700',mechanic: 'URUTAN' },
  8:  { icon: '🔬', name: 'Lab Inovasi IT',     color: 'from-indigo-100 to-violet-100 text-violet-700', mechanic: 'ANALISIS' },
  9:  { icon: '🌐', name: 'Jaringan Kota',      color: 'from-stone-200 to-stone-300 text-stone-700',    mechanic: 'BENAR/SALAH' },
  10: { icon: '👑', name: 'Ujian Arsitektur',   color: 'from-amber-200 to-yellow-300 text-amber-800',   mechanic: 'MENJODOHKAN' },
};

// XP progression — max XP per level = 100 (50 star + 50 timer), 10 levels = 1000 total
const MAX_XP = 1000;

export default function DashboardLevel() {
  const { student, loading, logoutStudent } = useContext(GameContext);
  const navigate = useNavigate();
  // State untuk menyimpan emoji dari database (dikonfigurasi guru)
  const [dbLevelEmojis, setDbLevelEmojis] = useState({});

  // Fetch emoji level dari API saat komponen mount
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/questions/level-emojis`)
      .then(res => {
        if (res.data && typeof res.data === 'object') {
          setDbLevelEmojis(res.data);
        }
      })
      .catch(err => {
        console.warn('Gagal mengambil emoji level dari DB, menggunakan fallback:', err.message);
      });
  }, []);

  // Fungsi untuk mendapatkan icon level: prioritaskan dari DB, fallback ke LEVEL_META
  const getLevelIcon = (levelNum) => {
    const dbData = dbLevelEmojis[levelNum];
    if (dbData?.emoji && dbData.emoji !== '📚') return dbData.emoji;
    return LEVEL_META[levelNum]?.icon || '📚';
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center p-4 city-bg font-sans bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      <div className="text-center backdrop-blur-md bg-white/70 rounded-3xl px-12 py-10 shadow-xl border border-white/50">
        <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin mb-6 mx-auto"></div>
        <h2 className="text-2xl font-black text-stone-800 tracking-tight">MEMUAT PETA</h2>
        <p className="font-bold text-stone-500 text-sm tracking-widest animate-pulse mt-2 uppercase">Menyiapkan Petualangan...</p>
      </div>
    </div>
  );
  if (!student) return <Navigate to="/register" replace />;

  const getLevelStatus = (n) => {
    const results = student.level_results?.filter(r => r.level_number === n) || [];
    // Level dianggap COMPLETED jika sudah pernah selesai DAN mendapat minimal 1 bintang
    const bestStars = results.length > 0 ? Math.max(...results.map(r => r.bintang || 0)) : 0;
    const hasCompleted = results.some(r => r.is_complete) && bestStars >= 1;
    if (hasCompleted) return 'COMPLETED';
    if (n === 1) return 'UNLOCKED';
    // Level berikutnya terbuka jika level sebelumnya selesai dengan minimal 1 bintang
    const prevResults = student.level_results?.filter(r => r.level_number === n - 1) || [];
    const prevBestStars = prevResults.length > 0 ? Math.max(...prevResults.map(r => r.bintang || 0)) : 0;
    if (prevResults.some(r => r.is_complete) && prevBestStars >= 1) return 'UNLOCKED';
    return 'LOCKED';
  };
  // Ambil bintang tertinggi dari semua percobaan di level tersebut
  const getStars = (n) => {
    const results = student.level_results?.filter(r => r.level_number === n) || [];
    if (results.length === 0) return 0;
    return Math.max(...results.map(r => r.bintang || 0));
  };

  const completedCount = [...Array(10)].filter((_, i) => getLevelStatus(i + 1) === 'COMPLETED').length;
  const xp = student.total_poin || 0; // XP = total poin dari semua level
  const heroLevel = Math.max(1, Math.ceil(completedCount / 2));

  return (
    <div className="min-h-screen text-stone-800 relative xl:overflow-hidden city-bg bg-network font-sans bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      {/* Animated background orbs for theme consistency */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-blue-300/15 to-orange-300/8 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-gradient-to-tl from-orange-300/12 to-blue-300/5 blur-3xl animate-pulse" style={{animationDelay:'1.5s'}} />
        <div className="absolute top-1/3 right-0 w-72 h-72 rounded-full bg-gradient-to-l from-yellow-400/8 to-transparent blur-3xl animate-pulse" style={{animationDelay:'0.7s'}} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* ── HERO CARD / PLAYER HUD ── */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          className="backdrop-blur-xl bg-white/70 rounded-3xl p-8 md:p-10 mb-12 shadow-lg hover:shadow-xl transition-all border border-white/50 hover:border-sky-200/70"
        >
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Avatar Section */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2rem] bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center text-6xl md:text-7xl font-black text-blue-700 shadow-lg hover:shadow-2xl transition-shadow border-4 border-white/70">
                {student.name.charAt(0).toUpperCase()}
              </div>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.3 }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white text-sm font-bold px-5 py-2 rounded-full shadow-lg border-3 border-white whitespace-nowrap"
              >
                ⭐ LEVEL {heroLevel}
              </motion.div>
            </div>

            {/* Info Section */}
            <div className="flex-1 w-full">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                <div className="text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-black text-stone-800 tracking-tight mb-1">{student.name}</h1>
                  <p className="text-stone-500 text-sm font-semibold uppercase tracking-wider">
                    👤 Warga Kota #{student.absen} <span className="mx-2 opacity-40">•</span> Sesi {student.session_id.slice(0,8)}
                  </p>
                </div>
                
                {/* Stats Cards */}
                <div className="flex justify-center md:justify-start gap-3 md:gap-4 flex-wrap">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="backdrop-blur-md bg-gradient-to-br from-blue-50 to-blue-100 px-6 py-3 rounded-2xl text-center border border-blue-200/60 shadow-md hover:shadow-lg transition-all hover:from-blue-100 hover:to-blue-150 min-w-[90px]"
                  >
                    <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mb-1">🚀 XP</p>
                    <p className="text-2xl font-black text-blue-700 leading-none">{student.total_poin}</p>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="backdrop-blur-md bg-gradient-to-br from-amber-50 to-amber-100 px-6 py-3 rounded-2xl text-center border border-amber-200/60 shadow-md hover:shadow-lg transition-all hover:from-amber-100 hover:to-amber-150 min-w-[90px]"
                  >
                    <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest mb-1">⭐ BINTANG</p>
                    <p className="text-2xl font-black text-amber-700 leading-none">{student.total_bintang}</p>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="backdrop-blur-md bg-gradient-to-br from-emerald-50 to-emerald-100 px-6 py-3 rounded-2xl text-center border border-emerald-200/60 shadow-md hover:shadow-lg transition-all hover:from-emerald-100 hover:to-emerald-150 min-w-[90px]"
                  >
                    <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mb-1">📊 PROGRES</p>
                    <p className="text-2xl font-black text-emerald-700 leading-none">{completedCount}<span className="text-lg opacity-50">/10</span></p>
                  </motion.div>
                </div>
              </div>

              {/* XP Bar - Enhanced */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="backdrop-blur-md bg-white/60 p-5 rounded-2xl border border-white/60 shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex justify-between text-[10px] text-stone-500 mb-2.5 font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1">🚀 Pengalaman (XP)</span>
                  <span className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 px-3 py-1 rounded-lg border border-amber-200/60 font-black">{xp} / {MAX_XP} XP</span>
                </div>
                <div className="h-5 bg-gradient-to-r from-stone-100 to-stone-200 rounded-full overflow-hidden border-2 border-stone-300/50 shadow-inner">
                  <motion.div 
                    initial={{width:0}} 
                    animate={{width:`${Math.min(100, (xp / MAX_XP) * 100)}%`}} 
                    transition={{duration:1.2, ease:'easeOut'}} 
                    className="h-full bg-gradient-to-r from-sky-400 via-blue-400 to-emerald-400 relative shadow-lg"
                  >
                    <div className="absolute inset-0 bg-white/30" style={{ backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.2) 50%, rgba(255,255,255,.2) 75%, transparent 75%, transparent)', backgroundSize: '1.5rem 1.5rem' }} />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ── WORLD MAP TITLE ── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-20"
        >
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ delay: 0.5, type: 'spring' }} 
            className="inline-block mb-4"
          >
            <span className="backdrop-blur-md bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 font-black text-xs px-5 py-2 rounded-full uppercase tracking-widest shadow-md border border-amber-200/60 hover:shadow-lg transition-all">
              🗺️ Jelajahi Sistem
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-stone-800 tracking-tight mb-3">Peta Kota Digital</h2>
          <p className="text-stone-600 text-base md:text-lg mt-4 max-w-2xl mx-auto font-medium leading-relaxed">Kuasai arsitektur komputer dan logika sistem dalam 🎮 ArchiLogic Challenge!</p>
        </motion.div>

        {/* ── ELEGANT ZIGZAG LEVEL TIMELINE ── */}
        <div className="relative w-full max-w-4xl mx-auto py-8">
          {/* The central dashed line */}
          <div className="absolute top-0 bottom-0 left-[40px] md:left-1/2 md:-ml-[2px] w-0 border-l-4 border-dashed border-sky-300/70 z-0" />

          {[...Array(10)].map((_, i) => {
            const level = i + 1;
            const status = getLevelStatus(level);
            const stars = getStars(level);
            const meta = LEVEL_META[level];
            const isLocked = status === 'LOCKED';
            const isDone = status === 'COMPLETED';
            const isBoss = level === 10;
            const isRight = i % 2 !== 0; // Zigzag logic for desktop

            return (
              <div key={level} className={`relative flex items-center w-full mb-10 md:mb-16 ${isRight ? 'md:justify-end' : 'md:justify-start'}`}>
                
                {/* Node Milestone on the line */}
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1, type: 'spring' }}
                  className={`absolute left-[40px] md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-4 flex items-center justify-center z-10 shadow-sm
                  ${isDone ? 'bg-emerald-100 border-emerald-400 text-emerald-600' 
                    : isLocked ? 'bg-stone-100 border-stone-200 text-stone-400' 
                    : 'bg-amber-100 border-amber-400 text-amber-600 shadow-[0_0_20px_rgba(251,191,36,0.3)] animate-bounce'}`}
                >
                  {isBoss ? '👑' : isDone ? '✓' : isLocked ? '🔒' : '⭐'}
                </motion.div>

                {/* Level Card Container */}
                <div className={`w-full pl-[90px] md:pl-0 md:w-1/2 ${isRight ? 'md:pl-14 lg:pl-20' : 'md:pr-14 lg:pr-20'}`}>
                  <motion.div 
                    initial={{ opacity: 0, x: isRight ? 40 : -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 + 0.2, type: 'spring', stiffness: 100 }}
                    whileHover={!isLocked ? { scale: 1.05, y: -6 } : {}}
                    whileTap={!isLocked ? { scale: 0.95 } : {}}
                    onClick={() => !isLocked && navigate(`/game/${level}`)}
                    className={`relative flex flex-col sm:flex-row items-center sm:items-start gap-5 p-6 md:p-7 rounded-2xl border-2 shadow-lg transition-all duration-300 group backdrop-blur-lg
                      ${isLocked ? 'bg-white/30 border-stone-200/40 opacity-50 grayscale cursor-not-allowed shadow-sm hover:shadow-md'
                      : isDone ? 'bg-gradient-to-br from-emerald-50/80 to-green-50/80 border-emerald-300/70 hover:border-emerald-400 hover:shadow-xl cursor-pointer hover:from-emerald-100/80 hover:to-green-100/80'
                      : isBoss ? 'bg-gradient-to-br from-amber-50/90 to-orange-50/90 border-amber-400/70 hover:border-amber-500 hover:shadow-2xl cursor-pointer shadow-amber-200/40 hover:shadow-amber-300/50'
                      : 'bg-white/70 border-sky-200/60 hover:border-sky-400 hover:shadow-xl cursor-pointer hover:bg-white/90 hover:from-sky-50/50 hover:to-blue-50/50'}`}
                  >
                    {/* Level Icon — diambil dari DB jika dikonfigurasi guru */}
                    <motion.div 
                      whileHover={!isLocked ? { scale: 1.1, rotate: 5 } : {}}
                      className={`w-18 h-18 shrink-0 rounded-2xl flex items-center justify-center text-4xl shadow-lg border-2 border-white/60 transition-all ${isLocked ? 'bg-stone-200/50 text-stone-400 grayscale' : `bg-gradient-to-br ${meta.color} shadow-md`}`}
                    >
                      {getLevelIcon(level)}
                    </motion.div>

                    {/* Level Info */}
                    <div className="flex-1 w-full text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-2">
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.1 + 0.3 }}
                          className={`text-[11px] font-black px-3 py-1 rounded-lg border backdrop-blur-sm transition-all ${isDone ? 'bg-emerald-100/80 text-emerald-700 border-emerald-300/60' : isBoss ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg border-amber-500/60' : isLocked ? 'bg-stone-200/60 text-stone-500 border-stone-300/40' : 'bg-sky-100/80 text-sky-700 border-sky-300/60'}`}
                        >
                          BAB {level}
                        </motion.span>
                        {isBoss && !isLocked && <motion.span 
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-[11px] font-black px-2.5 py-1 rounded-lg bg-gradient-to-r from-red-400 to-rose-400 text-white shadow-md border border-red-400/60 animate-pulse uppercase tracking-wide">👑 UJIAN</motion.span>}
                      </div>
                      <h3 className={`font-black text-lg md:text-xl leading-tight mb-1.5 transition-colors ${isLocked ? 'text-stone-500' : isDone ? 'text-emerald-800' : 'text-stone-800'}`}>
                        {meta.name}
                      </h3>
                      <p className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${isLocked ? 'text-stone-400' : isDone ? 'text-emerald-600' : 'text-stone-600'}`}>
                        📋 {meta.mechanic}
                      </p>
                    </div>

                    {/* Actions / Stars */}
                    <div className="flex sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto shrink-0 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t-2 sm:border-t-0 border-stone-200/40">
                      <motion.div 
                        className="flex gap-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.1 + 0.4 }}
                      >
                        {[1,2,3].map(s => (
                          <motion.span 
                            key={s} 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: (i * 0.1 + 0.4) + (s * 0.05) }}
                            className={`text-2xl transition-all ${s <= stars ? 'text-amber-400 drop-shadow-lg scale-110' : 'text-stone-200'}`}
                          >
                            ★
                          </motion.span>
                        ))}
                      </motion.div>
                      {!isLocked && !isDone && (
                        <motion.span 
                          whileHover={{ scale: 1.08, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-[11px] font-black bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white shadow-lg hover:shadow-xl px-4 py-2 rounded-xl sm:mt-2 transition-all uppercase tracking-widest border border-sky-300/60"
                        >
                          ▶ MAIN
                        </motion.span>
                      )}
                      {isDone && (
                        <motion.span 
                          whileHover={{ scale: 1.08, y: -2 }}
                          className="text-[11px] font-black bg-emerald-100/80 text-emerald-700 hover:bg-emerald-200/80 px-4 py-2 rounded-xl sm:mt-2 transition-all uppercase tracking-widest hidden sm:inline-block border border-emerald-300/60"
                        >
                          ↺ ULANGI
                        </motion.span>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── FOOTER / ACTION SECTION ── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-20 mb-12 flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 backdrop-blur-lg bg-white/70 hover:bg-white/90 text-stone-700 font-black px-6 py-3 rounded-2xl border-2 border-stone-200/60 shadow-lg hover:shadow-xl transition-all uppercase tracking-wide text-sm"
          >
            ← Kembali
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logoutStudent}
            className="flex items-center gap-2 backdrop-blur-lg bg-gradient-to-r from-red-400/80 to-rose-400/80 hover:from-red-500 hover:to-rose-500 text-white font-black px-6 py-3 rounded-2xl border-2 border-red-300/60 shadow-lg hover:shadow-xl transition-all uppercase tracking-wide text-sm"
          >
            🚪 Keluar
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
