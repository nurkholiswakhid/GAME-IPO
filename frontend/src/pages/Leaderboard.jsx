import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const RANK_STYLE = [
  { bg: 'from-yellow-500 to-amber-600', text: 'text-black', label: '🥇', glow: 'glow-amber' },
  { bg: 'from-slate-300 to-slate-500',  text: 'text-black', label: '🥈', glow: '' },
  { bg: 'from-orange-400 to-orange-600',text: 'text-black', label: '🥉', glow: '' },
];

export default function Leaderboard() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/leaderboard`);
      setStudents(res.data);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden text-white">
      <div className="stars-bg" />
      <div className="scanlines" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 text-5xl mb-5 shadow-2xl glow-amber"
          >
            🏆
          </motion.div>
          <p className="text-[10px] text-amber-400/80 font-black tracking-[0.5em] uppercase mb-2 font-game">◈ HALL OF FAME ◈</p>
          <h1 className="font-game font-black text-4xl md:text-5xl text-glow-white mb-2">LEADERBOARD</h1>
          <p className="text-slate-400 text-sm">Ranking kelas diperbarui otomatis setiap 8 detik</p>
        </motion.div>

        {/* Table */}
        <div className="glass rounded-3xl overflow-hidden border border-white/10 glow-indigo">
          {/* Table Header */}
          <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-black text-sm text-white/70 uppercase tracking-widest font-game">Player Rankings</h3>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />LIVE
            </div>
          </div>

          {isLoading ? (
            <div className="p-20 flex flex-col items-center justify-center text-slate-400">
              <div className="text-5xl mb-4 animate-bounce">⏳</div>
              <p className="font-game text-sm tracking-widest animate-pulse">LOADING RANKINGS...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="p-20 text-center">
              <div className="text-5xl mb-4">😴</div>
              <p className="text-slate-500">Belum ada pemain yang menyelesaikan level apapun.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              <AnimatePresence>
                {students.map((std, i) => {
                  const rs = RANK_STYLE[i] || null;
                  return (
                    <motion.div key={std.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={`flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors ${i === 0 ? 'bg-amber-500/5' : ''}`}
                    >
                      {/* Rank badge */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${rs ? `bg-gradient-to-br ${rs.bg} ${rs.text} shadow-lg` : 'bg-white/10 text-slate-400'}`}>
                        {rs ? rs.label : i + 1}
                      </div>

                      {/* Avatar */}
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${i === 0 ? 'from-amber-400 to-orange-500' : i === 1 ? 'from-slate-300 to-slate-500' : i === 2 ? 'from-orange-400 to-orange-600' : 'from-indigo-600 to-purple-700'} flex items-center justify-center font-black text-base shrink-0`}>
                        {std.name.charAt(0).toUpperCase()}
                      </div>

                      {/* Name + Status */}
                      <div className="flex-1 min-w-0">
                        <p className={`font-black text-base truncate ${i === 0 ? 'text-amber-300 text-glow-amber' : 'text-white'}`}>{std.name}</p>
                        <p className="text-xs text-slate-500 font-mono">ABSEN #{std.absen}</p>
                      </div>

                      {/* Status badge */}
                      <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black border ${std.is_complete ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : 'bg-amber-500/15 border-amber-500/40 text-amber-300'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${std.is_complete ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                        {std.is_complete ? 'LULUS' : 'BERMAIN'}
                      </div>

                      {/* Stars */}
                      <div className="text-center hidden sm:block w-16">
                        <p className="text-amber-400 font-black text-sm text-glow-amber">★ {std.total_bintang}</p>
                        <p className="text-[10px] text-slate-500 font-game">BINTANG</p>
                      </div>

                      {/* Points */}
                      <div className="text-right w-20">
                        <p className={`font-black text-xl font-game ${i === 0 ? 'text-amber-300 text-glow-amber' : 'text-indigo-300'}`}>{std.total_poin}</p>
                        <p className="text-[10px] text-slate-500 font-game uppercase">PTS</p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className="px-10 py-4 glass border border-white/20 text-white font-black rounded-2xl font-game tracking-wider hover:border-indigo-400/60 transition text-sm">
            ← KEMBALI KE DUNIA
          </motion.button>
        </div>
      </div>
    </div>
  );
}
