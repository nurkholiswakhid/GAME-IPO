import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const RANK_STYLE = [
  { bg: 'from-amber-300 to-yellow-400', text: 'text-amber-900', label: '🏆', glow: 'shadow-md' },
  { bg: 'from-stone-200 to-stone-300',  text: 'text-stone-700', label: '🥈', glow: 'shadow-sm' },
  { bg: 'from-orange-200 to-orange-300',text: 'text-orange-900', label: '🥉', glow: 'shadow-sm' },
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
    <div className="min-h-screen text-stone-800 city-bg bg-academy">
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-10">

          <p className="text-xs text-amber-600 font-bold tracking-[0.3em] uppercase mb-2">◈ Papan Prestasi ◈</p>
          <h1 className="font-serif font-black text-4xl md:text-5xl text-stone-800 mb-2">PAPAN PERINGKAT</h1>
          <p className="text-stone-500 text-sm font-bold">Peringkat kelas diperbarui otomatis setiap 8 detik</p>
        </motion.div>

        {/* Table */}
        <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-md">
          {/* Table Header */}
          <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex items-center justify-between">
            <h3 className="font-bold text-sm text-stone-600 uppercase tracking-widest">Peringkat Pemain</h3>
            <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold border border-emerald-200 bg-emerald-50 px-2 py-1 rounded-md">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />LANGSUNG
            </div>
          </div>

          {isLoading ? (
            <div className="p-20 flex flex-col items-center justify-center text-stone-500">
              <div className="w-12 h-12 border-4 border-stone-200 border-t-amber-400 rounded-full animate-spin mb-4"></div>
              <p className="font-bold text-sm tracking-widest animate-pulse">MEMUAT PERINGKAT...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="p-20 text-center">
              <div className="text-5xl mb-4 text-stone-300">...</div>
              <p className="text-stone-500 font-bold">Belum ada pemain yang menyelesaikan level apapun.</p>
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
                      className={`flex items-center gap-4 px-6 py-4 hover:bg-stone-50 transition-colors ${i === 0 ? 'bg-amber-50' : 'bg-white'}`}
                    >
                      {/* Rank badge */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border ${rs ? `bg-gradient-to-br border-white ${rs.bg} ${rs.text} ${rs.glow}` : 'bg-stone-100 border-stone-200 text-stone-500'}`}>
                        {rs ? rs.label : i + 1}
                      </div>

                      {/* Avatar */}
                      <div className={`w-10 h-10 rounded-xl ${i === 0 ? 'bg-amber-200 text-amber-800' : i === 1 ? 'bg-stone-200 text-stone-700' : i === 2 ? 'bg-orange-200 text-orange-800' : 'bg-blue-100 text-blue-700'} flex items-center justify-center font-black text-base shrink-0 shadow-sm border border-white`}>
                        {std.name.charAt(0).toUpperCase()}
                      </div>

                      {/* Name + Status */}
                      <div className="flex-1 min-w-0">
                        <p className={`font-black text-base truncate ${i === 0 ? 'text-amber-700' : 'text-stone-800'}`}>{std.name}</p>
                        <p className="text-xs text-stone-500 font-bold uppercase">Absen #{std.absen}</p>
                      </div>

                      {/* Status badge */}
                      <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${std.is_complete ? 'bg-emerald-100 border-emerald-200 text-emerald-700' : 'bg-amber-100 border-amber-200 text-amber-700'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${std.is_complete ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                        {std.is_complete ? 'LULUS' : 'BERMING'}
                      </div>

                      {/* Stars */}
                      <div className="text-center hidden sm:block w-16">
                        <p className="text-amber-500 font-black text-sm drop-shadow-sm">★ {std.total_bintang}</p>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">BINTANG</p>
                      </div>

                      {/* Points */}
                      <div className="text-right w-20">
                        <p className={`font-black text-xl font-serif ${i === 0 ? 'text-amber-600' : 'text-stone-700'}`}>{std.total_poin}</p>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">POIN</p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="mt-10 flex justify-center">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/dashboard')}
            className="px-10 py-4 bg-white border border-stone-200 shadow-sm text-stone-600 font-bold rounded-2xl hover:border-amber-300 hover:text-amber-600 transition-colors text-sm uppercase tracking-wide">
            ← Kembali Petualangan
          </motion.button>
        </div>
      </div>
    </div>
  );
}
