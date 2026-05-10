import React, { useContext, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';
import { motion } from 'framer-motion';

const LEVEL_META = {
  1:  { icon: '⌨️', name: 'Pusat Input',        color: 'from-blue-100 to-cyan-100 text-blue-700',       mechanic: 'KLASIFIKASI' },
  2:  { icon: '🚦', name: 'Jalur Distribusi',   color: 'from-emerald-100 to-green-100 text-green-700',  mechanic: 'URUTAN' },
  3:  { icon: '🧠', name: 'Pusat Proses (CPU)', color: 'from-pink-100 to-rose-100 text-pink-700',       mechanic: 'ANALISIS' },
  4:  { icon: '🖥️', name: 'Terminal Output',    color: 'from-orange-100 to-amber-100 text-orange-700',  mechanic: 'BENAR/SALAH' },
  5:  { icon: '🏭', name: 'Pabrik Perangkat',   color: 'from-amber-100 to-yellow-100 text-amber-700',   mechanic: 'MENJODOHKAN' },
  6:  { icon: '🗄️', name: 'Gudang Storage',     color: 'from-cyan-100 to-sky-100 text-sky-700',         mechanic: 'KLASIFIKASI' },
  7:  { icon: '🏫', name: 'Akademi Sistem',     color: 'from-fuchsia-100 to-purple-100 text-purple-700',mechanic: 'URUTAN' },
  8:  { icon: '🔬', name: 'Lab Inovasi IT',     color: 'from-indigo-100 to-violet-100 text-violet-700', mechanic: 'ANALISIS' },
  9:  { icon: '🌐', name: 'Jaringan Kota',      color: 'from-stone-200 to-stone-300 text-stone-700',    mechanic: 'BENAR/SALAH' },
  10: { icon: '👑', name: 'Ujian Arsitektur',   color: 'from-amber-200 to-yellow-300 text-amber-800',   mechanic: 'MENJODOHKAN' },
};

// XP progression — setiap level memberi +10 XP dari total 100
const MAX_XP = 100;

export default function DashboardLevel() {
  const { student, loading, logoutStudent } = useContext(GameContext);
  const navigate = useNavigate();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center p-4 city-bg font-sans">
      <div className="text-center glass rounded-3xl px-12 py-10 shadow-xl">
        <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mb-6 mx-auto"></div>
        <h2 className="text-2xl font-black text-stone-800 tracking-tight">MEMUAT PETA</h2>
        <p className="font-bold text-stone-500 text-sm tracking-widest animate-pulse mt-2 uppercase">Menyiapkan Petualangan...</p>
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
    <div className="min-h-screen text-stone-800 relative xl:overflow-hidden city-bg bg-network font-sans">

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-12">

        {/* ── HERO CARD / PLAYER HUD ── */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="glass rounded-3xl p-6 md:p-8 mb-12 shadow-md hover:shadow-lg transition-all">
          <div className="flex flex-col md:flex-row items-center gap-8">

            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] bg-amber-100 flex items-center justify-center text-5xl md:text-6xl font-black text-amber-700 shadow-inner border-[6px] border-white">
                {student.name.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-sm font-bold px-4 py-1 rounded-full shadow-md border-2 border-white whitespace-nowrap">
                LEVEL {heroLevel}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 w-full">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
                <div className="text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-serif font-black text-stone-800 tracking-tight mb-1">{student.name}</h1>
                  <p className="text-stone-500 text-sm font-bold uppercase tracking-wider">
                    Warga Kota #{student.absen} <span className="mx-2 opacity-50">|</span> Sesi {student.session_id.slice(0,8)}
                  </p>
                </div>
                
                <div className="flex justify-center md:justify-start gap-3 md:gap-4">
                  <div className="bg-white px-5 py-3 rounded-2xl text-center border border-stone-100 shadow-sm min-w-[80px]">
                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mb-1">POIN</p>
                    <p className="text-2xl font-black text-blue-700 leading-none">{student.total_poin}</p>
                  </div>
                  <div className="bg-white px-5 py-3 rounded-2xl text-center border border-stone-100 shadow-sm min-w-[80px]">
                    <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mb-1">BINTANG</p>
                    <p className="text-2xl font-black text-amber-600 leading-none">★ {student.total_bintang}</p>
                  </div>
                  <div className="bg-white px-5 py-3 rounded-2xl text-center border border-stone-100 shadow-sm min-w-[80px]">
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mb-1">PROGRES</p>
                    <p className="text-2xl font-black text-emerald-700 leading-none">{completedCount}<span className="text-lg opacity-50">/10</span></p>
                  </div>
                </div>
              </div>

              {/* XP Bar */}
              <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
                <div className="flex justify-between text-[10px] text-stone-400 mb-2 font-bold uppercase tracking-widest">
                  <span>PENGALAMAN (XP)</span>
                  <span className="text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md">{xp} / {MAX_XP} XP</span>
                </div>
                <div className="h-4 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                  <motion.div 
                    initial={{width:0}} animate={{width:`${xp}%`}} transition={{duration:1, ease:'easeOut'}} 
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-300 relative"
                  >
                    <div className="absolute inset-0 bg-white/20" style={{ backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)', backgroundSize: '1rem 1rem' }} />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── WORLD MAP TITLE ── */}
        <div className="text-center mb-16">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="inline-block mb-3">
            <span className="bg-amber-100 text-amber-700 font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm border border-amber-200">
              Jelajahi Sistem
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-serif font-black text-stone-800 tracking-tight">Peta Kota Digital</h2>
          <p className="text-stone-600 text-base md:text-lg mt-4 max-w-lg mx-auto font-medium">Kuasai arsitektur komputer dan logika sistem dalam ArchiLogic Challenge!</p>
        </div>

        {/* ── ELEGANT ZIGZAG LEVEL TIMELINE ── */}
        <div className="relative w-full max-w-4xl mx-auto py-4">
          {/* The central dashed line */}
          <div className="absolute top-0 bottom-0 left-[40px] md:left-1/2 md:-ml-[2px] w-0 border-l-4 border-dashed border-stone-300/60 z-0" />

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
                    whileHover={!isLocked ? { scale: 1.03, y: -4 } : {}}
                    whileTap={!isLocked ? { scale: 0.97 } : {}}
                    onClick={() => !isLocked && navigate(`/game/${level}`)}
                    className={`relative flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 md:p-6 rounded-[2rem] border shadow-sm transition-all duration-300 group
                      ${isLocked ? 'bg-white/50 border-stone-200 opacity-60 grayscale cursor-not-allowed'
                      : isDone ? 'bg-white border-emerald-200 hover:border-emerald-400 hover:shadow-lg cursor-pointer'
                      : isBoss ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 hover:border-amber-500 hover:shadow-xl cursor-pointer shadow-amber-100/50'
                      : 'bg-white border-stone-200 hover:border-amber-400 hover:shadow-xl cursor-pointer ring-4 ring-transparent hover:ring-amber-50'}`}
                  >
                    {/* Level Icon */}
                    <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/50
                      ${isLocked ? 'bg-stone-200 text-stone-400' : `bg-gradient-to-br ${meta.color}`}`}>
                      {meta.icon}
                    </div>

                    {/* Level Info */}
                    <div className="flex-1 w-full text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-lg ${isDone ? 'bg-emerald-100 text-emerald-700' : isBoss ? 'bg-amber-500 text-white shadow-sm' : isLocked ? 'bg-stone-200 text-stone-500' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                          BAB {level}
                        </span>
                        {isBoss && !isLocked && <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-red-100 text-red-600 animate-pulse border border-red-200">UJIAN</span>}
                      </div>
                      <h3 className={`font-serif font-black text-lg md:text-xl leading-tight mb-1 ${isLocked ? 'text-stone-500' : 'text-stone-800'}`}>
                        {meta.name}
                      </h3>
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${isLocked ? 'text-stone-400' : 'text-stone-500'}`}>
                        {meta.mechanic}
                      </p>
                    </div>

                    {/* Actions / Stars */}
                    <div className="flex sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto shrink-0 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                      <div className="flex gap-0.5">
                        {[1,2,3].map(s => (
                          <span key={s} className={`text-xl ${s <= stars ? 'text-amber-400 drop-shadow-sm' : 'text-stone-200'}`}>★</span>
                        ))}
                      </div>
                      {!isLocked && !isDone && (
                        <span className="text-[10px] font-bold bg-amber-400 text-white shadow-sm px-3 py-1.5 rounded-xl sm:mt-2 group-hover:bg-amber-500 transition-colors uppercase tracking-widest">
                          MAIN ▶
                        </span>
                      )}
                      {isDone && (
                        <span className="text-[10px] font-bold bg-stone-100 text-stone-500 px-3 py-1.5 rounded-xl sm:mt-2 group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors uppercase tracking-widest hidden sm:inline-block">
                          ULANGI ↺
                        </span>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>

        


      </div>
    </div>
  );
}
