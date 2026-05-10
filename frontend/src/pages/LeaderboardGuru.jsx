import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const RANK_STYLE = [
  { bg: 'from-amber-300 to-yellow-400', text: 'text-amber-900', label: '🏆', glow: 'shadow-md' },
  { bg: 'from-stone-200 to-stone-300',  text: 'text-stone-700', label: '🥈', glow: 'shadow-sm' },
  { bg: 'from-orange-200 to-orange-300',text: 'text-orange-900', label: '🥉', glow: 'shadow-sm' },
];

export default function LeaderboardGuru() {
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
    <div className="min-h-screen text-stone-800 city-bg bg-academy">
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-10">
          <p className="text-xs text-amber-600 font-bold tracking-[0.3em] uppercase mb-2">◈ Mode Layar Proyeksi Guru ◈</p>
          <h1 className="font-serif font-black text-4xl md:text-6xl text-stone-800 mb-2 drop-shadow-sm">LIVE LEADERBOARD KELAS</h1>
          <p className="text-stone-600 text-sm md:text-base font-bold bg-white/50 inline-block px-4 py-1 rounded-full shadow-sm">
            Tampilan khusus presentasi • Diperbarui otomatis setiap 8 detik
          </p>
        </motion.div>

        {/* Table */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden border-2 border-stone-200 shadow-xl">
          {/* Table Header */}
          <div className="bg-stone-50/80 px-6 py-5 border-b border-stone-200 flex items-center justify-between">
            <h3 className="font-black text-base text-stone-700 uppercase tracking-widest">Peringkat Pemain</h3>
            <div className="flex items-center gap-2 text-xs text-emerald-600 font-black border-2 border-emerald-200 bg-emerald-50 px-3 py-1.5 rounded-lg shadow-sm">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />SIARAN LANGSUNG
            </div>
          </div>

          {isLoading ? (
            <div className="p-20 flex flex-col items-center justify-center text-stone-500">
              <div className="w-16 h-16 border-4 border-stone-200 border-t-amber-400 rounded-full animate-spin mb-4 shadow-sm"></div>
              <p className="font-bold text-sm tracking-widest animate-pulse">SINKRONISASI DATA...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="p-20 text-center">
              <div className="text-6xl mb-4 text-stone-300 drop-shadow-sm">📉</div>
              <p className="text-stone-500 font-bold text-lg">Belum ada murid yang menyelesaikan level satupun.</p>
              <p className="text-stone-400 text-sm mt-2">Ayo beri semangat pada murid!</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              <AnimatePresence>
                {students.map((std, i) => {
                  const rs = RANK_STYLE[i] || null;
                  return (
                    <motion.div key={std.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={`flex items-center gap-4 px-6 md:px-8 py-5 hover:bg-stone-50 transition-colors ${i === 0 ? 'bg-amber-50/70' : 'bg-white/80'}`}
                    >
                      {/* Rank badge */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shrink-0 border-2 ${rs ? `bg-gradient-to-br border-white shadow-sm ${rs.bg} ${rs.text} ${rs.glow}` : 'bg-stone-100 border-stone-200 text-stone-500'}`}>
                        {rs ? rs.label : i + 1}
                      </div>

                      {/* Avatar */}
                      <div className={`w-12 h-12 rounded-xl ${i === 0 ? 'bg-amber-200 text-amber-800' : i === 1 ? 'bg-stone-200 text-stone-700' : i === 2 ? 'bg-orange-200 text-orange-800' : 'bg-blue-100 text-blue-700'} flex items-center justify-center font-black text-xl shrink-0 shadow-sm border border-white`}>
                        {std.name.charAt(0).toUpperCase()}
                      </div>

                      {/* Name + Status */}
                      <div className="flex-1 min-w-0">
                        <p className={`font-black text-lg md:text-xl truncate ${i === 0 ? 'text-amber-700' : 'text-stone-800'}`}>{std.name}</p>
                        <p className="text-sm text-stone-500 font-bold uppercase tracking-wider">No. Absen: <span className="text-stone-700">{std.absen}</span></p>
                      </div>

                      {/* Status badge */}
                      <div className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black border-2 ${std.is_complete ? 'bg-emerald-100 border-emerald-200 text-emerald-700 shadow-sm' : 'bg-amber-100 border-amber-200 text-amber-700 shadow-sm'}`}>
                        <span className={`w-2 h-2 rounded-full ${std.is_complete ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                        {std.is_complete ? 'LULUS SEMUA' : 'SEDANG BERMAIN'}
                      </div>

                      {/* Stars */}
                      <div className="text-center hidden md:block w-24">
                        <p className="text-amber-500 font-black text-lg drop-shadow-sm">★ {std.total_bintang}</p>
                        <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest mt-0.5">BINTANG</p>
                      </div>

                      {/* Points */}
                      <div className="text-right w-24 md:w-32">
                        <p className={`font-black text-2xl md:text-3xl font-serif ${i === 0 ? 'text-amber-600 drop-shadow-sm' : 'text-stone-700'}`}>{std.total_poin}</p>
                        <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest mt-0.5">TOTAL POIN</p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="mt-12 flex justify-center">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/admin')}
            className="px-8 py-4 bg-white/80 backdrop-blur-md border-2 border-stone-200 shadow-md text-stone-700 font-black rounded-2xl hover:border-blue-300 hover:text-blue-600 hover:bg-white transition-colors text-sm uppercase tracking-widest flex items-center gap-3">
            <span className="text-xl">👨‍🏫</span> KEMBALI KE PANEL GURU
          </motion.button>
        </div>
      </div>
    </div>
  );
}
